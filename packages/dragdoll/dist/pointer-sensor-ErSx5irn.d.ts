import { i as PointerType, n as ListenerOptions } from "./types-BaIRuLz3.js";
import { a as SensorEventListenerId, c as SensorMoveEvent, i as SensorEndEvent, l as SensorStartEvent, n as SensorCancelEvent, r as SensorDestroyEvent, t as Sensor } from "./sensor-C7UNOJhU.js";
import { Emitter, Events } from "eventti";

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
  on<T extends keyof E>(type: T, listener: (e: E[T]) => void, listenerId?: SensorEventListenerId): SensorEventListenerId;
  off<T extends keyof E>(type: T, listenerId: SensorEventListenerId): void;
  destroy(): void;
}
//#endregion
export { PointerSensorEndEvent as a, PointerSensorSettings as c, PointerSensorDragData as i, PointerSensorStartEvent as l, PointerSensorCancelEvent as n, PointerSensorEvents as o, PointerSensorDestroyEvent as r, PointerSensorMoveEvent as s, PointerSensor as t };
//# sourceMappingURL=pointer-sensor-ErSx5irn.d.ts.map