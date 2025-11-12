import { KeyboardMotionSensor, KeyboardMotionSensorEvents, KeyboardMotionSensorSettings } from "dragdoll";

//#region src/hooks/use-keyboard-motion-sensor.d.ts
declare function useKeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents>(settings?: Partial<KeyboardMotionSensorSettings<E>>, element?: Element | null): readonly [KeyboardMotionSensor<E> | null, (node: Element | null) => void];
//#endregion
export { useKeyboardMotionSensor as t };
//# sourceMappingURL=use-keyboard-motion-sensor-BM1jjLX1.d.ts.map