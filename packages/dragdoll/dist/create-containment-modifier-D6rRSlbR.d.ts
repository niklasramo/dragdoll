import { Rect } from "./types-CEK9qPqM.js";
import { Sensor } from "./sensor-DbtiV--O.js";
import { DraggableModifier, DraggableModifierData } from "./draggable-B2wfNgol.js";

//#region src/draggable/modifiers/create-containment-modifier.d.ts
declare function createContainmentModifier<S extends Sensor[], E extends S[number]['_events_type']>(getContainerRect: (data: DraggableModifierData<S, E>) => Rect, trackSensorDrift?: boolean | ((data: DraggableModifierData<S, E>) => boolean)): DraggableModifier<S, E>;
//#endregion
export { createContainmentModifier };
//# sourceMappingURL=create-containment-modifier-D6rRSlbR.d.ts.map