import { Draggable, DraggableEventCallback, DraggableEventCallbacks, Sensor, SensorsEventsType } from "dragdoll";

//#region src/hooks/use-draggable-callback.d.ts
declare function useDraggableCallback<S extends Sensor[] = Sensor[], K extends keyof DraggableEventCallbacks<SensorsEventsType<S>> = keyof DraggableEventCallbacks<SensorsEventsType<S>>>(draggable: Draggable<S> | null, eventType: K, callback?: DraggableEventCallback<S, K>): void;
//#endregion
export { useDraggableCallback as t };
//# sourceMappingURL=use-draggable-callback-Cbh2rDfm.d.ts.map