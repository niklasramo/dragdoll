import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { Draggable, DraggableEventCallback, DraggableEventCallbacks } from "dragdoll/draggable";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable-callback.d.ts
declare function useDraggableCallback<S extends Sensor[] = Sensor[], K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>>(draggableInput: MaybeAccessor<Draggable<S> | null>, eventType: K, callback: MaybeAccessor<DraggableEventCallback<S, K> | undefined>): void;
//#endregion
export { useDraggableCallback as t };
//# sourceMappingURL=use-draggable-callback-Do37DA4T.d.ts.map