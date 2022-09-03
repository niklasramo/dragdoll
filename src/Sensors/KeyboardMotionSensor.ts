import {
  Sensor,
  SensorStartEvent,
  SensorMoveEvent,
  SensorCancelEvent,
  SensorEndEvent,
  SensorDestroyEvent,
} from './Sensor';

import { BaseSensor } from './BaseSensor';

import { Writeable } from '../types';

import { ticker, tickerReadPhase } from '../singletons/ticker';

export type KeyboardMotionSensorStartPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardMotionSensor
) => { x: number; y: number } | null | void;

export type KeyboardMotionSensorSpeed =
  | ((sensor: KeyboardMotionSensor) => { x: number; y: number })
  | number;

export interface KeyboardMotionSensorOptions {
  startPredicate?: KeyboardMotionSensorStartPredicate;
  speed?: KeyboardMotionSensorSpeed;
  startKeys?: string[];
  moveLeftKeys?: string[];
  moveRightKeys?: string[];
  moveUpKeys?: string[];
  moveDownKeys?: string[];
  cancelKeys?: string[];
  endKeys?: string[];
}

export interface KeyboardMotionSensorStartEvent extends SensorStartEvent {}

export interface KeyboardMotionSensorMoveEvent extends SensorMoveEvent {}

export interface KeyboardMotionSensorCancelEvent extends SensorCancelEvent {}

export interface KeyboardMotionSensorEndEvent extends SensorEndEvent {}

export interface KeyboardMotionSensorDestroyEvent extends SensorDestroyEvent {}

export interface KeyboardMotionSensorEvents {
  start: KeyboardMotionSensorStartEvent;
  move: KeyboardMotionSensorMoveEvent;
  cancel: KeyboardMotionSensorCancelEvent;
  end: KeyboardMotionSensorEndEvent;
  destroy: KeyboardMotionSensorDestroyEvent;
}

function getEarliestTimestamp(keys: Set<string>, timestamps: Map<string, number>) {
  if (!keys.size || !timestamps.size) return Infinity;
  let result = Infinity;
  for (const key of keys) {
    const timestamp = timestamps.get(key);
    if (timestamp !== undefined && timestamp < result) {
      result = timestamp;
    }
  }
  return result;
}

export function keyboardMotionSensorSmoothSpeed(
  // Pixels per second.
  maxSpeed = 500,
  // Time in seconds, how long it will take to accelerate from 0 to maxSpeed.
  accelerationFactor = 0.5,
  // Time in seconds, how long it will take to decelerate maxSpeed to 0.
  decelerationFactor = 0.25
) {
  const acceleration = maxSpeed * (accelerationFactor > 0 ? 1 / accelerationFactor : Infinity);
  const deceleration = maxSpeed * (decelerationFactor > 0 ? 1 / decelerationFactor : Infinity);
  const getNextSpeed = (direction: -1 | 0 | 1, currentSpeed: number, deltaTime: number) => {
    let nextSpeed = 0;
    // If we need to decelerate to zero.
    if (direction === 0) {
      nextSpeed = 0;
      if (currentSpeed > 0) {
        nextSpeed = Math.max(0, currentSpeed - deceleration * (deltaTime / 1000));
      } else if (currentSpeed < 0) {
        nextSpeed = Math.min(0, currentSpeed + deceleration * (deltaTime / 1000));
      }
    }
    // If we need to accelerate/decelerate to positive max speed.
    else if (direction === 1) {
      nextSpeed = maxSpeed;
      if (currentSpeed < maxSpeed) {
        nextSpeed = Math.min(maxSpeed, currentSpeed + acceleration * (deltaTime / 1000));
      } else if (currentSpeed > maxSpeed) {
        nextSpeed = Math.max(maxSpeed, currentSpeed - deceleration * (deltaTime / 1000));
      }
    }
    // If we need to accelerate/decelerate to negative max speed.
    else {
      nextSpeed = -maxSpeed;
      if (currentSpeed > -maxSpeed) {
        nextSpeed = Math.max(-maxSpeed, currentSpeed - acceleration * (deltaTime / 1000));
      } else if (currentSpeed < -maxSpeed) {
        nextSpeed = Math.min(-maxSpeed, currentSpeed + deceleration * (deltaTime / 1000));
      }
    }
    return nextSpeed;
  };

  return function (sensor: KeyboardMotionSensor) {
    if (sensor.tickDeltaTime > 0) {
      return {
        x: getNextSpeed(sensor.directionX, sensor.speedX, sensor.tickDeltaTime),
        y: getNextSpeed(sensor.directionY, sensor.speedY, sensor.tickDeltaTime),
      };
    } else {
      return {
        x: sensor.speedX,
        y: sensor.speedY,
      };
    }
  };
}

