import { Draggable, DraggablePluginMap } from "dragdoll/draggable";
import { DraggableAutoScrollOptions, autoScrollPlugin } from "dragdoll/draggable/plugins/auto-scroll";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable-auto-scroll.d.ts
type DraggableWithAutoScroll<S extends Sensor = Sensor, P extends DraggablePluginMap = {}> = ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null;
type UseDraggableAutoScrollSettings<S extends Sensor = Sensor> = DraggableAutoScrollOptions<S>;
declare function useDraggableAutoScroll<S extends Sensor = Sensor, P extends DraggablePluginMap = {}>(draggable: Draggable<S, P> | null, settings?: UseDraggableAutoScrollSettings<S>): DraggableWithAutoScroll<S, P>;
//#endregion
export { useDraggableAutoScroll as n, UseDraggableAutoScrollSettings as t };
//# sourceMappingURL=use-draggable-auto-scroll-BeKXEuy9.d.ts.map