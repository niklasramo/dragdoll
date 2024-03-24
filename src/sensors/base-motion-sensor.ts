import { Sensor, SensorEvents } from './sensor.js';

import { BaseSensor, BaseSensorDragData } from './base-sensor.js';

import { Point, Writeable } from '../types.js';

import { ticker, tickerReadPhase } from '../singletons/ticker.js';

export interface BaseMotionSensorTickEvent {
  type: 'tick';
  time: number;
  deltaTime: number;
}

export interface BaseMotionSensorEvents extends SensorEvents {
  tick: BaseMotionSensorTickEvent;
}

export interface BaseMotionSensorDragData extends BaseSensorDragData {
  readonly time: number;
  readonly deltaTime: number;
}

export class BaseMotionSensor<E extends BaseMotionSensorEvents = BaseMotionSensorEvents>
  extends BaseSensor<E>
  implements Sensor<E>
{
  declare events: E;
  readonly drag: BaseMotionSensorDragData | null;
  protected _direction: Point;
  protected _speed: number;

  constructor() {
    super();
    this.drag = null;
    this._direction = { x: 0, y: 0 };
    this._speed = 0;

    this._tick = this._tick.bind(this);
  }

  protected _createDragData(data: E['start']): BaseMotionSensorDragData {
    return {
      ...super._createDragData(data),
      time: 0,
      deltaTime: 0,
    };
  }

  protected _start(data: E['start']) {
    if (this.isDestroyed || this.drag) return;
    super._start(data);
    ticker.on(tickerReadPhase, this._tick, this._tick);
  }

  protected _end(data: E['end']) {
    if (!this.drag) return;
    ticker.off(tickerReadPhase, this._tick);
    super._end(data);
  }

  protected _cancel(data: E['cancel']) {
    if (!this.drag) return;
    ticker.off(tickerReadPhase, this._tick);
    super._cancel(data);
  }

  protected _tick(time: number) {
    if (!this.drag) return;
    if (time && this.drag.time) {
      // Update tick time and delta time.
      (this.drag.deltaTime as Writeable<number>) = time - this.drag.time;
      (this.drag.time as Writeable<number>) = time;

      // Emit tick event.
      const tickEvent: BaseMotionSensorTickEvent = {
        type: 'tick',
        time: this.drag.time,
        deltaTime: this.drag.deltaTime,
      };
      this._emitter.emit('tick', tickEvent);

      // Make sure the sensor is still active.
      if (!this.drag) return;

      // Compute the movement offset (delta) by applying time factor to
      // the speed. The speed is assumed to be provided as pixels-per-second.
      const speedFactor = this._speed * (this.drag.deltaTime / 1000);
      const deltaX = this._direction.x * speedFactor;
      const deltaY = this._direction.y * speedFactor;

      // Trigger move event if the clientX/Y needs change. Note that calling
      // this._move() automatically updates clientX/Y values also so we don't
      // need to do it here.
      if (deltaX || deltaY) {
        this._move({
          type: 'move',
          x: this.drag.x + deltaX,
          y: this.drag.y + deltaY,
        });
      }
    } else {
      (this.drag.time as Writeable<number>) = time;
      (this.drag.deltaTime as Writeable<number>) = 0;
    }
  }
}
