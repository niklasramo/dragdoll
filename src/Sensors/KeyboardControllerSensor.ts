import { Sensor } from './Sensor';

import { BaseControllerSensor, BaseControllerSensorEvents } from './BaseControllerSensor';

export interface KeyboardControllerSensorSettings<
  T extends KeyboardControllerSensorEvents = KeyboardControllerSensorEvents
> {
  startPredicate: (
    e: KeyboardEvent,
    sensor: KeyboardControllerSensor<T>
  ) => { x: number; y: number } | null | undefined;
  computeSpeed: (sensor: KeyboardControllerSensor<T>) => number;
  startKeys: string[];
  moveLeftKeys: string[];
  moveRightKeys: string[];
  moveUpKeys: string[];
  moveDownKeys: string[];
  cancelKeys: string[];
  endKeys: string[];
}

export interface KeyboardControllerSensorEvents extends BaseControllerSensorEvents {}

const KEY_TYPES = [
  'start',
  'cancel',
  'end',
  'moveLeft',
  'moveRight',
  'moveUp',
  'moveDown',
] as const;

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

export class KeyboardControllerSensor<
    T extends KeyboardControllerSensorEvents = KeyboardControllerSensorEvents
  >
  extends BaseControllerSensor<T>
  implements Sensor<T>
{
  declare events: T;
  protected _startPredicate: Exclude<
    KeyboardControllerSensorSettings<T>['startPredicate'],
    undefined
  >;
  protected _computeSpeed: Exclude<KeyboardControllerSensorSettings<T>['computeSpeed'], undefined>;
  protected _moveKeys: Set<string>;
  protected _moveKeyTimestamps: Map<string, number>;
  protected _startKeys: Set<string>;
  protected _moveLeftKeys: Set<string>;
  protected _moveRightKeys: Set<string>;
  protected _moveUpKeys: Set<string>;
  protected _moveDownKeys: Set<string>;
  protected _cancelKeys: Set<string>;
  protected _endKeys: Set<string>;

  constructor(options: Partial<KeyboardControllerSensorSettings<T>> = {}) {
    super();

    const {
      startPredicate = () => {
        if (document.activeElement) {
          const { left, top } = document.activeElement.getBoundingClientRect();
          return { x: left, y: top };
        }
        return null;
      },
      computeSpeed = () => 500,
      startKeys = [' ', 'Space', 'Enter'],
      moveLeftKeys = ['ArrowLeft'],
      moveRightKeys = ['ArrowRight'],
      moveUpKeys = ['ArrowUp'],
      moveDownKeys = ['ArrowDown'],
      cancelKeys = ['Escape'],
      endKeys = [' ', 'Space', 'Enter'],
    } = options;

    this._computeSpeed = computeSpeed;
    this._startPredicate = startPredicate;
    this._startKeys = new Set(startKeys);
    this._cancelKeys = new Set(cancelKeys);
    this._endKeys = new Set(endKeys);
    this._moveLeftKeys = new Set(moveLeftKeys);
    this._moveRightKeys = new Set(moveRightKeys);
    this._moveUpKeys = new Set(moveUpKeys);
    this._moveDownKeys = new Set(moveDownKeys);
    this._moveKeys = new Set([...moveLeftKeys, ...moveRightKeys, ...moveUpKeys, ...moveDownKeys]);
    this._moveKeyTimestamps = new Map();

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onTick = this._onTick.bind(this);

    this.on('tick', this._onTick);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    window.addEventListener('blur', this.cancel);
    window.addEventListener('visibilitychange', this.cancel);
  }

  protected _end(data: T['end']) {
    if (!this.isActive) return;
    this._moveKeyTimestamps.clear();
    super._end(data);
  }

  protected _cancel(data: T['cancel']) {
    if (!this.isActive) return;
    this._moveKeyTimestamps.clear();
    super._cancel(data);
  }

  protected _updateDirection() {
    const leftTime = getEarliestTimestamp(this._moveLeftKeys, this._moveKeyTimestamps);
    const rightTime = getEarliestTimestamp(this._moveRightKeys, this._moveKeyTimestamps);
    const upTime = getEarliestTimestamp(this._moveUpKeys, this._moveKeyTimestamps);
    const downTime = getEarliestTimestamp(this._moveDownKeys, this._moveKeyTimestamps);

    let x = leftTime === rightTime ? 0 : leftTime < rightTime ? -1 : 1;
    let y = upTime === downTime ? 0 : upTime < downTime ? -1 : 1;

    // If the direction is NE/NW/SE/SW we need to normalize the direction
    // vector.
    if (!(x === 0 || y === 0)) {
      const normFactor = 1 / (Math.sqrt(x * x + y * y) || 1);
      x *= normFactor;
      y *= normFactor;
    }

    this.direction.x = x;
    this.direction.y = y;
  }

  protected _onTick() {
    this.speed = this._computeSpeed(this);
  }

  protected _onKeyUp(e: KeyboardEvent) {
    if (this._moveKeyTimestamps.get(e.key)) {
      this._moveKeyTimestamps.delete(e.key);
      this._updateDirection();
    }
  }

  protected _onKeyDown(e: KeyboardEvent) {
    // Handle start.
    if (!this.isActive) {
      if (this._startKeys.has(e.key)) {
        const startPosition = this._startPredicate(e, this);
        if (startPosition) {
          e.preventDefault();
          this._start({
            type: 'start',
            clientX: startPosition.x,
            clientY: startPosition.y,
          });
        }
      }
      return;
    }

    // Handle cancel.
    if (this._cancelKeys.has(e.key)) {
      e.preventDefault();
      this._cancel({
        type: 'cancel',
        clientX: this.clientX!,
        clientY: this.clientY!,
      });
      return;
    }

    // Handle end.
    if (this._endKeys.has(e.key)) {
      e.preventDefault();
      this._end({
        type: 'end',
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

  updateSettings(options: Partial<KeyboardControllerSensorSettings<T>> = {}) {
    let moveKeysMayNeedUpdate = false;

    if (options.startPredicate !== undefined) {
      this._startPredicate = options.startPredicate;
    }

    if (options.computeSpeed !== undefined) {
      this._computeSpeed = options.computeSpeed;
    }

    KEY_TYPES.forEach((keyType, index) => {
      const name = `${keyType}Keys` as const;
      const value = options[name];
      if (value !== undefined) {
        this[`_${name}`] = new Set(value);
        if (index >= 3) moveKeysMayNeedUpdate = true;
      }
    });

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

  destroy() {
    if (this.isDestroyed) return;
    this.off('tick', this._onTick);
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('blur', this.cancel);
    window.removeEventListener('visibilitychange', this.cancel);
    super.destroy();
  }
}
