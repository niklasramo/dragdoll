import { Rect } from "../../types-Cmt4yuYh.js";
import { Sensor } from "../../sensor-BDsc365V.js";
import { DraggableModifier, DraggableModifierData } from "../../draggable-DJlxblxx.js";

//#region src/draggable/modifiers/create-containment-modifier.d.ts
declare function createContainmentModifier<S extends Sensor[], E extends S[number]['_events_type']>(getContainerRect: (data: DraggableModifierData<S, E>) => Rect, trackSensorDrift?: boolean | ((data: DraggableModifierData<S, E>) => boolean)): DraggableModifier<S, E>;
//#endregion
export { createContainmentModifier };
//# sourceMappingURL=create-containment-modifier.d.ts.map