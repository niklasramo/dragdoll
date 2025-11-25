import { t as MaybeAccessor } from "./maybe-accessor-C-3Zse8J.js";
import { Accessor } from "solid-js";
import { KeyboardSensor, KeyboardSensorEvents, KeyboardSensorSettings } from "dragdoll/sensors/keyboard";

//#region src/hooks/use-keyboard-sensor.d.ts
declare function useKeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>(settings?: MaybeAccessor<Partial<KeyboardSensorSettings<E>> | undefined>, element?: MaybeAccessor<Element | null>): readonly [Accessor<KeyboardSensor<E> | null>, (node: Element | null) => void];
//#endregion
export { useKeyboardSensor as t };
//# sourceMappingURL=use-keyboard-sensor-JR3nKBNn.d.ts.map