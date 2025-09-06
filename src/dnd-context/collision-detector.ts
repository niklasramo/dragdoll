import type { Draggable } from '../draggable/draggable.js';
import type { Droppable } from '../droppable/droppable.js';
import type { DndContext } from './dnd-context.js';
import { FastObjectPool } from '../utils/fast-object-pool.js';
import { getIntersectionRect } from '../utils/get-intersection-rect.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';
import { createRect } from '../utils/create-rect.js';
import { Rect } from '../types.js';

// The max amount of collisions we keep in collision pool when we return it
// to the pool cache.
const MAX_CACHED_COLLISIONS = 20;

export interface CollisionData {
  droppableId: Symbol;
  droppableRect: Rect;
  draggableRect: Rect;
  intersectionRect: Rect;
  intersectionScore: number;
}

export interface CollisionDetectorOptions<T extends CollisionData = CollisionData> {
  checkCollision?: (draggable: Draggable<any>, droppable: Droppable, collisionData: T) => T | null;
  sortCollisions?: (draggable: Draggable<any>, collisions: T[]) => T[];
  createCollisionData?: () => T;
}

const EMPTY_SYMBOL = Symbol();

export const CollisionDetectorDefaultOptions = {
  checkCollision: <T extends CollisionData = CollisionData>(
    draggable: Draggable<any>,
    droppable: Droppable,
    collisionData: T,
  ): T | null => {
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
  },
  sortCollisions: <T extends CollisionData = CollisionData>(
    _draggable: Draggable<any>,
    collisions: T[],
  ): T[] => {
    return collisions.sort((a, b) => {
      const diff = b.intersectionScore - a.intersectionScore;
      if (diff !== 0) return diff;

      return (
        a.droppableRect.width * a.droppableRect.height -
        b.droppableRect.width * b.droppableRect.height
      );
    });
  },
  createCollisionData: <T extends CollisionData = CollisionData>(): T => {
    return {
      droppableId: EMPTY_SYMBOL,
      droppableRect: createRect(),
      draggableRect: createRect(),
      intersectionRect: createRect(),
      intersectionScore: 0,
    } as CollisionData as T;
  },
} as const;

export class CollisionDetector<T extends CollisionData = CollisionData> {
  protected _listenerId: Symbol;
  protected _dndContext: DndContext<T>;
  protected _collisionDataPoolCache: FastObjectPool<T, []>[];
  protected _collisionDataPoolMap: Map<Draggable<any>, FastObjectPool<T, []>>;
  checkCollision: (draggable: Draggable<any>, droppable: Droppable, collisionData: T) => T | null;
  sortCollisions: (draggable: Draggable<any>, collisions: T[]) => T[];
  createCollisionData: () => T;

  constructor(
    dndContext: DndContext<T>,
    {
      checkCollision = CollisionDetectorDefaultOptions.checkCollision,
      createCollisionData = CollisionDetectorDefaultOptions.createCollisionData,
      sortCollisions = CollisionDetectorDefaultOptions.sortCollisions,
    }: CollisionDetectorOptions<T> = {},
  ) {
    this._listenerId = Symbol();
    this._dndContext = dndContext;
    this._collisionDataPoolCache = [];
    this._collisionDataPoolMap = new Map();

    // These can be overriden anytime.
    this.checkCollision = checkCollision;
    this.sortCollisions = sortCollisions;
    this.createCollisionData = createCollisionData;
  }

  getCollisionDataPool(draggable: Draggable<any>): FastObjectPool<T, []> {
    let pool = this._collisionDataPoolMap.get(draggable);
    if (!pool) {
      pool =
        this._collisionDataPoolCache.pop() ||
        new FastObjectPool((item) => {
          return item || this.createCollisionData();
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

  detectCollisions(draggable: Draggable<any>, targets: Map<Symbol, Droppable>, collisions: T[]) {
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
      if (this.checkCollision(draggable, droppable, collisionData)) {
        collisions.push(collisionData);
        collisionData = null;
      }
    }

    // Sort the collisions.
    if (collisions.length > 1) {
      this.sortCollisions(draggable, collisions);
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