export class KeyboardMotionSensor
  extends BaseSensor<KeyboardMotionSensorEvents>
  implements Sensor<KeyboardMotionSensorEvents>
{
  declare events: KeyboardMotionSensorEvents;
  readonly directionX: -1 | 0 | 1;
  readonly directionY: -1 | 0 | 1;
  readonly speedX: number;
  readonly speedY: number;
  readonly tickTime: number;
  readonly tickDeltaTime: number;
  protected _isTicking: boolean;
  protected _moveKeys: Set<string>;
  protected _moveKeyTimestamps: Map<string, number>;
  protected _startKeys: Set<string>;
  protected _moveLeftKeys: Set<string>;
  protected _moveRightKeys: Set<string>;
  protected _moveUpKeys: Set<string>;
  protected _moveDownKeys: Set<string>;
  protected _cancelKeys: Set<string>;
  protected _endKeys: Set<string>;
  protected _startPredicate: KeyboardMotionSensorStartPredicate;
  protected _speed: KeyboardMotionSensorSpeed;

  constructor(options: KeyboardMotionSensorOptions = {}) {
    super();

    const {
      startPredicate = () => {
        if (document.activeElement) {
          const { left, top } = document.activeElement.getBoundingClientRect();
          return { x: left, y: top };
        }
        return null;
      },
      speed = keyboardMotionSensorSmoothSpeed(),
      startKeys = [' ', 'Space', 'Enter'],
      moveLeftKeys = ['ArrowLeft'],
      moveRightKeys = ['ArrowRight'],
      moveUpKeys = ['ArrowUp'],
      moveDownKeys = ['ArrowDown'],
      cancelKeys = ['Escape'],
      endKeys = [' ', 'Space', 'Enter'],
    } = options;

    this.directionX = 0;
    this.directionY = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.tickTime = 0;
    this.tickDeltaTime = 0;

    this._isTicking = false;
    this._startPredicate = startPredicate;
    this._speed = speed;
    this._startKeys = new Set(startKeys);
    this._cancelKeys = new Set(cancelKeys);
    this._endKeys = new Set(endKeys);
    this._moveLeftKeys = new Set(moveLeftKeys);
    this._moveRightKeys = new Set(moveRightKeys);
    this._moveUpKeys = new Set(moveUpKeys);
    this._moveDownKeys = new Set(moveDownKeys);
    this._moveKeys = new Set([...moveLeftKeys, ...moveRightKeys, ...moveUpKeys, ...moveDownKeys]);
    this._moveKeyTimestamps = new Map();

    this.cancel = this.cancel.bind(this);
    this._onTick = this._onTick.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);

    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this.cancel);
    window.addEventListener('visibilitychange', this.cancel);
  }

  protected _onTick(time: number) {
    if (this._isDestroyed || !this._isTicking) return;
    if (time && this.tickTime) {
      // Update tick time and delta time.
      (this as Writeable<this>).tickDeltaTime = time - this.tickTime;
      (this as Writeable<this>).tickTime = time;

      // Update speed.
      this._updateSpeed();

      // If there is speed there is movement.
      if (this.speedX !== 0 || this.speedY !== 0) {
        // Compute the movement offset (delta) by applying time factor to
        // the speed. The speed is assumed to be provided as pixels-per-second.
        const timeFactor = this.tickDeltaTime / 1000;
        const deltaX = this.speedX * timeFactor;
        const deltaY = this.speedY * timeFactor;

        // Compute the next client x and y by adding the movement offset to
        // the current client x/y values.
        const nextClientX = (this.clientX as number) + deltaX;
        const nextClientY = (this.clientY as number) + deltaY;

        // Trigger move if client x/y has changed.
        if (nextClientX !== this.clientX || nextClientY !== this.clientY) {
          this._move({
            clientX: nextClientX,
            clientY: nextClientY,
          });
        }
      }
    } else {
      (this as Writeable<this>).tickTime = time;
      (this as Writeable<this>).tickDeltaTime = 0;
    }
  }

  protected _startTicking() {
    if (this._isDestroyed || this._isTicking) return;
    this._isTicking = true;
    ticker.on(tickerReadPhase, this._onTick);
  }

  protected _stopTicking() {
    if (this._isDestroyed || !this._isTicking) return;
    this._isTicking = false;
    this._moveKeyTimestamps.clear();
    (this as Writeable<this>).tickTime = 0;
    (this as Writeable<this>).tickDeltaTime = 0;
    (this as Writeable<this>).directionX = 0;
    (this as Writeable<this>).directionY = 0;
    (this as Writeable<this>).speedX = 0;
    (this as Writeable<this>).speedY = 0;
    ticker.off(tickerReadPhase, this._onTick);
  }

  protected _updateDirection() {
    const leftTime = getEarliestTimestamp(this._moveLeftKeys, this._moveKeyTimestamps);
    const rightTime = getEarliestTimestamp(this._moveRightKeys, this._moveKeyTimestamps);
    const upTime = getEarliestTimestamp(this._moveUpKeys, this._moveKeyTimestamps);
    const downTime = getEarliestTimestamp(this._moveDownKeys, this._moveKeyTimestamps);
    (this as Writeable<this>).directionX =
      leftTime === rightTime ? 0 : leftTime < rightTime ? -1 : 1;
    (this as Writeable<this>).directionY = upTime === downTime ? 0 : upTime < downTime ? -1 : 1;
  }

  protected _updateSpeed() {
    // The speed is assumed to be provided as pixels-per-second. For each axis
    // the speed can be negative, position or zero.
    // - Zero speed means no movement.
    // - Positive speed translates to "forward" movement on the axis, so that
    //   would be right on x-axis and down on y-axis.
    // - Negative speed translates to "reverse" movement on the axis, so that
    //   would be left on x-axis and up on y-axis.
    if (typeof this._speed === 'function') {
      // If speed is provided via function we do not automatically apply
      // the current direction to it so that one can control it better and
      // make e.g. custom deceleration logic when the direction changes.
      const { x, y } = this._speed(this);
      (this as Writeable<this>).speedX = x;
      (this as Writeable<this>).speedY = y;
    } else {
      // If speed is provided as number we automatically apply the direction
      // to it based on the current direction.
      (this as Writeable<this>).speedX = this._speed * this.directionX;
      (this as Writeable<this>).speedY = this._speed * this.directionY;
    }
  }

  protected _onKeyUp(e: KeyboardEvent) {
    if (this._moveKeyTimestamps.get(e.key)) {
      this._moveKeyTimestamps.delete(e.key);
      this._updateDirection();
    }
  }

  protected _onKeyDown(e: KeyboardEvent) {
    // Handle start.
    if (!this._isActive) {
      if (this._startKeys.has(e.key)) {
        const startPosition = this._startPredicate(e, this);
        if (startPosition) {
          e.preventDefault();
          this._start({
            clientX: startPosition.x,
            clientY: startPosition.y,
          });
          this._startTicking();
        }
      }
      return;
    }

    // Handle cancel.
    if (this._cancelKeys.has(e.key)) {
      e.preventDefault();
      this._stopTicking();
      this._cancel({
        clientX: this.clientX!,
        clientY: this.clientY!,
      });
      return;
    }

    // Handle end.
    if (this._endKeys.has(e.key)) {
      e.preventDefault();
      this._stopTicking();
      this._end({
        clientX: this.clientX!,
        clientY: this.clientY!,
      });
      return;
    }

    // Handle move.
    if (this._moveKeys.has(e.key)) {
      e.preventDefault();
      if (!this._moveKeyTimestamps.get(e.key)) {
        this._moveKeyTimestamps.set(e.key, Date.now());
        this._updateDirection();
      }
      return;
    }
  }

  updateSettings(options: KeyboardMotionSensorOptions = {}) {
    let moveKeysMayNeedUpdate = false;

    if (options.startPredicate !== undefined) {
      this._startPredicate = options.startPredicate;
    }

    if (options.speed !== undefined) {
      this._speed = options.speed;
    }

    if (options.startKeys !== undefined) {
      this._startKeys = new Set(options.startKeys);
    }

    if (options.cancelKeys !== undefined) {
      this._cancelKeys = new Set(options.cancelKeys);
    }

    if (options.endKeys !== undefined) {
      this._endKeys = new Set(options.endKeys);
    }

    if (options.moveLeftKeys !== undefined) {
      this._moveLeftKeys = new Set(options.moveLeftKeys);
      moveKeysMayNeedUpdate = true;
    }

    if (options.moveRightKeys !== undefined) {
      this._moveRightKeys = new Set(options.moveRightKeys);
      moveKeysMayNeedUpdate = true;
    }

    if (options.moveUpKeys !== undefined) {
      this._moveUpKeys = new Set(options.moveUpKeys);
      moveKeysMayNeedUpdate = true;
    }

    if (options.moveDownKeys !== undefined) {
      this._moveDownKeys = new Set(options.moveDownKeys);
      moveKeysMayNeedUpdate = true;
    }

    if (moveKeysMayNeedUpdate) {
      // Construct the next move keys array.
      const nextMoveKeys = [
        ...this._moveLeftKeys,
        ...this._moveRightKeys,
        ...this._moveUpKeys,
        ...this._moveDownKeys,
      ];

      // Check if the next move keys are equal to the current ones.
      const areMoveKeysEqual = [...this._moveKeys].every(
        (key, index) => nextMoveKeys[index] === key
      );

      // Update move keys if needed.
      if (!areMoveKeysEqual) {
        this._moveKeys = new Set(nextMoveKeys);
        this._moveKeyTimestamps.clear();
        this._updateDirection();
      }
    }
  }

  tick(time: number) {
    this._onTick(time);
  }

  cancel() {
    if (!this._isActive) return;
    this._stopTicking();
    this._cancel({
      clientX: this.clientX!,
      clientY: this.clientY!,
    });
  }

  destroy() {
    if (this._isDestroyed) return;
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this.cancel);
    window.removeEventListener('visibilitychange', this.cancel);
    super.destroy();
  }
}
