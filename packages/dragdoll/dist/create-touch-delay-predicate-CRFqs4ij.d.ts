import { Sensor } from "./sensor-DbtiV--O.js";
import { Draggable } from "./draggable-B2wfNgol.js";
import { PointerSensor } from "./pointer-sensor-BOkv3Shr.js";

//#region src/draggable/helpers/create-touch-delay-predicate.d.ts
declare function createTouchDelayPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[], D extends Draggable<S> = Draggable<S>>(options?: {
  touchDelay?: number;
  fallback?: D['settings']['startPredicate'];
}): D["settings"]["startPredicate"];
//#endregion
export { createTouchDelayPredicate };
//# sourceMappingURL=create-touch-delay-predicate-CRFqs4ij.d.ts.map