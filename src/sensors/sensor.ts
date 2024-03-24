import type { EventListenerId } from 'eventti';

export const SensorEventType = {
  start: 'start',
  move: 'move',
  cancel: 'cancel',
  end: 'end',
  destroy: 'destroy',
} as const;

export interface SensorStartEvent {
  type: typeof SensorEventType.start;
  x: number;
  y: number;
}

export interface SensorMoveEvent {
  type: typeof SensorEventType.move;
  x: number;
  y: number;
}

export interface SensorCancelEvent {
  type: typeof SensorEventType.cancel;
  x: number;
  y: number;
}

export interface SensorEndEvent {
  type: typeof SensorEventType.end;
  x: number;
  y: number;
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

export interface Sensor<E extends SensorEvents = SensorEvents> {
  events: E;
  on<T extends keyof E>(
    type: T,
    listener: (eventData: E[T]) => void,
    listenerId?: EventListenerId,
  ): EventListenerId;
  off<T extends keyof E>(type: T, listenerId: EventListenerId): void;
  cancel(): void;
  destroy(): void;
}
