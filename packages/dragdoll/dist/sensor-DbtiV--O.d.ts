import { EventListenerId } from "eventti";

//#region src/sensors/sensor.d.ts
declare const SensorEventType: {
  readonly Start: "start";
  readonly Move: "move";
  readonly Cancel: "cancel";
  readonly End: "end";
  readonly Destroy: "destroy";
};
type SensorEventType = (typeof SensorEventType)[keyof typeof SensorEventType];
interface SensorStartEvent {
  type: typeof SensorEventType.Start;
  x: number;
  y: number;
}
interface SensorMoveEvent {
  type: typeof SensorEventType.Move;
  x: number;
  y: number;
}
interface SensorCancelEvent {
  type: typeof SensorEventType.Cancel;
  x: number;
  y: number;
}
interface SensorEndEvent {
  type: typeof SensorEventType.End;
  x: number;
  y: number;
}
interface SensorDestroyEvent {
  type: typeof SensorEventType.Destroy;
}
interface SensorEvents {
  start: SensorStartEvent;
  move: SensorMoveEvent;
  cancel: SensorCancelEvent;
  end: SensorEndEvent;
  destroy: SensorDestroyEvent;
}
declare abstract class Sensor<E extends SensorEvents = SensorEvents> {
  _events_type: E;
  abstract on<T extends keyof E>(type: T, listener: (eventData: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
  abstract off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
  abstract cancel(): void;
  abstract destroy(): void;
}
//#endregion
export { Sensor, SensorCancelEvent, SensorDestroyEvent, SensorEndEvent, SensorEventType, SensorEvents, SensorMoveEvent, SensorStartEvent };
//# sourceMappingURL=sensor-DbtiV--O.d.ts.map