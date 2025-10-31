import { r as Point } from "./types-BaIRuLz3.js";
import { c as SensorMoveEvent, i as SensorEndEvent, l as SensorStartEvent, n as SensorCancelEvent, r as SensorDestroyEvent, t as Sensor } from "./sensor-B14KhysP.js";
import { t as BaseSensor } from "./base-sensor-Du6V0Zyk.js";

//#region src/sensors/keyboard-sensor.d.ts
type KeyboardSensorPredicate<E extends KeyboardSensorEvents = KeyboardSensorEvents> = (e: KeyboardEvent, sensor: KeyboardSensor<E>) => Point | null | undefined;
interface KeyboardSensorSettings<E extends KeyboardSensorEvents = KeyboardSensorEvents> {
  moveDistance: number | Point;
  cancelOnBlur: boolean;
  cancelOnVisibilityChange: boolean;
  startPredicate: KeyboardSensorPredicate<E>;
  movePredicate: KeyboardSensorPredicate<E>;
  cancelPredicate: KeyboardSensorPredicate<E>;
  endPredicate: KeyboardSensorPredicate<E>;
}
interface KeyboardSensorStartEvent extends SensorStartEvent {
  srcEvent: KeyboardEvent;
}
interface KeyboardSensorMoveEvent extends SensorMoveEvent {
  srcEvent: KeyboardEvent;
}
interface KeyboardSensorCancelEvent extends SensorCancelEvent {
  srcEvent?: KeyboardEvent;
}
interface KeyboardSensorEndEvent extends SensorEndEvent {
  srcEvent: KeyboardEvent;
}
interface KeyboardSensorDestroyEvent extends SensorDestroyEvent {}
interface KeyboardSensorEvents {
  start: KeyboardSensorStartEvent;
  move: KeyboardSensorMoveEvent;
  cancel: KeyboardSensorCancelEvent;
  end: KeyboardSensorEndEvent;
  destroy: KeyboardSensorDestroyEvent;
}
declare const keyboardSensorDefaults: KeyboardSensorSettings<any>;
declare class KeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents> extends BaseSensor<E> implements Sensor<E> {
  _events_type: E;
  readonly element: Element | null;
  readonly moveDistance: Point;
  protected _cancelOnBlur: boolean;
  protected _cancelOnVisibilityChange: boolean;
  protected _startPredicate: KeyboardSensorPredicate<E>;
  protected _movePredicate: KeyboardSensorPredicate<E>;
  protected _cancelPredicate: KeyboardSensorPredicate<E>;
  protected _endPredicate: KeyboardSensorPredicate<E>;
  constructor(element: Element | null, options?: Partial<KeyboardSensorSettings<E>>);
  protected _internalCancel(): void;
  protected _blurCancelHandler(): void;
  protected _onKeyDown(e: KeyboardEvent): void;
  updateSettings(options: Partial<KeyboardSensorSettings<E>>): void;
  destroy(): void;
}
//#endregion
export { KeyboardSensorEvents as a, KeyboardSensorSettings as c, KeyboardSensorEndEvent as i, KeyboardSensorStartEvent as l, KeyboardSensorCancelEvent as n, KeyboardSensorMoveEvent as o, KeyboardSensorDestroyEvent as r, KeyboardSensorPredicate as s, KeyboardSensor as t, keyboardSensorDefaults as u };
//# sourceMappingURL=keyboard-sensor-B_R1wXBx.d.ts.map