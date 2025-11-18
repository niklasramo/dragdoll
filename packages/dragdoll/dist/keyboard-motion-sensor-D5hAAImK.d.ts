import { r as Point } from "./types-BaIRuLz3.js";
import { t as Sensor } from "./sensor-C7UNOJhU.js";
import { r as BaseMotionSensorEvents, t as BaseMotionSensor } from "./base-motion-sensor-CHqcVfQM.js";

//#region src/sensors/keyboard-motion-sensor.d.ts
interface KeyboardMotionSensorSettings<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents> {
  startKeys: string[];
  moveLeftKeys: string[];
  moveRightKeys: string[];
  moveUpKeys: string[];
  moveDownKeys: string[];
  cancelKeys: string[];
  endKeys: string[];
  cancelOnBlur: boolean;
  cancelOnVisibilityChange: boolean;
  computeSpeed: (sensor: KeyboardMotionSensor<E>) => number;
  startPredicate: (e: KeyboardEvent, sensor: KeyboardMotionSensor<E>) => Point | null | undefined;
}
interface KeyboardMotionSensorEvents extends BaseMotionSensorEvents {}
declare const keyboardMotionSensorDefaults: KeyboardMotionSensorSettings<any>;
declare class KeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents> extends BaseMotionSensor<E> implements Sensor<E> {
  _events_type: E;
  readonly element: Element | null;
  protected _moveKeys: Set<string>;
  protected _moveKeyTimestamps: Map<string, number>;
  protected _startKeys: Set<string>;
  protected _moveLeftKeys: Set<string>;
  protected _moveRightKeys: Set<string>;
  protected _moveUpKeys: Set<string>;
  protected _moveDownKeys: Set<string>;
  protected _cancelKeys: Set<string>;
  protected _endKeys: Set<string>;
  protected _cancelOnBlur: boolean;
  protected _cancelOnVisibilityChange: boolean;
  protected _computeSpeed: Exclude<KeyboardMotionSensorSettings<E>['computeSpeed'], undefined>;
  protected _startPredicate: Exclude<KeyboardMotionSensorSettings<E>['startPredicate'], undefined>;
  constructor(element: Element | null, options?: Partial<KeyboardMotionSensorSettings<E>>);
  protected _end(data: E['end']): void;
  protected _cancel(data: E['cancel']): void;
  protected _internalCancel(): void;
  protected _blurCancelHandler(): void;
  protected _updateDirection(): void;
  protected _onTick(): void;
  protected _onKeyUp(e: KeyboardEvent): void;
  protected _onKeyDown(e: KeyboardEvent): void;
  updateSettings(options: Partial<KeyboardMotionSensorSettings<E>>): void;
  destroy(): void;
}
//#endregion
export { keyboardMotionSensorDefaults as i, KeyboardMotionSensorEvents as n, KeyboardMotionSensorSettings as r, KeyboardMotionSensor as t };
//# sourceMappingURL=keyboard-motion-sensor-D5hAAImK.d.ts.map