import { Emitter, Events, EventListenerId } from 'eventti';

import { Sensor, SensorEvents, SensorEventType } from './Sensor';

import { Writeable } from '../types';

export class BaseSensor<T extends SensorEvents = SensorEvents> implements Sensor<T> {
  declare events: T;
  readonly clientX: number;
  readonly clientY: number;
  readonly isActive: boolean;
  readonly isDestroyed: boolean;
  protected _emitter: Emitter<Events>;

  constructor() {
    this.clientX = 0;
    this.clientY = 0;
    this.isActive = false;
    this.isDestroyed = false;
    this._emitter = new Emitter();
  }

  protected _start(data: T['start']) {
    if (this.isDestroyed || this.isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    (this as Writeable<this>).isActive = true;
    this._emitter.emit(SensorEventType.start, data);
  }

  protected _move(data: T['move']) {
    if (!this.isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    this._emitter.emit(SensorEventType.move, data);
  }

  protected _end(data: T['end']) {
    if (!this.isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    (this as Writeable<this>).isActive = false;
    this._emitter.emit(SensorEventType.end, data);
  }

  protected _cancel(data: T['cancel']) {
    if (!this.isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    (this as Writeable<this>).isActive = false;
    this._emitter.emit(SensorEventType.cancel, data);
  }

  on<K extends keyof T>(
    eventName: K,
    listener: (e: T[K]) => void,
    listenerId?: EventListenerId
  ): EventListenerId {
    return this._emitter.on(eventName, listener, listenerId);
  }

  off<K extends keyof T>(eventName: K, listener: ((e: T[K]) => void) | EventListenerId): void {
    this._emitter.off(eventName, listener);
  }

  cancel() {
    if (!this.isActive) return;
    (this as Writeable<this>).isActive = false;
    this._emitter.emit(SensorEventType.cancel, {
      type: SensorEventType.cancel,
      clientX: this.clientX!,
      clientY: this.clientY!,
    });
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
