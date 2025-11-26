import { DndObserver } from "dragdoll/dnd-observer";
import { Draggable, DraggableOptions } from "dragdoll/draggable";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable.d.ts
interface UseDraggableSettings<S extends Sensor = Sensor> extends Partial<DraggableOptions<S>> {
  dndObserver?: DndObserver<any> | null;
}
declare function useDraggable<S extends Sensor = Sensor>(sensors: (S | null)[], settings?: UseDraggableSettings<S>): Draggable<S, {}> | null;
//#endregion
export { useDraggable as n, UseDraggableSettings as t };
//# sourceMappingURL=use-draggable-ALkbD6si.d.ts.map