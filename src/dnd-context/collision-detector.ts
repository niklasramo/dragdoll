import type { Draggable } from '../draggable/draggable.js';
import type { Droppable } from '../droppable/droppable.js';
import type { DndContext } from './dnd-context.js';
import { FastObjectPool } from '../utils/fast-object-pool.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';

// TODO: Ideally we want to take into account the droppable's and draggable's
// overflow ancestors when calculating collisions. If for example the droppable
// is inside a scrollable element and the draggable is e.g a sibling of that
// element, we want to clip the the bounding client rect of every droppable
// within that scrollable element to the scrollable element's bounds. Otherwise
// the draggable might be considered colliding with droppables that are clipped
// from view from the draggable's perspective. To do this, we'd need to compute
// and store the closest scrollable ancestor for every dragged draggable and
// their target droppables.

export interface CollisionData {
  id: Symbol;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
}

export class CollisionDetector<T extends CollisionData = CollisionData> {
  private listenerId: Symbol;
  private dndContext: DndContext;
  private collisionDataPool: FastObjectPool<T, [T]>;
  protected getCollisionData: (draggable: Draggable<any>, droppable: Droppable) => T | null;
  protected sortCollisions: (draggable: Draggable<any>, collisions: T[]) => T[];

  constructor(
    dndContext: DndContext,
    {
      getCollisionData = (draggable: Draggable<any>, droppable: Droppable): T | null => {
        const draggableRect = draggable.getClientRect();
        const droppableRect = droppable.getClientRect();
        if (!draggableRect) return null;
        const score = getIntersectionScore(draggableRect, droppableRect);
        if (score <= 0) return null;

        return {
          id: droppable.id,
          x: droppableRect.x,
          y: droppableRect.y,
          width: droppableRect.width,
          height: droppableRect.height,
          score,
        } as T;
      },
      sortCollisions = (_draggable, collisions: T[]) => {
        return collisions.sort((a, b) => {
          const diff = b.score - a.score;
          if (diff !== 0) return diff;
          return a.width * a.height - b.width * b.height;
        });
      },
    }: {
      getCollisionData?: (draggable: Draggable<any>, droppable: Droppable) => T | null;
      sortCollisions?: (draggable: Draggable<any>, collisions: T[]) => T[];
    } = {},
  ) {
    this.listenerId = Symbol();
    this.dndContext = dndContext;
    this.collisionDataPool = new FastObjectPool<T, [T]>((item, data) => {
      if (item) {
        Object.assign(item, data);
        return item;
      } else {
        return { ...data };
      }
    });
    this.getCollisionData = getCollisionData;
    this.sortCollisions = sortCollisions;

    // We only ever need to have as many items in the collision data pool as there
    // are droppables.
    this.dndContext.on(
      'removeDroppable',
      () => {
        this.collisionDataPool.resetItems(this.dndContext.droppables.size);
      },
      this.listenerId,
    );

    // Reset items when dnd context is destroyed.
    this.dndContext.on(
      'destroy',
      () => {
        this.collisionDataPool.resetItems();
      },
      this.listenerId,
    );
  }

  private static getRootDroppable(d: Droppable) {
    return d.parent === null;
  }

  private getDroppableFromCollisionData(c: T) {
    return this.dndContext.droppables.get(c.id)!;
  }

  detectCollisions(draggable: Draggable<any>, targets: Set<Droppable>): Map<Droppable, T> {
    // Start with root-level droppables (no parent).
    // TODO: We should store these in the dnd context for faster access.
    let currentBranch = Array.from(targets).filter(CollisionDetector.getRootDroppable);
    let bestMatches: T[] = [];

    // Keep going until we have no more branches to check.
    while (currentBranch.length > 0) {
      const branchMatches: T[] = [];

      for (const droppable of currentBranch) {
        const collisionData = this.getCollisionData(draggable, droppable);
        if (collisionData !== null) {
          branchMatches.push(this.collisionDataPool.get(collisionData));
        }
      }

      // If there are no matches, we can stop.
      if (!branchMatches.length) break;

      // Sort the collisions.
      this.sortCollisions(draggable, branchMatches);

      // Set the best matches.
      bestMatches = branchMatches;

      // Move to the next branch.
      currentBranch = Array.from(this.dndContext.droppables.get(branchMatches[0].id)!.children);
    }

    // Reset collision data pool pointer.
    this.collisionDataPool.resetPointer();

    // Create a map of droppable to collision data
    const result = new Map<Droppable, T>();
    for (const collisionData of bestMatches) {
      const droppable = this.getDroppableFromCollisionData(collisionData);
      result.set(droppable, collisionData);
    }

    return result;
  }

  destroy() {
    this.collisionDataPool.resetItems();
    this.dndContext.off('removeDroppable', this.listenerId);
    this.dndContext.off('destroy', this.listenerId);
  }
}
