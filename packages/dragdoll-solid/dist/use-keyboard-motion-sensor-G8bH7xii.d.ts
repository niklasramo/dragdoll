import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { Accessor } from "solid-js";
import { KeyboardMotionSensor, KeyboardMotionSensorEvents, KeyboardMotionSensorSettings } from "dragdoll/sensors/keyboard-motion";

//#region src/hooks/use-keyboard-motion-sensor.d.ts
declare function useKeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents>(settings?: MaybeAccessor<Partial<KeyboardMotionSensorSettings<E>> | undefined>, element?: MaybeAccessor<Element | null>): readonly [Accessor<KeyboardMotionSensor<E> | null>, (node: Element | null) => void];
//#endregion
export { useKeyboardMotionSensor as t };
//# sourceMappingURL=use-keyboard-motion-sensor-G8bH7xii.d.ts.map