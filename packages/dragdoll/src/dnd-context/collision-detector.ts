import type { Draggable } from '../draggable/draggable.js';
import type { Droppable, DroppableId } from '../droppable/droppable.js';
import { Rect } from '../types.js';
import { createRect } from '../utils/create-rect.js';
import { FastObjectPool } from '../utils/fast-object-pool.js';
import { getIntersectionRect } from '../utils/get-intersection-rect.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';
import type { DndContext } from './dnd-context.js';

// The max amount of collisions we keep in collision pool when we return it
// to the pool cache.
const MAX_CACHED_COLLISIONS = 20;

// We use a symbol to represent an empty droppable id.
const EMPTY_SYMBOL = Symbol();

// TODO: Should we use droppable references instead of id? Using the reference
// is a bit more work, but not much, as we'd need to clean up the old references
// on each collision detection cycle. However, it would improve DX quite a bit
// if we could provide the droppable reference instead of id.
export interface CollisionData {
  droppableId: DroppableId;
  droppableRect: Rect;
  draggableRect: Rect;
  intersectionRect: Rect;
  intersectionScore: number;
}

export class CollisionDetector<T extends CollisionData = CollisionData> {
  protected _listenerId: symbol;
  protected _dndContext: DndContext<T>;
  protected _collisionDataPoolCache: FastObjectPool<T, []>[];
  protected _collisionDataPoolMap: Map<Draggable<any>, FastObjectPool<T, []>>;

  constructor(dndContext: DndContext<T>) {
    this._listenerId = Symbol();
    this._dndContext = dndContext;
    this._collisionDataPoolCache = [];
    this._collisionDataPoolMap = new Map();
  }

  protected _checkCollision(
    draggable: Draggable<any>,
    droppable: Droppable,
    collisionData: T,
  ): T | null {
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect) return null;

    const intersectionRect = getIntersectionRect(
      draggableRect,
      droppableRect,
      collisionData.intersectionRect,
    );
    if (intersectionRect === null) return null;

    const intersectionScore = getIntersectionScore(draggableRect, droppableRect, intersectionRect);
    if (intersectionScore <= 0) return null;

    collisionData.droppableId = droppable.id;
    createRect(droppableRect, collisionData.droppableRect);
    createRect(draggableRect, collisionData.draggableRect);
    collisionData.intersectionScore = intersectionScore;
    return collisionData;
  }

  protected _sortCollisions(_draggable: Draggable<any>, collisions: T[]): T[] {
    return collisions.sort((a, b) => {
      const diff = b.intersectionScore - a.intersectionScore;
      if (diff !== 0) return diff;

      return (
        a.droppableRect.width * a.droppableRect.height -
        b.droppableRect.width * b.droppableRect.height
      );
    });
  }

  protected _createCollisionData(): T {
    return {
      droppableId: EMPTY_SYMBOL,
      droppableRect: createRect(),
      draggableRect: createRect(),
      intersectionRect: createRect(),
      intersectionScore: 0,
    } as T;
  }

  getCollisionDataPool(draggable: Draggable<any>): FastObjectPool<T, []> {
    let pool = this._collisionDataPoolMap.get(draggable);
    if (!pool) {
      pool =
        this._collisionDataPoolCache.pop() ||
        new FastObjectPool((item) => {
          return item || this._createCollisionData();
        });
      this._collisionDataPoolMap.set(draggable, pool);
    }
    return pool;
  }

  removeCollisionDataPool(draggable: Draggable<any>) {
    const pool = this._collisionDataPoolMap.get(draggable);
    if (pool) {
      pool.resetItems(MAX_CACHED_COLLISIONS);
      pool.resetPointer();
      this._collisionDataPoolCache.push(pool);
      this._collisionDataPoolMap.delete(draggable);
    }
  }

  detectCollisions(
    draggable: Draggable<any>,
    targets: Map<DroppableId, Droppable>,
    collisions: T[],
  ) {
    // Reset the collisions array and colliding droppables set.
    collisions.length = 0;

    // If we don't have any targets, we can bail early.
    if (!targets.size) {
      return;
    }

    // Get or create the collision data pool for the draggable.
    const collisionDataPool = this.getCollisionDataPool(draggable);

    // Detect collisions between the draggable and all targets.
    let collisionData: T | null = null;
    const droppables = targets.values();
    for (const droppable of droppables) {
      collisionData = collisionData || collisionDataPool.get();
      if (this._checkCollision(draggable, droppable, collisionData)) {
        collisions.push(collisionData);
        collisionData = null;
      }
    }

    // Sort the collisions.
    if (collisions.length > 1) {
      this._sortCollisions(draggable, collisions);
    }

    // Reset collision data pool pointer.
    collisionDataPool.resetPointer();
  }

  destroy() {
    this._collisionDataPoolMap.forEach((pool) => {
      pool.resetItems();
    });
  }
}
