import { a as SensorEventListenerId, s as SensorEvents, t as Sensor } from "./sensor-B14KhysP.js";
import { Emitter, Events } from "eventti";

//#region src/sensors/base-sensor.d.ts
interface BaseSensorDragData {
  readonly x: number;
  readonly y: number;
}
declare class BaseSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  _events_type: E;
  readonly drag: BaseSensorDragData | null;
  readonly isDestroyed: boolean;
  protected _emitter: Emitter<Events>;
  constructor();
  protected _createDragData(data: E['start']): BaseSensorDragData;
  protected _updateDragData(data: E['move'] | E['end'] | E['cancel']): void;
  protected _resetDragData(): void;
  protected _start(data: E['start']): void;
  protected _move(data: E['move']): void;
  protected _end(data: E['end']): void;
  protected _cancel(data: E['cancel']): void;
  on<T extends keyof E>(type: T, listener: (e: E[T]) => void, listenerId?: SensorEventListenerId): SensorEventListenerId;
  off<T extends keyof E>(type: T, listenerId: SensorEventListenerId): void;
  cancel(): void;
  destroy(): void;
}
//#endregion
export { BaseSensorDragData as n, BaseSensor as t };
//# sourceMappingURL=base-sensor-Du6V0Zyk.d.ts.map