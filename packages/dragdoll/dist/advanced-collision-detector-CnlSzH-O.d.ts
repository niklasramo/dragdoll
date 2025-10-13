import { Rect } from "./types-CEK9qPqM.js";
import { CollisionData, CollisionDetector, DndContext, FastObjectPool } from "./collision-detector-CK9VWaCY.js";
import { Draggable } from "./draggable-B2wfNgol.js";
import { Droppable } from "./droppable-CqqJsI5E.js";

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
  protected _dragStates: Map<Draggable<any>, DragState>;
  protected _visibilityLogic: 'relative' | 'absolute';
  protected _listenersAttached: boolean;
  protected _clearCache: () => void;
  constructor(dndContext: DndContext<T>, options?: {
    visibilityLogic: 'relative' | 'absolute';
  });
  protected _checkCollision(draggable: Draggable<any>, droppable: Droppable, collisionData: T): T | null;
  protected _sortCollisions(_draggable: Draggable<any>, collisions: T[]): T[];
  protected _createCollisionData(): T;
  protected _getDragState(draggable: Draggable<any>): DragState;
  getCollisionDataPool(draggable: Draggable<any>): FastObjectPool<T, []>;
  removeCollisionDataPool(draggable: Draggable<any>): void;
  detectCollisions(draggable: Draggable<any>, targets: Map<Droppable['id'], Droppable>, collisions: T[]): void;
  clearCache(draggable?: Draggable<any>): void;
}
//#endregion
export { AdvancedCollisionData, AdvancedCollisionDetector };
//# sourceMappingURL=advanced-collision-detector-CnlSzH-O.d.ts.map