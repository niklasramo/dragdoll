import type { AnyDraggable } from '../draggable/draggable.js';
import type { Droppable, DroppableId } from '../droppable/droppable.js';
import type { Rect } from '../types.js';
import { createRect } from '../utils/create-rect.js';
import { getIntersectionRect } from '../utils/get-intersection-rect.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';
import { ObjectArena } from '../utils/object-arena.js';
import type { DndObserver } from './dnd-observer.js';

// The max amount of collisions we keep in collision pool when we return it
// to the pool cache.
const MAX_CACHED_COLLISIONS = 20;

// We use a symbol to represent an empty droppable id.
const EMPTY_SYMBOL = Symbol();

export interface CollisionData {
  droppableId: DroppableId;
  droppableRect: Rect;
  draggableRect: Rect;
  intersectionRect: Rect;
  intersectionScore: number;
}

export class CollisionDetector<T extends CollisionData = CollisionData> {
  protected _listenerId: symbol;
  protected _dndObserver: DndObserver<T>;
  protected _cdArenaPool: ObjectArena<T>[];
  protected _cdArenaMap: Map<AnyDraggable, ObjectArena<T>>;

  constructor(dndObserver: DndObserver<T>) {
    this._listenerId = Symbol();
    this._dndObserver = dndObserver;
    this._cdArenaPool = [];
    this._cdArenaMap = new Map();
  }

  protected _checkCollision(
    draggable: AnyDraggable,
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

  protected _sortCollisions(_draggable: AnyDraggable, collisions: T[]): T[] {
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

  protected _getCollisionDataArena(draggable: AnyDraggable): ObjectArena<T> {
    let cdArena = this._cdArenaMap.get(draggable);
    if (!cdArena) {
      cdArena =
        this._cdArenaPool.pop() ||
        new ObjectArena((item) => {
          return item || this._createCollisionData();
        });
      this._cdArenaMap.set(draggable, cdArena);
    }
    return cdArena;
  }

  protected _removeCollisionDataArena(draggable: AnyDraggable) {
    const cdArena = this._cdArenaMap.get(draggable);
    if (cdArena) {
      cdArena.truncate(MAX_CACHED_COLLISIONS);
      cdArena.reset();
      this._cdArenaPool.push(cdArena);
      this._cdArenaMap.delete(draggable);
    }
  }

  detectCollisions(draggable: AnyDraggable, targets: Map<DroppableId, Droppable>, collisions: T[]) {
    // Reset the collisions array and colliding droppables set.
    collisions.length = 0;

    // If we don't have any targets, we can bail early.
    if (!targets.size) {
      return;
    }

    // Get or create the collision data pool for the draggable.
    const cdArena = this._getCollisionDataArena(draggable);

    // Detect collisions between the draggable and all targets.
    let collisionData: T | null = null;
    const droppables = targets.values();
    for (const droppable of droppables) {
      collisionData = collisionData || cdArena.allocate();
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
    cdArena.reset();
  }

  destroy() {
    this._cdArenaMap.forEach((cdArena) => {
      cdArena.truncate();
    });
  }
}
