export const DragSensorEventType = {
  start: 'start',
  move: 'move',
  cancel: 'cancel',
  end: 'end',
  abort: 'abort',
  destroy: 'destroy',
} as const;

export interface DragSensorStartEvent {
  type: typeof DragSensorEventType.start;
  isFirst: true;
  isFinal: false;
  clientX: number;
  clientY: number;
  [prop: string]: any;
}

export interface DragSensorMoveEvent {
  type: typeof DragSensorEventType.move;
  isFirst: false;
  isFinal: false;
  clientX: number;
  clientY: number;
  [prop: string]: any;
}

export interface DragSensorEndEvent {
  type: typeof DragSensorEventType.end;
  isFirst: false;
  isFinal: true;
  clientX: number;
  clientY: number;
  [prop: string]: any;
}

export interface DragSensorCancelEvent {
  type: typeof DragSensorEventType.cancel;
  isFirst: false;
  isFinal: true;
  clientX: number;
  clientY: number;
  [prop: string]: any;
}

export interface DragSensorAbortEvent {
  type: typeof DragSensorEventType.abort;
  isFirst: false;
  isFinal: true;
  [prop: string]: any;
}

export interface DragSensorDestroyEvent {
  type: typeof DragSensorEventType.destroy;
  [prop: string]: any;
}

export interface DragSensorEvents {
  start: DragSensorStartEvent;
  move: DragSensorMoveEvent;
  end: DragSensorEndEvent;
  cancel: DragSensorCancelEvent;
  abort: DragSensorAbortEvent;
  destroy: DragSensorDestroyEvent;
}

export abstract class DragSensor<T extends DragSensorEvents> {
  constructor() {}
  abstract on<K extends keyof T>(eventType: K, listener: (eventData: T[K]) => void): void;
  abstract off<K extends keyof T>(eventType: K, listener: (eventData: T[K]) => void): void;
  abstract abort(): void;
  abstract destroy(): void;
}
