import type { EventListenerId } from 'eventti';

export const SensorEventType = {
  Start: 'start',
  Move: 'move',
  Cancel: 'cancel',
  End: 'end',
  Destroy: 'destroy',
} as const;

export type SensorEventType = (typeof SensorEventType)[keyof typeof SensorEventType];

export interface SensorStartEvent {
  type: typeof SensorEventType.Start;
  x: number;
  y: number;
}

export interface SensorMoveEvent {
  type: typeof SensorEventType.Move;
  x: number;
  y: number;
}

export interface SensorCancelEvent {
  type: typeof SensorEventType.Cancel;
  x: number;
  y: number;
}

export interface SensorEndEvent {
  type: typeof SensorEventType.End;
  x: number;
  y: number;
}

export interface SensorDestroyEvent {
  type: typeof SensorEventType.Destroy;
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
