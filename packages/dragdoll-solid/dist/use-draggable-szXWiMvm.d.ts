import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { Accessor } from "solid-js";
import { DndObserver } from "dragdoll/dnd-observer";
import { Draggable, DraggableOptions } from "dragdoll/draggable";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable.d.ts
interface UseDraggableSettings<S extends Sensor[] = Sensor[]> extends Partial<DraggableOptions<S>> {
  dndObserver?: DndObserver<any> | null;
}
type MaybeSensor<S extends Sensor> = MaybeAccessor<S | null>;
declare function useDraggable<S extends Sensor[] = Sensor[]>(sensors: MaybeSensor<S[number]>[], settingsInput?: MaybeAccessor<UseDraggableSettings<S> | undefined>): Accessor<Draggable<S> | null>;
//#endregion
export { useDraggable as n, UseDraggableSettings as t };
//# sourceMappingURL=use-draggable-szXWiMvm.d.ts.map