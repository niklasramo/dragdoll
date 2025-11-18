import { KeyboardSensor, KeyboardSensorEvents, KeyboardSensorSettings } from "dragdoll/sensors/keyboard";

//#region src/hooks/use-keyboard-sensor.d.ts
declare function useKeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>(settings?: Partial<KeyboardSensorSettings<E>>, element?: Element | null): readonly [KeyboardSensor<E> | null, (node: Element | null) => void];
//#endregion
export { useKeyboardSensor as t };
//# sourceMappingURL=use-keyboard-sensor-B65S73sk.d.ts.map