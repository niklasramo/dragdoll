import { a as Rect } from "./types-BaIRuLz3.js";
import { t as Sensor } from "./sensor-B14KhysP.js";
import { d as DraggableModifierData, u as DraggableModifier } from "./draggable-B44QiNe-.js";

//#region src/draggable/modifiers/create-containment-modifier.d.ts
declare function createContainmentModifier<S extends Sensor>(getContainerRect: (data: DraggableModifierData<S>) => Rect, trackSensorDrift?: boolean | ((data: DraggableModifierData<S>) => boolean)): DraggableModifier<S>;
//#endregion
export { createContainmentModifier as t };
//# sourceMappingURL=create-containment-modifier-CU-Zu6sg.d.ts.map