import type { EventListenerId, Events } from 'eventti';
import { Emitter } from 'eventti';
import type { Writeable } from '../types.js';
import type { Sensor, SensorEvents } from './sensor.js';
import { SensorEventType } from './sensor.js';

export interface BaseSensorDragData {
  readonly x: number;
  readonly y: number;
}

export class BaseSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  declare _events_type: E;
  readonly drag: BaseSensorDragData | null;
  readonly isDestroyed: boolean;
  protected _emitter: Emitter<Events>;

  constructor() {
    this.drag = null;
    this.isDestroyed = false;
    this._emitter = new Emitter();
  }

  protected _createDragData(data: E['start']): BaseSensorDragData {
    return {
      x: data.x,
      y: data.y,
    };
  }

  protected _updateDragData(data: E['move'] | E['end'] | E['cancel']) {
    if (!this.drag) return;
    (this.drag.x as Writeable<number>) = data.x;
    (this.drag.y as Writeable<number>) = data.y;
  }

  protected _resetDragData() {
    (this as Writeable<this>).drag = null;
  }

  protected _start(data: E['start']) {
    if (this.isDestroyed || this.drag) return;
    (this as Writeable<this>).drag = this._createDragData(data);
    this._emitter.emit(SensorEventType.Start, data);
  }

  protected _move(data: E['move']) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.Move, data);
  }

  protected _end(data: E['end']) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.End, data);
    this._resetDragData();
  }

  protected _cancel(data: E['cancel']) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.Cancel, data);
    this._resetDragData();
  }

  on<T extends keyof E>(
    type: T,
    listener: (e: E[T]) => void,
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<T extends keyof E>(type: T, listenerId: EventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  cancel() {
    if (!this.drag) return;
    this._cancel({
      type: SensorEventType.Cancel,
      x: this.drag.x,
      y: this.drag.y,
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
