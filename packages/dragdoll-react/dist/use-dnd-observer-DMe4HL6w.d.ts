import { CollisionData, DndObserver, DndObserverEventCallbacks, DndObserverOptions } from "dragdoll";

//#region src/hooks/use-dnd-observer.d.ts
interface UseDndObserverOptions<T extends CollisionData = CollisionData> {
  collisionDetector?: DndObserverOptions<T>['collisionDetector'];
  onStart?: DndObserverEventCallbacks<T>['start'];
  onMove?: DndObserverEventCallbacks<T>['move'];
  onEnter?: DndObserverEventCallbacks<T>['enter'];
  onLeave?: DndObserverEventCallbacks<T>['leave'];
  onCollide?: DndObserverEventCallbacks<T>['collide'];
  onEnd?: DndObserverEventCallbacks<T>['end'];
  onAddDraggables?: DndObserverEventCallbacks<T>['addDraggables'];
  onRemoveDraggables?: DndObserverEventCallbacks<T>['removeDraggables'];
  onAddDroppables?: DndObserverEventCallbacks<T>['addDroppables'];
  onRemoveDroppables?: DndObserverEventCallbacks<T>['removeDroppables'];
  onDestroy?: DndObserverEventCallbacks<T>['destroy'];
}
declare function useDndObserver<T extends CollisionData = CollisionData>({
  collisionDetector,
  onStart,
  onMove,
  onEnter,
  onLeave,
  onCollide,
  onEnd,
  onAddDraggables,
  onRemoveDraggables,
  onAddDroppables,
  onRemoveDroppables,
  onDestroy
}?: UseDndObserverOptions<T>): DndObserver<T> | null;
//#endregion
export { useDndObserver as n, UseDndObserverOptions as t };
//# sourceMappingURL=use-dnd-observer-DMe4HL6w.d.ts.map