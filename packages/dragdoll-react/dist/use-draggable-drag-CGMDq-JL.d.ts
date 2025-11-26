import { Draggable, DraggableDrag } from "dragdoll/draggable";
import { Sensor } from "dragdoll/sensors";

//#region src/hooks/use-draggable-drag.d.ts
declare function useDraggableDrag<S extends Sensor = Sensor>(draggable: Draggable<S> | null, trackMove?: boolean): DraggableDrag<S> | null;
//#endregion
export { useDraggableDrag as t };
//# sourceMappingURL=use-draggable-drag-CGMDq-JL.d.ts.map