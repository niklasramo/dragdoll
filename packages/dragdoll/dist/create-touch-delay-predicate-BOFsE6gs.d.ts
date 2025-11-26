import { t as Sensor } from "./sensor-B14KhysP.js";
import { n as Draggable } from "./draggable-B44QiNe-.js";
import { t as PointerSensor } from "./pointer-sensor-CQptgIih.js";

//#region src/draggable/helpers/create-touch-delay-predicate.d.ts
declare function createTouchDelayPredicate<S extends Sensor | PointerSensor = Sensor | PointerSensor>(options?: {
  touchDelay?: number;
  fallback?: Draggable<S>['settings']['startPredicate'];
}): (data: {
  draggable: Draggable<S, {}>;
  sensor: S;
  event: S["_events_type"]["start"] | S["_events_type"]["move"];
}) => boolean | undefined;
//#endregion
export { createTouchDelayPredicate as t };
//# sourceMappingURL=create-touch-delay-predicate-BOFsE6gs.d.ts.map