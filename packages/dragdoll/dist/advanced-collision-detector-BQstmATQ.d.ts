import { a as Rect } from "./types-BaIRuLz3.js";
import { c as ObjectArena, n as CollisionDetector, r as DndContext, t as CollisionData } from "./collision-detector-B8HMC9fJ.js";
import { t as AnyDraggable } from "./draggable-C2gZFZ9L.js";
import { t as Droppable } from "./droppable-VRCq0tBK.js";

//#region src/dnd-context/advanced-collision-detector.d.ts
interface DragState {
  clipMaskKeyMap: Map<Droppable, Element | Window>;
  clipMaskMap: Map<Element | Window, [Rect, Rect]>;
  cacheDirty: boolean;
}
interface AdvancedCollisionData extends CollisionData {
  draggableVisibleRect: Rect;
  droppableVisibleRect: Rect;
}
declare class AdvancedCollisionDetector<T extends AdvancedCollisionData = AdvancedCollisionData> extends CollisionDetector<T> {
  protected _dragStates: Map<AnyDraggable, DragState>;
  protected _visibilityLogic: 'relative' | 'absolute';
  protected _listenersAttached: boolean;
  protected _clearCache: () => void;
  constructor(dndContext: DndContext<T>, options?: {
    visibilityLogic: 'relative' | 'absolute';
  });
  protected _checkCollision(draggable: AnyDraggable, droppable: Droppable, collisionData: T): T | null;
  protected _sortCollisions(_draggable: AnyDraggable, collisions: T[]): T[];
  protected _createCollisionData(): T;
  protected _getDragState(draggable: AnyDraggable): DragState;
  protected _getCollisionDataArena(draggable: AnyDraggable): ObjectArena<T, []>;
  protected _removeCollisionDataArena(draggable: AnyDraggable): void;
  detectCollisions(draggable: AnyDraggable, targets: Map<Droppable['id'], Droppable>, collisions: T[]): void;
  clearCache(draggable?: AnyDraggable): void;
}
//#endregion
export { AdvancedCollisionDetector as n, AdvancedCollisionData as t };
//# sourceMappingURL=advanced-collision-detector-BQstmATQ.d.ts.map