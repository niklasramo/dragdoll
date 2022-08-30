import { Emitter, Events, EventListenerId } from 'eventti';

import { Sensor, SensorEvents, SensorEventType } from './Sensor';

import { Writeable } from '../types';

export class BaseSensor<T extends SensorEvents = SensorEvents> implements Sensor<T> {
  declare events: T;
  readonly clientX: number | null;
  readonly clientY: number | null;
  protected _isActive: boolean;
  protected _isDestroyed: boolean;
  protected _emitter: Emitter<Events>;

  constructor() {
    this.clientX = null;
    this.clientY = null;
    this._isActive = false;
    this._isDestroyed = false;
    this._emitter = new Emitter();
  }

  protected _start(data: Omit<T['start'], 'type'>) {
    if (this._isDestroyed || this._isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    this._isActive = true;
    this._emitter.emit(SensorEventType.start, {
      type: SensorEventType.start,
      ...data,
    });
  }

  protected _move(data: Omit<T['move'], 'type'>) {
    if (!this._isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    this._emitter.emit(SensorEventType.move, {
      type: SensorEventType.move,
      ...data,
    });
  }

  protected _end(data: Omit<T['end'], 'type'>) {
    if (!this._isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    this._isActive = false;
    this._emitter.emit(SensorEventType.end, {
      type: SensorEventType.end,
      ...data,
    });
  }

  protected _cancel(data: Omit<T['cancel'], 'type'>) {
    if (!this._isActive) return;
    (this as Writeable<this>).clientX = data.clientX;
    (this as Writeable<this>).clientY = data.clientY;
    this._isActive = false;
    this._emitter.emit(SensorEventType.cancel, {
      type: SensorEventType.cancel,
      ...data,
    });
  }

  on<K extends keyof T>(
    eventType: K,
    listener: (e: T[K]) => void,
    listenerId?: EventListenerId
  ): EventListenerId {
    return this._emitter.on(eventType, listener, listenerId);
  }

  off<K extends keyof T>(eventType?: K, listener?: ((e: T[K]) => void) | EventListenerId): void {
    this._emitter.off(eventType, listener);
  }

  cancel() {
    if (!this._isActive) return;
    this._isActive = false;
    this._emitter.emit(SensorEventType.cancel, {
      type: SensorEventType.cancel,
      clientX: this.clientX as number,
      clientY: this.clientY as number,
    });
  }

  destroy() {
    if (this._isDestroyed) return;
    this.cancel();
    this._isDestroyed = true;
    this._emitter.emit(SensorEventType.destroy, {
      type: SensorEventType.destroy,
    });
    this._emitter.off();
  }
}
