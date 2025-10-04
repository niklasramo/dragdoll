import type { Sensor } from './sensor.js';

import type { Point } from 'types.js';

import { SensorEventType } from './sensor.js';

import { BaseMotionSensor, BaseMotionSensorEvents } from './base-motion-sensor.js';

export interface KeyboardMotionSensorSettings<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
> {
  startKeys: string[];
  moveLeftKeys: string[];
  moveRightKeys: string[];
  moveUpKeys: string[];
  moveDownKeys: string[];
  cancelKeys: string[];
  endKeys: string[];
  cancelOnBlur: boolean;
  cancelOnVisibilityChange: boolean;
  computeSpeed: (sensor: KeyboardMotionSensor<E>) => number;
  startPredicate: (e: KeyboardEvent, sensor: KeyboardMotionSensor<E>) => Point | null | undefined;
}

export interface KeyboardMotionSensorEvents extends BaseMotionSensorEvents {}

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

export const keyboardMotionSensorDefaults: KeyboardMotionSensorSettings<any> = {
  startKeys: [' ', 'Enter'],
  moveLeftKeys: ['ArrowLeft'],
  moveRightKeys: ['ArrowRight'],
  moveUpKeys: ['ArrowUp'],
  moveDownKeys: ['ArrowDown'],
  cancelKeys: ['Escape'],
  endKeys: [' ', 'Enter'],
  cancelOnBlur: true,
  cancelOnVisibilityChange: true,
  computeSpeed: () => 500,
  startPredicate: (_e, sensor) => {
    if (sensor.element && document.activeElement === sensor.element) {
      const { left, top } = sensor.element.getBoundingClientRect();
      return { x: left, y: top };
    }
    return null;
  },
} as const;

