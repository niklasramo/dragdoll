import { ticker, tickerPhases } from '../singletons/ticker.js';
import type { Point, Writeable } from '../types.js';
import type { BaseSensorDataArg, BaseSensorDragData } from './base-sensor.js';
import { BaseSensor, BaseSensorEvents } from './base-sensor.js';
import type { Sensor } from './sensor.js';
import { SensorEventType } from './sensor.js';

export interface BaseMotionSensorTickEvent {
  type: 'tick';
  time: number;
  deltaTime: number;
}

export interface BaseMotionSensorEvents extends BaseSensorEvents {
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
  declare _events_type: E;
  readonly drag: BaseMotionSensorDragData | null;
  protected _direction: Point;
  protected _speed: number;
  protected _tickEvent: BaseMotionSensorTickEvent;
  protected _moveEvent: any;

  constructor() {
    super();
    this.drag = null;
    this._direction = { x: 0, y: 0 };
    this._speed = 0;
    this._tickEvent = { type: 'tick', time: 0, deltaTime: 0 };
    this._moveEvent = {
      type: SensorEventType.Move,
      x: 0,
      y: 0,
      srcEvent: null,
      target: null,
      startX: 0,
      startY: 0,
      deltaX: 0,
      deltaY: 0,
    };

    this._tick = this._tick.bind(this);
  }

  protected _createDragData(data: BaseSensorDataArg<E['start']>): BaseMotionSensorDragData {
    return {
      ...super._createDragData(data),
      time: 0,
      deltaTime: 0,
    };
  }

  protected _start(data: BaseSensorDataArg<E['start']>) {
    if (this.isDestroyed || this.drag) return;
    super._start(data);
    ticker.on(tickerPhases.read, this._tick, this._tick);
  }

  protected _end(data: BaseSensorDataArg<E['end']>) {
    if (!this.drag) return;
    ticker.off(tickerPhases.read, this._tick);
    super._end(data);
  }

  protected _cancel(data: BaseSensorDataArg<E['cancel']>) {
    if (!this.drag) return;
    ticker.off(tickerPhases.read, this._tick);
    super._cancel(data);
  }

  protected _tick(time: number) {
    if (!this.drag) return;
    if (time && this.drag.time) {
      // Update tick time and delta time.
      (this.drag.deltaTime as Writeable<number>) = time - this.drag.time;
      (this.drag.time as Writeable<number>) = time;

      // Emit tick event.
      const tickEvent = this._tickEvent;
      tickEvent.time = this.drag.time;
      tickEvent.deltaTime = this.drag.deltaTime;
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
        const moveEvent = this._moveEvent;
        moveEvent.x = this.drag.x + deltaX;
        moveEvent.y = this.drag.y + deltaY;
        this._move(moveEvent);
      }
    } else {
      (this.drag.time as Writeable<number>) = time;
      (this.drag.deltaTime as Writeable<number>) = 0;
    }
  }
}
