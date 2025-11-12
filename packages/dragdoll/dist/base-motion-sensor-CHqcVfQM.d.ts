import { r as Point } from "./types-BaIRuLz3.js";
import { s as SensorEvents, t as Sensor } from "./sensor-C7UNOJhU.js";
import { n as BaseSensorDragData, t as BaseSensor } from "./base-sensor-D7hB3PcK.js";

//#region src/sensors/base-motion-sensor.d.ts
interface BaseMotionSensorTickEvent {
  type: 'tick';
  time: number;
  deltaTime: number;
}
interface BaseMotionSensorEvents extends SensorEvents {
  tick: BaseMotionSensorTickEvent;
}
interface BaseMotionSensorDragData extends BaseSensorDragData {
  readonly time: number;
  readonly deltaTime: number;
}
declare class BaseMotionSensor<E extends BaseMotionSensorEvents = BaseMotionSensorEvents> extends BaseSensor<E> implements Sensor<E> {
  _events_type: E;
  readonly drag: BaseMotionSensorDragData | null;
  protected _direction: Point;
  protected _speed: number;
  constructor();
  protected _createDragData(data: E['start']): BaseMotionSensorDragData;
  protected _start(data: E['start']): void;
  protected _end(data: E['end']): void;
  protected _cancel(data: E['cancel']): void;
  protected _tick(time: number): void;
}
//#endregion
export { BaseMotionSensorTickEvent as i, BaseMotionSensorDragData as n, BaseMotionSensorEvents as r, BaseMotionSensor as t };
//# sourceMappingURL=base-motion-sensor-CHqcVfQM.d.ts.map