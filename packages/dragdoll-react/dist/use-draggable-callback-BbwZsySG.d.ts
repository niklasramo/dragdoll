import { Draggable, DraggableEventCallback, DraggableEventCallbacks } from "dragdoll/draggable";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable-callback.d.ts
declare function useDraggableCallback<S extends Sensor = Sensor, K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>>(draggable: Draggable<S> | null, eventType: K, callback?: DraggableEventCallback<S, K>): void;
//#endregion
export { useDraggableCallback as t };
//# sourceMappingURL=use-draggable-callback-BbwZsySG.d.ts.map