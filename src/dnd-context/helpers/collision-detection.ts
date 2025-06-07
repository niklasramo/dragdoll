import type { Draggable } from '../../draggable/draggable.js';
import type { Droppable } from '../../droppable/droppable.js';
import type { DndContext } from '../../dnd-context/dnd-context.js';
import { FastObjectPool } from '../../utils/fast-object-pool.js';
import { getIntersectionScore } from '../../utils/get-intersection-score.js';

// TODO: Ideally we want to take into account the droppable's and draggable's
// overflow ancestors when calculating collisions. If for example the droppable
// is inside a scrollable element and the draggable is e.g a sibling of that
// element, we want to clip the the bounding client rect of every droppable
// within that scrollable element to the scrollable element's bounds. Otherwise
// the draggable might be considered colliding with droppables that are clipped
// from view from the draggable's perspective. To do this, we'd need to compute
// and store the closest scrollable ancestor for every dragged draggable and
// their target droppables.

export type CollisionData = {
  id: Symbol;
  x: number;
  y: number;
  width: number;
  height: number;
  score: number;
};

// A function to create a collision detection function.
export function createCollisionDetection(
  dndContext: DndContext,
  {
    getCollisionScore = (draggable: Draggable<any>, droppable: Droppable) => {
      const draggableRect = draggable.getClientRect();
      if (!draggableRect) return null;
      const score = getIntersectionScore(draggableRect, droppable.getClientRect());
      return score > 0 ? score : null;
    },
    sortCollisions = (_draggable, collisions: CollisionData[]) => {
      return collisions.sort((a, b) => {
        const diff = b.score - a.score;
        if (diff !== 0) return diff;
        return a.width * a.height - b.width * b.height;
      });
    },
  }: {
    getCollisionScore?: (draggable: Draggable<any>, droppable: Droppable) => number | null;
    sortCollisions?: (draggable: Draggable<any>, collisions: CollisionData[]) => CollisionData[];
  } = {},
) {
  const collisionDataPool = new FastObjectPool<CollisionData, [Droppable, number]>(
    (item, droppable, score) => {
      if (item) {
        Object.assign(item, droppable.getClientRect());
        item.id = droppable.id;
        item.score = score;
        return item;
      } else {
        return { id: droppable.id, ...droppable.getClientRect(), score };
      }
    },
  );
  const getRootDroppable = (d: Droppable) => d.parent === null;
  const getDroppableFromCollisionData = (c: CollisionData) => dndContext.droppables.get(c.id)!;

  // We only ever need to have as many items in the collision data pool as there
  // are droppables.
  dndContext.on('removeDroppable', () => {
    collisionDataPool.resetItems(dndContext.droppables.size);
  });

  // Reset items when dnd context is destroyed.
  dndContext.on('destroy', () => {
    collisionDataPool.resetItems();
  });

  return (draggable: Draggable<any>, targets: Set<Droppable>): Set<Droppable> => {
    // Start with root-level droppables (no parent).
    // TODO: We should store these in the dnd context for faster access.
    let currentBranch = Array.from(targets).filter(getRootDroppable);
    let bestMatches: CollisionData[] = [];

    // Keep going until we have no more branches to check.
    while (currentBranch.length > 0) {
      const branchMatches: CollisionData[] = [];

      for (const droppable of currentBranch) {
        const score = getCollisionScore(draggable, droppable);
        if (score !== null) {
          branchMatches.push(collisionDataPool.get(droppable, score));
        }
      }

      // If there are no matches, we can stop.
      if (!branchMatches.length) break;

      // Sort the collisions.
      sortCollisions(draggable, branchMatches);

      // Set the best matches.
      bestMatches = branchMatches;

      // Move to the next branch.
      currentBranch = Array.from(dndContext.droppables.get(branchMatches[0].id)!.children);
    }

    // Reset collision data pool pointer.
    collisionDataPool.resetPointer();

    return new Set(bestMatches.map(getDroppableFromCollisionData));
  };
}
