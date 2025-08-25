import type { Draggable } from '../draggable/draggable.js';
import type { Droppable } from '../droppable/droppable.js';
import type { DndContext, DndContextEventType, DndContextEventCallbacks } from './dnd-context.js';
import { FastObjectPool } from '../utils/fast-object-pool.js';
import { getIntersectionRect } from '../utils/get-intersection-rect.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';
import { createRect } from '../utils/create-rect.js';
import { Rect } from '../types.js';

export interface CollisionData {
  droppableId: Symbol;
  droppableRect: Rect;
  draggableRect: Rect;
  intersectionRect: Rect;
  intersectionScore: number;
}

const TEMP_COLLISION_DATA: CollisionData = {
  droppableId: Symbol(),
  droppableRect: createRect(),
  draggableRect: createRect(),
  intersectionRect: createRect(),
  intersectionScore: 0,
} as const;

const COLLISIONS: CollisionData[] = [];

export interface CollisionDetectorOptions<T extends CollisionData = CollisionData> {
  getCollisionData?: (draggable: Draggable<any>, droppable: Droppable) => T | null;
  sortCollisions?: (draggable: Draggable<any>, collisions: T[]) => T[];
  mergeCollisionData?: (target: T, source: T) => T;
  createCollisionData?: (source: T) => T;
}

export const CollisionDetectorDefaultOptions = {
  getCollisionData: <T extends CollisionData = CollisionData>(
    draggable: Draggable<any>,
    droppable: Droppable,
    result: T = TEMP_COLLISION_DATA as T,
  ): T | null => {
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect) return null;

    const intersectionRect = getIntersectionRect(
      draggableRect,
      droppableRect,
      result.intersectionRect,
    );
    if (intersectionRect === null) return null;

    const intersectionScore = getIntersectionScore(draggableRect, droppableRect, intersectionRect);
    if (intersectionScore <= 0) return null;

    result.droppableId = droppable.id;
    createRect(droppableRect, result.droppableRect);
    createRect(draggableRect, result.draggableRect);
    result.intersectionScore = intersectionScore;
    return result;
  },
  mergeCollisionData: <T extends CollisionData = CollisionData>(target: T, source: T): T => {
    target.droppableId = source.droppableId;
    target.intersectionScore = source.intersectionScore;
    createRect(source.droppableRect, target.droppableRect);
    createRect(source.draggableRect, target.draggableRect);
    createRect(source.intersectionRect, target.intersectionRect);
    return target;
  },
  createCollisionData: <T extends CollisionData = CollisionData>(source: T): T => {
    return {
      droppableId: source.droppableId,
      droppableRect: createRect(source.droppableRect),
      draggableRect: createRect(source.draggableRect),
      intersectionRect: createRect(source.intersectionRect),
      intersectionScore: source.intersectionScore,
    } as T;
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
} as const;

export class CollisionDetector<T extends CollisionData = CollisionData> {
  protected _listenerId: Symbol;
  protected _dndContext: DndContext<T>;
  protected _collisionDataPool: FastObjectPool<T, [T]>;
  getCollisionData: (draggable: Draggable<any>, droppable: Droppable) => T | null;
  createCollisionData: (source: T) => T;
  mergeCollisionData: (target: T, source: T) => T;
  sortCollisions: (draggable: Draggable<any>, collisions: T[]) => T[];

  constructor(
    dndContext: DndContext<T>,
    {
      getCollisionData = CollisionDetectorDefaultOptions.getCollisionData,
      sortCollisions = CollisionDetectorDefaultOptions.sortCollisions,
      mergeCollisionData = CollisionDetectorDefaultOptions.mergeCollisionData,
      createCollisionData = CollisionDetectorDefaultOptions.createCollisionData,
    }: CollisionDetectorOptions<T> = {},
  ) {
    this._listenerId = Symbol();
    this._dndContext = dndContext;
    this._collisionDataPool = new FastObjectPool<T, [T]>((item, data) => {
      return item ? this.mergeCollisionData(item, data) : this.createCollisionData(data);
    });
    this.getCollisionData = getCollisionData;
    this.mergeCollisionData = mergeCollisionData;
    this.createCollisionData = createCollisionData;
    this.sortCollisions = sortCollisions;

    // Bind needed event handlers.
    this._onRemoveDroppable = this._onRemoveDroppable.bind(this);

    // We only ever need to have as many items in the collision data pool as
    // there are droppables.
    this._dndContext.on('removeDroppable', this._onRemoveDroppable, this._listenerId);
  }

  protected _onRemoveDroppable(
    _e: Parameters<DndContextEventCallbacks<T>[typeof DndContextEventType.RemoveDroppable]>[0],
  ) {
    this._collisionDataPool.resetItems(this._dndContext.droppables.size);
  }

  detectCollisions(
    draggable: Draggable<any>,
    targets: Set<Droppable>,
    collisionMap: Map<Droppable, T>,
  ) {
    // Reset the collision map.
    collisionMap.clear();

    // Detect collisions between the draggable and all targets.
    for (const droppable of targets) {
      const collisionData = this.getCollisionData(draggable, droppable);
      if (collisionData !== null) {
        COLLISIONS.push(this._collisionDataPool.get(collisionData));
      }
    }

    // Sort the collisions.
    if (COLLISIONS.length > 1) {
      this.sortCollisions(draggable, COLLISIONS as T[]);
    }

    // Reset collision data pool pointer.
    this._collisionDataPool.resetPointer();

    // Create a map of droppable to collision data.
    const droppables = this._dndContext.droppables;
    for (const collisionData of COLLISIONS as T[]) {
      const droppable = droppables.get(collisionData.droppableId)!;
      collisionMap.set(droppable, collisionData);
    }

    // Reset the collisions array.
    COLLISIONS.length = 0;
  }

  destroy() {
    this._collisionDataPool.resetItems();
    this._dndContext.off('removeDroppable', this._listenerId);
  }
}
