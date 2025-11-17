import { DndObserver, DndObserverEventCallbacks } from "dragdoll/dnd-observer";
import { CollisionData } from "dragdoll/dnd-observer/collision-detector";

//#region src/hooks/use-dnd-observer-callback.d.ts
declare function useDndObserverCallback<T extends CollisionData = CollisionData, K extends keyof DndObserverEventCallbacks<T> = keyof DndObserverEventCallbacks<T>>(eventType: K, callback?: DndObserverEventCallbacks<T>[K], dndObserver?: DndObserver<T> | null): void;
//#endregion
export { useDndObserverCallback as t };
//# sourceMappingURL=use-dnd-observer-callback-A5-tWFB5.d.ts.map