export class KeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents>
  extends BaseMotionSensor<E>
  implements Sensor<E>
{
  declare _events_type: E;
  readonly element: Element | null;
  protected _moveKeys: Set<string>;
  protected _moveKeyTimestamps: Map<string, number>;
  protected _startKeys: Set<string>;
  protected _moveLeftKeys: Set<string>;
  protected _moveRightKeys: Set<string>;
  protected _moveUpKeys: Set<string>;
  protected _moveDownKeys: Set<string>;
  protected _cancelKeys: Set<string>;
  protected _endKeys: Set<string>;
  protected _cancelOnBlur: boolean;
  protected _cancelOnVisibilityChange: boolean;
  protected _computeSpeed: Exclude<KeyboardMotionSensorSettings<E>['computeSpeed'], undefined>;
  protected _startPredicate: Exclude<KeyboardMotionSensorSettings<E>['startPredicate'], undefined>;

  constructor(element: Element | null, options: Partial<KeyboardMotionSensorSettings<E>> = {}) {
    super();

    const {
      startPredicate = keyboardMotionSensorDefaults.startPredicate,
      computeSpeed = keyboardMotionSensorDefaults.computeSpeed,
      cancelOnVisibilityChange = keyboardMotionSensorDefaults.cancelOnVisibilityChange,
      cancelOnBlur = keyboardMotionSensorDefaults.cancelOnBlur,
      startKeys = keyboardMotionSensorDefaults.startKeys,
      moveLeftKeys = keyboardMotionSensorDefaults.moveLeftKeys,
      moveRightKeys = keyboardMotionSensorDefaults.moveRightKeys,
      moveUpKeys = keyboardMotionSensorDefaults.moveUpKeys,
      moveDownKeys = keyboardMotionSensorDefaults.moveDownKeys,
      cancelKeys = keyboardMotionSensorDefaults.cancelKeys,
      endKeys = keyboardMotionSensorDefaults.endKeys,
    } = options;

    this.element = element;
    this._startKeys = new Set(startKeys);
    this._cancelKeys = new Set(cancelKeys);
    this._endKeys = new Set(endKeys);
    this._moveLeftKeys = new Set(moveLeftKeys);
    this._moveRightKeys = new Set(moveRightKeys);
    this._moveUpKeys = new Set(moveUpKeys);
    this._moveDownKeys = new Set(moveDownKeys);
    this._moveKeys = new Set([...moveLeftKeys, ...moveRightKeys, ...moveUpKeys, ...moveDownKeys]);
    this._moveKeyTimestamps = new Map();
    this._cancelOnBlur = cancelOnBlur;
    this._cancelOnVisibilityChange = cancelOnVisibilityChange;
    this._computeSpeed = computeSpeed;
    this._startPredicate = startPredicate;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._onTick = this._onTick.bind(this);
    this._internalCancel = this._internalCancel.bind(this);
    this._blurCancelHandler = this._blurCancelHandler.bind(this);

    this.on('tick', this._onTick, this._onTick);
    document.addEventListener('keydown', this._onKeyDown);
    document.addEventListener('keyup', this._onKeyUp);
    if (cancelOnBlur) {
      element?.addEventListener('blur', this._blurCancelHandler);
    }
    if (cancelOnVisibilityChange) {
      document.addEventListener('visibilitychange', this._internalCancel);
    }
  }

  protected _end(data: E['end']) {
    if (!this.drag) return;
    this._moveKeyTimestamps.clear();
    this._direction.x = 0;
    this._direction.y = 0;
    super._end(data);
  }

  protected _cancel(data: E['cancel']) {
    if (!this.drag) return;
    this._moveKeyTimestamps.clear();
    this._direction.x = 0;
    this._direction.y = 0;
    super._cancel(data);
  }

  protected _internalCancel() {
    this.cancel();
  }

  protected _blurCancelHandler() {
    // If the Draggable has a container defined the dragged element will be
    // appended to the container, which will cause the element to lose focus
    // temporarily in some browsers (e.g. Chrome). Draggable will automatically
    // restore the focus immediately after the element is appended, but the blur
    // event will be triggered anyway. This is why we need to defer the cancel
    // call to the next microtask, where we can check if the element is still
    // focused.
    queueMicrotask(() => {
      if (document.activeElement !== this.element) {
        this.cancel();
      }
    });
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

    this._direction.x = x;
    this._direction.y = y;
  }

  protected _onTick() {
    this._speed = this._computeSpeed(this);
  }

  protected _onKeyUp(e: KeyboardEvent) {
    if (this._moveKeyTimestamps.get(e.key)) {
      this._moveKeyTimestamps.delete(e.key);
      this._updateDirection();
    }
  }

  protected _onKeyDown(e: KeyboardEvent) {
    // Handle start.
    if (!this.drag) {
      if (this._startKeys.has(e.key)) {
        const startPosition = this._startPredicate(e, this);
        if (startPosition) {
          e.preventDefault();
          this._start({
            type: SensorEventType.Start,
            x: startPosition.x,
            y: startPosition.y,
          });
        }
      }
      return;
    }

    // Handle cancel.
    if (this._cancelKeys.has(e.key)) {
      e.preventDefault();
      this._internalCancel();
      return;
    }

    // Handle end.
    if (this._endKeys.has(e.key)) {
      e.preventDefault();
      this._end({
        type: SensorEventType.End,
        x: this.drag.x,
        y: this.drag.y,
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

  updateSettings(options: Partial<KeyboardMotionSensorSettings<E>> = {}) {
    let moveKeysMayNeedUpdate = false;

    const { cancelOnBlur, cancelOnVisibilityChange, startPredicate, computeSpeed } = options;

    if (cancelOnBlur !== undefined && this._cancelOnBlur !== cancelOnBlur) {
      this._cancelOnBlur = cancelOnBlur;
      if (cancelOnBlur) {
        this.element?.addEventListener('blur', this._blurCancelHandler);
      } else {
        this.element?.removeEventListener('blur', this._blurCancelHandler);
      }
    }

    if (
      cancelOnVisibilityChange !== undefined &&
      this._cancelOnVisibilityChange !== cancelOnVisibilityChange
    ) {
      this._cancelOnVisibilityChange = cancelOnVisibilityChange;
      if (cancelOnVisibilityChange) {
        document.addEventListener('visibilitychange', this._internalCancel);
      } else {
        document.removeEventListener('visibilitychange', this._internalCancel);
      }
    }

    if (startPredicate !== undefined) {
      this._startPredicate = startPredicate;
    }

    if (computeSpeed !== undefined) {
      this._computeSpeed = computeSpeed;
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
        (key, index) => nextMoveKeys[index] === key,
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
    super.destroy();
    this.off('tick', this._onTick);
    document.removeEventListener('keydown', this._onKeyDown);
    document.removeEventListener('keyup', this._onKeyUp);
    if (this._cancelOnBlur) {
      this.element?.removeEventListener('blur', this._blurCancelHandler);
    }
    if (this._cancelOnVisibilityChange) {
      document.removeEventListener('visibilitychange', this._internalCancel);
    }
  }
}
