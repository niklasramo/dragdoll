import { Draggable, DraggableAutoScrollOptions, DraggablePluginMap, Sensor, autoScrollPlugin } from "dragdoll";

//#region src/hooks/use-draggable-auto-scroll.d.ts
type DraggableWithAutoScroll<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}> = ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null;
declare function useDraggableAutoScroll<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}>(draggable: Draggable<S, P> | null, settings?: DraggableAutoScrollOptions<S>): DraggableWithAutoScroll<S, P>;
//#endregion
export { useDraggableAutoScroll as t };
//# sourceMappingURL=use-draggable-auto-scroll-CPmfswTT.d.ts.map