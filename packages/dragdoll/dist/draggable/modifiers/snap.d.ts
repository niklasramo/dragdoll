import "../../types-YkY4KRu0.js";
import { Sensor } from "../../sensor-BDsc365V.js";
import { DraggableModifier } from "../../draggable-DXU06nG1.js";

//#region src/draggable/modifiers/create-snap-modifier.d.ts
declare function createSnapModifier<S extends Sensor[], E extends S[number]['_events_type']>(cellWidth: number, cellHeight: number): DraggableModifier<S, E>;
//#endregion
export { createSnapModifier };
//# sourceMappingURL=snap.d.ts.map