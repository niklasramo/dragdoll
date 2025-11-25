import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import * as solid_js2 from "solid-js";
import { DndObserver, DndObserverEventCallbacks, DndObserverOptions } from "dragdoll/dnd-observer";
import { CollisionData } from "dragdoll/dnd-observer/collision-detector";

//#region src/hooks/use-dnd-observer.d.ts
interface UseDndObserverSettings<T extends CollisionData = CollisionData> {
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
declare function useDndObserver<T extends CollisionData = CollisionData>(settingsInput?: MaybeAccessor<UseDndObserverSettings<T> | undefined>): solid_js2.Accessor<DndObserver<T> | null>;
//#endregion
export { useDndObserver as n, UseDndObserverSettings as t };
//# sourceMappingURL=use-dnd-observer-Dg7rS9cc.d.ts.map