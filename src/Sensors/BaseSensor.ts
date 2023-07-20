import { Emitter, Events, EventListenerId } from 'eventti';

import { Sensor, SensorEvents, SensorEventType } from './Sensor.js';

import { Writeable } from '../types.js';

export interface BaseSensorDragData {
  readonly x: number;
  readonly y: number;
}

export class BaseSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  declare events: E;
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
    this._emitter.emit(SensorEventType.start, data);
  }

  protected _move(data: E['move']) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.move, data);
  }

  protected _end(data: E['end']) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.end, data);
    this._resetDragData();
  }

  protected _cancel(data: E['cancel']) {
    if (!this.drag) return;
    this._updateDragData(data);
    this._emitter.emit(SensorEventType.cancel, data);
    this._resetDragData();
  }

  on<K extends keyof E>(
    eventName: K,
    listener: (e: E[K]) => void,
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(eventName, listener, listenerId);
  }

  off<K extends keyof E>(eventName: K, listener: ((e: E[K]) => void) | EventListenerId): void {
    this._emitter.off(eventName, listener);
  }

  cancel() {
    if (!this.drag) return;
    this._emitter.emit(SensorEventType.cancel, {
      type: SensorEventType.cancel,
      x: this.drag.x,
      y: this.drag.y,
    });
    this._resetDragData();
  }

  destroy() {
    if (this.isDestroyed) return;
    (this as Writeable<this>).isDestroyed = true;
    this.cancel();
    this._emitter.emit(SensorEventType.destroy, {
      type: SensorEventType.destroy,
    });
    this._emitter.off();
  }
}
