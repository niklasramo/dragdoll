import { Sensor } from "./sensor-IikAh47T.js";
import { Draggable } from "./draggable-4HkzSPcJ.js";
import { PointerSensor } from "./pointer-sensor-CwbfRkCE.js";

//#region src/draggable/helpers/create-touch-delay-predicate.d.ts
declare function createTouchDelayPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[]>(options?: {
  touchDelay?: number;
  fallback?: Draggable<S>['settings']['startPredicate'];
}): (data: {
  draggable: Draggable<S, {}>;
  sensor: S[number];
  event: S[number]["_events_type"]["start"] | S[number]["_events_type"]["move"];
}) => boolean | undefined;
//#endregion
export { createTouchDelayPredicate };
//# sourceMappingURL=create-touch-delay-predicate-CCTLa4eE.d.ts.map