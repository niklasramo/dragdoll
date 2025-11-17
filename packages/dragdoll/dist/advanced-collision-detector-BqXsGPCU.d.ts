import { a as Rect } from "./types-BaIRuLz3.js";
import { c as ObjectArena, n as CollisionDetector, r as DndObserver, t as CollisionData } from "./collision-detector-Mb34YMOM.js";
import { t as AnyDraggable } from "./draggable-D4I6XYtd.js";
import { t as Droppable } from "./droppable-B7E3Yidc.js";

//#region src/dnd-observer/advanced-collision-detector.d.ts
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
  constructor(dndObserver: DndObserver<T>, options?: {
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
//# sourceMappingURL=advanced-collision-detector-BqXsGPCU.d.ts.map