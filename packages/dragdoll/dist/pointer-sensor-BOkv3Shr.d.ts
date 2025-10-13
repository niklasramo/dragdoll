import { ListenerOptions, PointerType } from "./types-CEK9qPqM.js";
import { Sensor, SensorCancelEvent, SensorDestroyEvent, SensorEndEvent, SensorMoveEvent, SensorStartEvent } from "./sensor-DbtiV--O.js";
import { Emitter, EventListenerId, Events } from "eventti";

//#region src/sensors/pointer-sensor.d.ts
declare const SOURCE_EVENTS: {
  readonly pointer: {
    readonly start: "pointerdown";
    readonly move: "pointermove";
    readonly cancel: "pointercancel";
    readonly end: "pointerup";
  };
  readonly touch: {
    readonly start: "touchstart";
    readonly move: "touchmove";
    readonly cancel: "touchcancel";
    readonly end: "touchend";
  };
  readonly mouse: {
    readonly start: "mousedown";
    readonly move: "mousemove";
    readonly cancel: "";
    readonly end: "mouseup";
  };
};
type PointerSensorSourceEvent = PointerEvent | TouchEvent | MouseEvent;
type PointerSensorDragData = {
  readonly pointerId: number;
  readonly pointerType: PointerType;
  readonly x: number;
  readonly y: number;
};
interface PointerSensorSettings {
  listenerOptions: ListenerOptions;
  sourceEvents: keyof typeof SOURCE_EVENTS | 'auto';
  startPredicate: (e: PointerSensorSourceEvent) => boolean;
}
interface PointerSensorStartEvent extends SensorStartEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}
interface PointerSensorMoveEvent extends SensorMoveEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}
interface PointerSensorCancelEvent extends SensorCancelEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent | null;
  target: EventTarget | null;
}
interface PointerSensorEndEvent extends SensorEndEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent | null;
  target: EventTarget | null;
}
interface PointerSensorDestroyEvent extends SensorDestroyEvent {}
interface PointerSensorEvents {
  start: PointerSensorStartEvent;
  move: PointerSensorMoveEvent;
  cancel: PointerSensorCancelEvent;
  end: PointerSensorEndEvent;
  destroy: PointerSensorDestroyEvent;
}
declare class PointerSensor<E extends PointerSensorEvents = PointerSensorEvents> implements Sensor<E> {
  _events_type: E;
  readonly element: Element | Window;
  readonly drag: PointerSensorDragData | null;
  readonly isDestroyed: boolean;
  protected _startPredicate: (e: PointerSensorSourceEvent) => boolean;
  protected _listenerOptions: ListenerOptions;
  protected _sourceEvents: keyof typeof SOURCE_EVENTS;
  protected _areWindowListenersBound: boolean;
  protected _emitter: Emitter<Events>;
  constructor(element: Element | Window, options?: Partial<PointerSensorSettings>);
  protected _getTrackedPointerEventData(e: PointerSensorSourceEvent): PointerEvent | MouseEvent | Touch | null;
  protected _onStart(e: PointerSensorSourceEvent): void;
  protected _onMove(e: PointerSensorSourceEvent): void;
  protected _onCancel(e: PointerEvent | TouchEvent): void;
  protected _onEnd(e: PointerSensorSourceEvent): void;
  protected _bindWindowListeners(): void;
  protected _unbindWindowListeners(): void;
  protected _resetDrag(): void;
  cancel(): void;
  updateSettings(options: Partial<PointerSensorSettings>): void;
  on<T extends keyof E>(type: T, listener: (e: E[T]) => void, listenerId?: EventListenerId): EventListenerId;
  off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
  destroy(): void;
}
//#endregion
export { PointerSensor, PointerSensorCancelEvent, PointerSensorDestroyEvent, PointerSensorDragData, PointerSensorEndEvent, PointerSensorEvents, PointerSensorMoveEvent, PointerSensorSettings, PointerSensorStartEvent };
//# sourceMappingURL=pointer-sensor-BOkv3Shr.d.ts.map