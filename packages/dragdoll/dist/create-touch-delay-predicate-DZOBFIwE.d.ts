import { t as Sensor } from "./sensor-B14KhysP.js";
import { n as Draggable } from "./draggable-C2gZFZ9L.js";
import { t as PointerSensor } from "./pointer-sensor-CQptgIih.js";

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
export { createTouchDelayPredicate as t };
//# sourceMappingURL=create-touch-delay-predicate-DZOBFIwE.d.ts.map