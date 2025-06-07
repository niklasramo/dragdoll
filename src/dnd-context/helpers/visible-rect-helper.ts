// @ts-nocheck

import type { DndContext } from '../dnd-context.js';
import type { Draggable } from '../../draggable/draggable.js';
import type { Droppable } from '../../droppable/droppable.js';
import { Rect } from '../../types.js';
import { getClosestScrollableAncestor } from 'utils/get-closest-scrollable-ancestor.js';
import { getIntersection } from '../../utils/get-intersection.js';
import { isWindow } from '../../utils/is-window.js';
import { DndContextEventType } from '../dnd-context.js';

export class VisibleRectHelper {
  // Reference to the DndContext instance
  private dndContext: DndContext;

  // Symbol used as the listener ID for all event bindings
  private listenerId = Symbol();

  constructor(dndContext: DndContext) {
    this.dndContext = dndContext;

    // Listen for drag start: build cache for the active draggable
    dndContext.on(
      DndContextEventType.Start,
      ({ draggable, targets }) => this.onDragStart(draggable, targets),
      this.listenerId,
    );

    // Listen for context destroy: cleanup all listeners and caches
    dndContext.on(DndContextEventType.Destroy, () => this.onDndContextDestroy(), this.listenerId);
  }

  private onDragStart(draggable: Draggable<any>, targets: Droppable[]) {
    const droppableIdMap = this.dndContext['_droppables'];
    const draggableData = this.dndContext.getData(draggable);
    const draggableElement = draggable.drag?.items[0]?.element;
    if (!draggableData || !draggableElement) return;
  }

  /**
   * Called when a new droppable is added. Updates the cache for all active
   * draggables.
   */
  private onAddDroppable(droppable: Droppable) {}

  private onDndContextDestroy() {}

  computeDroppableVisibleClientRect(droppable: Droppable, draggable: Draggable<any>): Rect {
    const draggableElement = draggable.drag?.items[0].element;
    const droppableElement = droppable.element;
    if (!draggableElement) return { x: 0, y: 0, width: 0, height: 0 };

    // Get the closest scrollable ancestor of droppable.
    const droppableScrollAncestor = getClosestScrollableAncestor(droppableElement);

    // Get droppable client rect.
    const visibleClientRect = { ...droppable.getClientRect() };

    // If the draggable is not within the same scroll container let's use the
    // droppableScrollAncestor's bounding client rect to clip the droppable's
    // normal bounding client rect. This does not cover the scenarios where
    // the droppable is within multiple scrollable ancestors or where the
    // draggable is within a different branch of scrollable elements. However,
    // those are weird edge cases which are uncommon in dnd scenarios.
    if (!isWindow(droppableScrollAncestor) && !droppableScrollAncestor.contains(draggableElement)) {
      getIntersection(
        // TODO: We want to cache this value for the duration of the collision
        // checks. Or maybe even store the droppable scroll ancestors and
        // automatically bust that cache on scroll.
        droppableScrollAncestor.getBoundingClientRect(),
        visibleClientRect,
        visibleClientRect,
      );
    }

    return visibleClientRect;
  }

  destroy() {
    // TODO: Clear data and listeners.
  }
}
