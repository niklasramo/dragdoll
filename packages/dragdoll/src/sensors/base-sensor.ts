import type { Events } from 'eventti';
import { Emitter } from 'eventti';
import type { Writeable } from '../types.js';
import type {
  Sensor,
  SensorCancelEvent,
  SensorDestroyEvent,
  SensorEndEvent,
  SensorEventListenerId,
  SensorMoveEvent,
  SensorStartEvent,
} from './sensor.js';
import { SensorEventType } from './sensor.js';

export interface BaseSensorDragData {
  readonly x: number;
  readonly y: number;
  readonly startX: number;
  readonly startY: number;
  readonly deltaX: number;
  readonly deltaY: number;
}

interface BaseSensorExtraFields {
  startX: number;
  startY: number;
  deltaX: number;
  deltaY: number;
}

export interface BaseSensorStartEvent extends SensorStartEvent, BaseSensorExtraFields {}

export interface BaseSensorMoveEvent extends SensorMoveEvent, BaseSensorExtraFields {}

export interface BaseSensorCancelEvent extends SensorCancelEvent, BaseSensorExtraFields {}

export interface BaseSensorEndEvent extends SensorEndEvent, BaseSensorExtraFields {}

export interface BaseSensorDestroyEvent extends SensorDestroyEvent {}

export interface BaseSensorEvents {
  start: BaseSensorStartEvent;
  move: BaseSensorMoveEvent;
  cancel: BaseSensorCancelEvent;
  end: BaseSensorEndEvent;
  destroy: BaseSensorDestroyEvent;
}

export type BaseSensorDataArg<T> = Omit<T, 'startX' | 'startY' | 'deltaX' | 'deltaY'>;

export class BaseSensor<E extends BaseSensorEvents = BaseSensorEvents> implements Sensor<E> {
  declare _events_type: E;
  readonly drag: BaseSensorDragData | null;
  readonly isDestroyed: boolean;
  protected _emitter: Emitter<Events>;

  constructor() {
    this.drag = null;
    this.isDestroyed = false;
    this._emitter = new Emitter();
  }

  protected _createDragData(data: BaseSensorDataArg<E['start']>): BaseSensorDragData {
    return {
      x: data.x,
      y: data.y,
      startX: data.x,
      startY: data.y,
      deltaX: 0,
      deltaY: 0,
    };
  }

  protected _updateDragData(
    data:
      | BaseSensorDataArg<E['move']>
      | BaseSensorDataArg<E['end']>
      | BaseSensorDataArg<E['cancel']>,
  ) {
    if (!this.drag) return;
    (this.drag.deltaX as Writeable<number>) = data.x - this.drag.x;
    (this.drag.deltaY as Writeable<number>) = data.y - this.drag.y;
    (this.drag.x as Writeable<number>) = data.x;
    (this.drag.y as Writeable<number>) = data.y;
  }

  protected _resetDragData() {
    (this as Writeable<this>).drag = null;
  }

  protected _start(data: BaseSensorDataArg<E['start']>) {
    if (this.isDestroyed || this.drag) return;
    const drag = this._createDragData(data);
    const eventData = data as E['start'];
    eventData.startX = drag.startX;
    eventData.startY = drag.startY;
    eventData.deltaX = drag.deltaX;
    eventData.deltaY = drag.deltaY;
    (this as Writeable<this>).drag = drag;
    this._emitter.emit(SensorEventType.Start, eventData);
  }

  protected _move(data: BaseSensorDataArg<E['move']>) {
    if (!this.drag) return;
    this._updateDragData(data);
    const eventData = data as E['move'];
    eventData.startX = this.drag.startX;
    eventData.startY = this.drag.startY;
    eventData.deltaX = this.drag.deltaX;
    eventData.deltaY = this.drag.deltaY;
    this._emitter.emit(SensorEventType.Move, eventData);
  }

  protected _end(data: BaseSensorDataArg<E['end']>) {
    if (!this.drag) return;
    this._updateDragData(data);
    const eventData = data as E['end'];
    eventData.startX = this.drag.startX;
    eventData.startY = this.drag.startY;
    eventData.deltaX = this.drag.deltaX;
    eventData.deltaY = this.drag.deltaY;
    this._emitter.emit(SensorEventType.End, eventData);
    this._resetDragData();
  }

  protected _cancel(data: BaseSensorDataArg<E['cancel']>) {
    if (!this.drag) return;
    this._updateDragData(data);
    const eventData = data as E['cancel'];
    eventData.startX = this.drag.startX;
    eventData.startY = this.drag.startY;
    eventData.deltaX = this.drag.deltaX;
    eventData.deltaY = this.drag.deltaY;
    this._emitter.emit(SensorEventType.Cancel, eventData);
    this._resetDragData();
  }

  on<T extends keyof E>(
    type: T,
    listener: (e: E[T]) => void,
    listenerId?: SensorEventListenerId,
  ): SensorEventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<T extends keyof E>(type: T, listenerId: SensorEventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  cancel() {
    if (!this.drag) return;
    this._cancel({
      type: SensorEventType.Cancel,
      x: this.drag.x,
      y: this.drag.y,
      startX: this.drag.startX,
      startY: this.drag.startY,
      deltaX: this.drag.deltaX,
      deltaY: this.drag.deltaY,
    } as E['cancel']);
  }

  destroy() {
    if (this.isDestroyed) return;
    (this as Writeable<this>).isDestroyed = true;
    this.cancel();
    this._emitter.emit(SensorEventType.Destroy, {
      type: SensorEventType.Destroy,
    });
    this._emitter.off();
  }
}
