import { Rect } from "./types-CEK9qPqM.js";
import { Sensor } from "./sensor-IikAh47T.js";
import { DraggableModifier, DraggableModifierData } from "./draggable-4HkzSPcJ.js";

//#region src/draggable/modifiers/create-containment-modifier.d.ts
declare function createContainmentModifier<S extends Sensor[]>(getContainerRect: (data: DraggableModifierData<S>) => Rect, trackSensorDrift?: boolean | ((data: DraggableModifierData<S>) => boolean)): DraggableModifier<S>;
//#endregion
export { createContainmentModifier };
//# sourceMappingURL=create-containment-modifier-CaFkjgaE.d.ts.map