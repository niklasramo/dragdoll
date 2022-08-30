import { EventListenerId } from 'eventti';

export const SensorEventType = {
  start: 'start',
  move: 'move',
  cancel: 'cancel',
  end: 'end',
  destroy: 'destroy',
} as const;

export interface SensorStartEvent {
  type: typeof SensorEventType.start;
  clientX: number;
  clientY: number;
}

export interface SensorMoveEvent {
  type: typeof SensorEventType.move;
  clientX: number;
  clientY: number;
}

export interface SensorCancelEvent {
  type: typeof SensorEventType.cancel;
  clientX: number;
  clientY: number;
}

export interface SensorEndEvent {
  type: typeof SensorEventType.end;
  clientX: number;
  clientY: number;
}

export interface SensorDestroyEvent {
  type: typeof SensorEventType.destroy;
}

export interface SensorEvents {
  start: SensorStartEvent;
  move: SensorMoveEvent;
  cancel: SensorCancelEvent;
  end: SensorEndEvent;
  destroy: SensorDestroyEvent;
}

export interface Sensor<T extends SensorEvents = SensorEvents> {
  events: T;
  on<K extends keyof T>(
    eventName: K,
    listener: (eventData: T[K]) => void,
    listenerId?: EventListenerId
  ): EventListenerId;
  off<K extends keyof T>(
    eventName?: K,
    listener?: ((eventData: T[K]) => void) | EventListenerId
  ): void;
  cancel(): void;
  destroy(): void;
}
