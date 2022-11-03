import { Sensor, SensorEvents } from './Sensor';

import { BaseSensor } from './BaseSensor';

import { Writeable } from '../types';

import { ticker, tickerReadPhase } from '../singletons/ticker';

export interface BaseControllerSensorTickEvent {
  type: 'tick';
}

export interface BaseControllerSensorEvents extends SensorEvents {
  tick: BaseControllerSensorTickEvent;
}

export class BaseControllerSensor<T extends BaseControllerSensorEvents = BaseControllerSensorEvents>
  extends BaseSensor<T>
  implements Sensor<T>
{
  declare events: T;
  direction: { x: number; y: number };
  speed: number;
  readonly time: number;
  readonly deltaTime: number;

  constructor() {
    super();

    this.direction = { x: 0, y: 0 };
    this.speed = 0;
    this.time = 0;
    this.deltaTime = 0;

    this._tick = this._tick.bind(this);
  }

  protected _start(data: T['start']) {
    if (this.isDestroyed || this.isActive) return;
    super._start(data);
    ticker.on(tickerReadPhase, this._tick);
  }

  protected _end(data: T['end']) {
    if (!this.isActive) return;
    (this as Writeable<this>).time = 0;
    (this as Writeable<this>).deltaTime = 0;
    ticker.off(tickerReadPhase, this._tick);
    super._end(data);
  }

  protected _cancel(data: T['cancel']) {
    if (!this.isActive) return;
    (this as Writeable<this>).time = 0;
    (this as Writeable<this>).deltaTime = 0;
    ticker.off(tickerReadPhase, this._tick);
    super._cancel(data);
  }

  protected _tick(time: number) {
    if (this.isDestroyed || !this.isActive) return;
    if (time && this.time) {
      // Update tick time and delta time.
      (this as Writeable<this>).deltaTime = time - this.time;
      (this as Writeable<this>).time = time;

      // Emit tick event.
      this._emitter.emit('tick', { type: 'tick' });

      // Compute the movement offset (delta) by applying time factor to
      // the speed. The speed is assumed to be provided as pixels-per-second.
      const speedFactor = this.speed * (this.deltaTime / 1000);
      const deltaX = this.direction.x * speedFactor;
      const deltaY = this.direction.y * speedFactor;

      // Trigger move event if the clientX/Y needs change. Note that calling
      // this._move() automatically updates clientX/Y values also so we don't
      // need to do it here.
      if (deltaX || deltaY) {
        this._move({
          type: 'move',
          clientX: this.clientX + deltaX,
          clientY: this.clientY + deltaY,
        });
      }
    } else {
      (this as Writeable<this>).time = time;
      (this as Writeable<this>).deltaTime = 0;
    }
  }
}
