import { Point } from "./types-CEK9qPqM.js";
import { Sensor, SensorEvents } from "./sensor-DbtiV--O.js";
import { BaseSensor, BaseSensorDragData } from "./base-sensor-Dug_ryiP.js";

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
export { BaseMotionSensor, BaseMotionSensorDragData, BaseMotionSensorEvents, BaseMotionSensorTickEvent };
//# sourceMappingURL=base-motion-sensor-D1mls96Y.d.ts.map