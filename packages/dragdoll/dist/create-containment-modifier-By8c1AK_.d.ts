import { a as Rect } from "./types-BaIRuLz3.js";
import { t as Sensor } from "./sensor-C7UNOJhU.js";
import { d as DraggableModifierData, u as DraggableModifier } from "./draggable-D4I6XYtd.js";

//#region src/draggable/modifiers/create-containment-modifier.d.ts
declare function createContainmentModifier<S extends Sensor[]>(getContainerRect: (data: DraggableModifierData<S>) => Rect, trackSensorDrift?: boolean | ((data: DraggableModifierData<S>) => boolean)): DraggableModifier<S>;
//#endregion
export { createContainmentModifier as t };
//# sourceMappingURL=create-containment-modifier-By8c1AK_.d.ts.map