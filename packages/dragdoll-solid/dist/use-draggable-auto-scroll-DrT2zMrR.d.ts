import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { Accessor } from "solid-js";
import { Draggable, DraggablePluginMap } from "dragdoll/draggable";
import { DraggableAutoScrollOptions, autoScrollPlugin } from "dragdoll/draggable/plugins/auto-scroll";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable-auto-scroll.d.ts
type DraggableWithAutoScroll<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}> = ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null;
type UseDraggableAutoScrollSettings<S extends Sensor[] = Sensor[]> = DraggableAutoScrollOptions<S>;
declare function useDraggableAutoScroll<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}>(draggableInput: MaybeAccessor<Draggable<S, P> | null>, settingsInput?: MaybeAccessor<UseDraggableAutoScrollSettings<S> | undefined>): Accessor<DraggableWithAutoScroll<S, P>>;
//#endregion
export { useDraggableAutoScroll as n, UseDraggableAutoScrollSettings as t };
//# sourceMappingURL=use-draggable-auto-scroll-DrT2zMrR.d.ts.map