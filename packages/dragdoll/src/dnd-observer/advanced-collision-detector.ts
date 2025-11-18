import type { AnyDraggable } from '../draggable/draggable.js';
import type { Droppable } from '../droppable/droppable.js';
import type { Rect } from '../types.js';
import { createRect } from '../utils/create-rect.js';
import { getClipAncestors } from '../utils/get-clip-ancestors.js';
import { getIntersectionRect } from '../utils/get-intersection-rect.js';
import { getIntersectionScore } from '../utils/get-intersection-score.js';
import { getRect } from '../utils/get-rect.js';
import type { CollisionData } from './collision-detector.js';
import { CollisionDetector } from './collision-detector.js';
import type { DndObserver } from './dnd-observer.js';

interface DragState {
  clipMaskKeyMap: Map<Droppable, Element | Window>;
  clipMaskMap: Map<Element | Window, [Rect, Rect]>;
  cacheDirty: boolean;
}

let cachedDraggableClipMaskRect: Rect | null;

const EMPTY_RECT: Rect = createRect();
const MAX_RECT: Rect = {
  width: Number.MAX_SAFE_INTEGER,
  height: Number.MAX_SAFE_INTEGER,
  x: Number.MAX_SAFE_INTEGER * -0.5,
  y: Number.MAX_SAFE_INTEGER * -0.5,
};
const DRAGGABLE_CLIP_ANCESTORS: (Element | Window)[] = [];
const DROPPABLE_CLIP_ANCESTORS: (Element | Window)[] = [];
const DRAGGABLE_CLIP_CHAIN: (Element | Window)[] = [];
const DROPPABLE_CLIP_CHAIN: (Element | Window)[] = [];

function computeDraggableClipAncestors(draggable: AnyDraggable) {
  if (!DRAGGABLE_CLIP_ANCESTORS.length) {
    const dragContainer = draggable.drag?.items?.[0]?.dragContainer;
    if (dragContainer) {
      getClipAncestors(dragContainer, true, DRAGGABLE_CLIP_ANCESTORS);
    } else {
      DRAGGABLE_CLIP_ANCESTORS.push(window);
    }
  }
}

function computeDroppableClipAncestors(droppable: Droppable) {
  if (!DROPPABLE_CLIP_ANCESTORS.length) {
    getClipAncestors(droppable.element, false, DROPPABLE_CLIP_ANCESTORS);
  }
}

function getRecursiveIntersectionRect(elements: (Element | Window)[], result: Rect = createRect()) {
  // Initialize with first element or empty rect.
  createRect(elements.length ? getRect([elements[0], 'padding'], window) : MAX_RECT, result);

  // Compute intersection with remaining elements.
  for (let i = 1; i < elements.length; i++) {
    const el = elements[i];
    const rect = getRect([el, 'padding'], window);
    if (!getIntersectionRect(result, rect, result)) {
      createRect(EMPTY_RECT, result);
      break;
    }
  }

  return result;
}

export interface AdvancedCollisionData extends CollisionData {
  draggableVisibleRect: Rect;
  droppableVisibleRect: Rect;
}

export class AdvancedCollisionDetector<
  T extends AdvancedCollisionData = AdvancedCollisionData,
