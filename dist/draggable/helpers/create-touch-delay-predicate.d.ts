import "../../types-Cmt4yuYh.js";
import { Sensor } from "../../sensor-BDsc365V.js";
import { Draggable } from "../../draggable-DJlxblxx.js";
import { PointerSensor } from "../../pointer-sensor-ihxS7q5l.js";

//#region src/draggable/helpers/create-touch-delay-predicate.d.ts
declare function createTouchDelayPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[], D extends Draggable<S> = Draggable<S>>(options?: {
  touchDelay?: number;
  fallback?: D['settings']['startPredicate'];
}): D["settings"]["startPredicate"];
//#endregion
export { createTouchDelayPredicate };
//# sourceMappingURL=create-touch-delay-predicate.d.ts.map