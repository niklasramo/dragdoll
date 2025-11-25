import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { DndObserver, DndObserverEventCallbacks } from "dragdoll/dnd-observer";

//#region src/hooks/use-dnd-observer-callback.d.ts
declare function useDndObserverCallback<K extends keyof DndObserverEventCallbacks<any> = keyof DndObserverEventCallbacks>(eventType: K, callback: MaybeAccessor<DndObserverEventCallbacks<any>[K] | undefined>, dndObserver: MaybeAccessor<DndObserver<any> | null>): void;
//#endregion
export { useDndObserverCallback as t };
//# sourceMappingURL=use-dnd-observer-callback-B2MUzJkz.d.ts.map