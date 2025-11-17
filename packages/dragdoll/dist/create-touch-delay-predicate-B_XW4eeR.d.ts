import { t as Sensor, u as SensorsEventsType } from "./sensor-C7UNOJhU.js";
import { n as Draggable } from "./draggable-D4I6XYtd.js";
import { t as PointerSensor } from "./pointer-sensor-ErSx5irn.js";

//#region src/draggable/helpers/create-touch-delay-predicate.d.ts
declare function createTouchDelayPredicate<S extends (Sensor | PointerSensor)[] = (Sensor | PointerSensor)[]>(options?: {
  touchDelay?: number;
  fallback?: Draggable<S>['settings']['startPredicate'];
}): (data: {
  draggable: Draggable<S, {}>;
  sensor: S[number];
  event: SensorsEventsType<S>["start"] | SensorsEventsType<S>["move"];
}) => boolean | undefined;
//#endregion
export { createTouchDelayPredicate as t };
//# sourceMappingURL=create-touch-delay-predicate-B_XW4eeR.d.ts.map