import { Sensor, SensorEvents } from "./sensor-BDsc365V.js";
import { Emitter, EventListenerId, Events } from "eventti";

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
  on<T extends keyof E>(type: T, listener: (e: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
  off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
  cancel(): void;
  destroy(): void;
}
//#endregion
export { BaseSensor, BaseSensorDragData };
//# sourceMappingURL=base-sensor-DszlJqp0.d.ts.map