> extends CollisionDetector<T> {
  protected _dragStates: Map<AnyDraggable, DragState>;
  protected _visibilityLogic: 'relative' | 'absolute';
  protected _listenersAttached: boolean;
  protected _clearCache: () => void;

  constructor(dndObserver: DndObserver<T>, options?: { visibilityLogic: 'relative' | 'absolute' }) {
    super(dndObserver);
    this._dragStates = new Map();
    this._visibilityLogic = options?.visibilityLogic || 'relative';
    this._listenersAttached = false;
    this._clearCache = () => this.clearCache();
  }

  protected override _checkCollision(
    draggable: AnyDraggable,
    droppable: Droppable,
    collisionData: T,
  ) {
    // Get the drag state.
    const state = this._dragStates.get(draggable);
    if (!state) return null;

    // Get the draggable and droppable rects.
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect || !droppableRect) return null;

    // Get the clip mask key.
    let clipMaskKey = state.clipMaskKeyMap.get(droppable);

    // If we don't have a clip mask key, compute it and also the clip masks if
    // there is no entry yet for this clip mask key.
    if (!clipMaskKey) {
      const isRelativeLogic = this._visibilityLogic === 'relative';

      // Reset temp data before computing (just a safety measure).
      DROPPABLE_CLIP_ANCESTORS.length = 0;
      DRAGGABLE_CLIP_CHAIN.length = 0;
      DROPPABLE_CLIP_CHAIN.length = 0;

      // Compute the droppable clip ancestors.
      computeDroppableClipAncestors(droppable);

      // Use the first clip container as the clip mask key.
      clipMaskKey = DROPPABLE_CLIP_ANCESTORS[0] || window;

      // Store the clip mask key.
      state.clipMaskKeyMap.set(droppable, clipMaskKey);

      // If there is no entry yet for this clip mask key, compute the clip
      // masks.
      if (!state.clipMaskMap.has(clipMaskKey)) {
        computeDraggableClipAncestors(draggable);

        // For relative visibility logic, we need to compute the clip chains up
        // to the FCCC.
        if (isRelativeLogic) {
          // Find first common clip container (FCCC).
          let fccc: Element | Window = window;
          for (const droppableClipAncestor of DROPPABLE_CLIP_ANCESTORS) {
            if (DRAGGABLE_CLIP_ANCESTORS.includes(droppableClipAncestor)) {
              fccc = droppableClipAncestor;
              break;
            }
          }

          // Get draggable's clip container chain.
          for (const draggableClipAncestor of DRAGGABLE_CLIP_ANCESTORS) {
            if (draggableClipAncestor === fccc) break;
            DRAGGABLE_CLIP_CHAIN.push(draggableClipAncestor);
          }

          // Get droppable's clip container chain.
          for (const droppableClipAncestor of DROPPABLE_CLIP_ANCESTORS) {
            if (droppableClipAncestor === fccc) break;
            DROPPABLE_CLIP_CHAIN.push(droppableClipAncestor);
          }
        }
        // For absolute visibility logic the clip chains are equal to the clip
        // ancestors.
        else {
          DRAGGABLE_CLIP_CHAIN.push(...DRAGGABLE_CLIP_ANCESTORS);
          DROPPABLE_CLIP_CHAIN.push(...DROPPABLE_CLIP_ANCESTORS);
        }

        // Compute clip masks.
        const draggableClipMask =
          isRelativeLogic || !cachedDraggableClipMaskRect
            ? getRecursiveIntersectionRect(DRAGGABLE_CLIP_CHAIN)
            : createRect(cachedDraggableClipMaskRect);
        const droppableClipMask = getRecursiveIntersectionRect(DROPPABLE_CLIP_CHAIN);

        // Cache the draggable clip mask rect for absolute visibility logic.
        // Unlike with relative visibility logic, the draggable clip mask rect
        // needs to be computed only once, not for each droppable.
        if (!isRelativeLogic && !cachedDraggableClipMaskRect) {
          cachedDraggableClipMaskRect = draggableClipMask;
        }

        // Cache the clip masks.
        state.clipMaskMap.set(clipMaskKey, [draggableClipMask, droppableClipMask]);
      }

      // Reset temp data.
      DROPPABLE_CLIP_ANCESTORS.length = 0;
      DRAGGABLE_CLIP_CHAIN.length = 0;
      DROPPABLE_CLIP_CHAIN.length = 0;
    }

    // Get the clip masks.
    const [draggableClipMask, droppableClipMask] = state.clipMaskMap.get(clipMaskKey) || [];
    if (!draggableClipMask || !droppableClipMask) return null;

    // Compute the draggable visible rect.
    if (
      !getIntersectionRect(draggableRect, draggableClipMask, collisionData.draggableVisibleRect)
    ) {
      return null;
    }

    // Compute the droppable visible rect.
    if (
      !getIntersectionRect(droppableRect, droppableClipMask, collisionData.droppableVisibleRect)
    ) {
      return null;
    }

    // Compute the intersection rect.
    if (
      !getIntersectionRect(
        collisionData.draggableVisibleRect,
        collisionData.droppableVisibleRect,
        collisionData.intersectionRect,
      )
    ) {
      return null;
    }

    // Compute the intersection score.
    const score = getIntersectionScore(
      collisionData.draggableVisibleRect,
      collisionData.droppableVisibleRect,
      collisionData.intersectionRect,
    );
    if (score <= 0) return null;

    // Set the collision data.
    collisionData.droppableId = droppable.id;
    createRect(droppableRect, collisionData.droppableRect);
    createRect(draggableRect, collisionData.draggableRect);
    collisionData.intersectionScore = score;

    // Return the collision data.
    return collisionData;
  }

  protected override _sortCollisions(_draggable: AnyDraggable, collisions: T[]) {
    return collisions.sort((a, b) => {
      const diff = b.intersectionScore - a.intersectionScore;
      if (diff !== 0) return diff;

      return (
        a.droppableVisibleRect.width * a.droppableVisibleRect.height -
        b.droppableVisibleRect.width * b.droppableVisibleRect.height
      );
    });
  }

  protected override _createCollisionData() {
    const data = super._createCollisionData();
    data.droppableVisibleRect = createRect();
    data.draggableVisibleRect = createRect();
    return data;
  }

  protected _getDragState(draggable: AnyDraggable) {
    let state = this._dragStates.get(draggable);
    if (state) return state;

    // Create the state.
    state = {
      clipMaskKeyMap: new Map(),
      clipMaskMap: new Map(),
      cacheDirty: true,
    };

    // Store the state.
    this._dragStates.set(draggable, state);

    // Attach global listeners if needed.
    if (!this._listenersAttached) {
      window.addEventListener('scroll', this._clearCache, {
        capture: true,
        passive: true,
      });
      window.addEventListener('resize', this._clearCache, { passive: true });
      this._listenersAttached = true;
    }

    return state;
  }

  protected override _getCollisionDataArena(draggable: AnyDraggable) {
    this._getDragState(draggable);
    return super._getCollisionDataArena(draggable);
  }

  protected override _removeCollisionDataArena(draggable: AnyDraggable) {
    if (this._dragStates.delete(draggable)) {
      if (this._dndObserver.drags.size <= 0) {
        if (this._listenersAttached) {
          window.removeEventListener('scroll', this._clearCache, { capture: true });
          window.removeEventListener('resize', this._clearCache);
          this._listenersAttached = false;
        }
      }
    }
    super._removeCollisionDataArena(draggable);
  }

  override detectCollisions(
    draggable: AnyDraggable,
    targets: Map<Droppable['id'], Droppable>,
    collisions: T[],
  ) {
    // Reset draggable clip ancestors before computing (just a safety measure).
    DRAGGABLE_CLIP_ANCESTORS.length = 0;

    // Reset cached draggable clip mask rect before computing (just a safety
    // measure).
    cachedDraggableClipMaskRect = null;

    // Clear the clip masks maps if the cache is dirty.
    const state = this._getDragState(draggable);
    if (state.cacheDirty) {
      state.clipMaskKeyMap.clear();
      state.clipMaskMap.clear();
      state.cacheDirty = false;
    }

    super.detectCollisions(draggable, targets, collisions);

    // Reset draggable clip ancestors after computing.
    DRAGGABLE_CLIP_ANCESTORS.length = 0;

    // Reset draggable clip mask rect.
    cachedDraggableClipMaskRect = null;
  }

  clearCache(draggable?: AnyDraggable) {
    if (draggable) {
      const state = this._dragStates.get(draggable);
      if (state) state.cacheDirty = true;
    } else {
      this._dragStates.forEach((state) => {
        state.cacheDirty = true;
      });
    }
  }
}
