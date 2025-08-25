import type { DndContext } from './dnd-context.js';
import type { CollisionData } from './collision-detector.js';
import type { Draggable } from '../draggable/draggable.js';
import type { Droppable } from '../droppable/droppable.js';
import type { Rect } from '../types.js';

import { CollisionDetector } from './collision-detector.js';
import { getRect } from '../utils/get-rect.js';
import { createRect } from '../utils/create-rect.js';
import { getIntersectionRect } from '../utils/get-intersection-rect.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';
import { getScrollableAncestors } from '../utils/get-scrollable-ancestors.js';

// TODO: Optimize stuff.
// 1. Avoid object allocation at all times like a plague.
// 2. Cache scrollable ancestors on drag start as they are very unlikely to
//    change.
// 3. Compute and cache the compounded clip chain rect for each draggable and
//    droppable on drag start and update the cache on scroll (of anything).
//    Note that DndContext has scroll listener in which it calls the
//    detectCollisions method. It queues the collisions detection on the next
//    read tick on scroll to be exact. It might be nice to have this info passed
//    to the collision detector so we could piggy back on the dnd context's
//    scroll listener and read tick.
// 4. Add a method to recompute all the cached stuff synchronously for cases
//    where the scrollable ancestors change.
// 5. In general it makes would be nice to have the following extra methods to
//    the collision detector:
//    - createCache: called on drag start before initial detectCollisions.
//    - clearCache: called on drag end/cancel or dnd context destroy.
//    - updateCache: called on scroll etc., before detectCollisions.

export interface CollisionDataExtended extends CollisionData {}

const TEMP_COLLISION_DATA: CollisionDataExtended = {
  droppableId: Symbol(),
  droppableRect: createRect(),
  draggableRect: createRect(),
  intersectionRect: createRect(),
  intersectionScore: 0,
} as const;

const DROPPABLE_CHAIN: Element[] = [];
const DRAGGABLE_CHAIN: Element[] = [];
const DROPPABLE_ANCESTORS: Element[] = [];
const DRAGGABLE_ANCESTORS: Element[] = [];

function clearCache() {
  DROPPABLE_CHAIN.length = 0;
  DRAGGABLE_CHAIN.length = 0;
  DROPPABLE_ANCESTORS.length = 0;
  DRAGGABLE_ANCESTORS.length = 0;
}

function computeVisibleRect(
  rect: Rect,
  scrollContainers: Element[],
  result = { ...rect },
): Rect | null {
  // Make sure to initialize the result with the original rect.
  createRect(rect, result);

  // Compute the visible part of the rect by intersecting it with the scroll
  // containers. If there's no intersection, return null.
  for (const scrollContainer of scrollContainers) {
    const scrollContainerRect = getRect([scrollContainer, 'padding'], window);
    const intersection = getIntersectionRect(result, scrollContainerRect, result);
    if (!intersection) return null;
  }

  return result;
}

/**
 * Collision detector that uses the droppable's visible rectangle as seen through the
 * draggable's viewport formed by the lowest common scroll container and each side's unique
 * scrollable ancestors. All DOM reads happen inside getCollisionData; no DOM writes.
 */
export class VisibleRectCollisionDetector<
  T extends CollisionDataExtended = CollisionDataExtended,
> extends CollisionDetector<T> {
  constructor(dndContext: DndContext<T>) {
    super(dndContext, {
      getCollisionData: (draggable: Draggable<any>, droppable: Droppable) => {
        const draggableRect = draggable.getClientRect();
        if (!draggableRect) return null;

        const droppableRect = droppable.getClientRect();
        const draggableElement = draggable.drag?.items[0]?.element || null;

        getScrollableAncestors(draggableElement, DRAGGABLE_ANCESTORS);
        getScrollableAncestors(droppable.element, DROPPABLE_ANCESTORS);

        // Find first common scroll container (FCSC). There's always at least
        // window.
        let fcsc: Element | Window = window;
        for (const droppableAncestor of DROPPABLE_ANCESTORS) {
          if (DRAGGABLE_ANCESTORS.includes(droppableAncestor)) {
            fcsc = droppableAncestor;
            break;
          }
        }

        // Get draggale's scroll container chain.
        DRAGGABLE_CHAIN.length = 0;
        for (const draggableAncestor of DRAGGABLE_ANCESTORS) {
          if (draggableAncestor === fcsc) break;
          if (draggableAncestor instanceof Element) DRAGGABLE_CHAIN.push(draggableAncestor);
        }

        // Get droppable's scroll container chain.
        DROPPABLE_CHAIN.length = 0;
        for (const droppableAncestor of DROPPABLE_ANCESTORS) {
          if (droppableAncestor === fcsc) break;
          if (droppableAncestor instanceof Element) DROPPABLE_CHAIN.push(droppableAncestor);
        }

        // Compute droppable visible rect.
        const droppableVisibleRect = computeVisibleRect(
          droppableRect,
          DROPPABLE_CHAIN,
          TEMP_COLLISION_DATA.droppableRect,
        );
        if (!droppableVisibleRect) {
          clearCache();
          return null;
        }

        // Compute draggable visible rect.
        const draggableVisibleRect = computeVisibleRect(
          draggableRect,
          DRAGGABLE_CHAIN,
          TEMP_COLLISION_DATA.draggableRect,
        );
        if (!draggableVisibleRect) {
          clearCache();
          return null;
        }

        // Compute intersection rect between the visible rects.
        const intersectionRect = getIntersectionRect(
          draggableVisibleRect,
          droppableVisibleRect,
          TEMP_COLLISION_DATA.intersectionRect,
        );
        if (!intersectionRect) {
          clearCache();
          return null;
        }

        // Compute intersection score.
        const score = getIntersectionScore(
          draggableVisibleRect,
          droppableVisibleRect,
          intersectionRect,
        );
        if (score <= 0) {
          clearCache();
          return null;
        }

        TEMP_COLLISION_DATA.droppableId = droppable.id;
        TEMP_COLLISION_DATA.intersectionScore = score;

        clearCache();

        return TEMP_COLLISION_DATA as T;
      },
    });
  }
}
