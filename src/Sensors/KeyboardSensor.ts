import {
  Sensor,
  SensorStartEvent,
  SensorMoveEvent,
  SensorCancelEvent,
  SensorEndEvent,
  SensorDestroyEvent,
} from './Sensor';

import { BaseSensor } from './BaseSensor';

export type KeyboardSensorPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor
) => { x: number; y: number } | null | undefined;

export interface KeyboardSensorSettings {
  moveDistance: number;
  startPredicate: KeyboardSensorPredicate;
  movePredicate: KeyboardSensorPredicate;
  cancelPredicate: KeyboardSensorPredicate;
  endPredicate: KeyboardSensorPredicate;
}

export interface KeyboardSensorStartEvent extends SensorStartEvent {
  srcEvent: KeyboardEvent;
}

export interface KeyboardSensorMoveEvent extends SensorMoveEvent {
  srcEvent: KeyboardEvent;
}

export interface KeyboardSensorCancelEvent extends SensorCancelEvent {
  srcEvent: KeyboardEvent;
}

export interface KeyboardSensorEndEvent extends SensorEndEvent {
  srcEvent: KeyboardEvent;
}

export interface KeyboardSensorDestroyEvent extends SensorDestroyEvent {}

export interface KeyboardSensorEvents {
  start: KeyboardSensorStartEvent;
  move: KeyboardSensorMoveEvent;
  cancel: KeyboardSensorCancelEvent;
  end: KeyboardSensorEndEvent;
  destroy: KeyboardSensorDestroyEvent;
}

export class KeyboardSensor<T extends KeyboardSensorEvents = KeyboardSensorEvents>
  extends BaseSensor<T>
  implements Sensor<T>
{
  declare events: T;
  protected _moveDistance: number;
  protected _startPredicate: KeyboardSensorPredicate;
  protected _movePredicate: KeyboardSensorPredicate;
  protected _cancelPredicate: KeyboardSensorPredicate;
  protected _endPredicate: KeyboardSensorPredicate;

  constructor(options: Partial<KeyboardSensorSettings> = {}) {
    super();

    const {
      moveDistance = 25,
      startPredicate = (e) => {
        if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
          if (document.activeElement) {
            const { left, top } = document.activeElement.getBoundingClientRect();
            return { x: left, y: top };
          }
        }
        return null;
      },
      movePredicate = (e, sensor) => {
        switch (e.key) {
          case 'ArrowLeft': {
            return {
              x: sensor.clientX - sensor._moveDistance,
              y: sensor.clientY,
            };
          }
          case 'ArrowRight': {
            return {
              x: sensor.clientX + sensor._moveDistance,
              y: sensor.clientY,
            };
          }
          case 'ArrowUp': {
            return {
              x: sensor.clientX,
              y: sensor.clientY - sensor._moveDistance,
            };
          }
          case 'ArrowDown': {
            return {
              x: sensor.clientX,
              y: sensor.clientY + sensor._moveDistance,
            };
          }
          default: {
            return null;
          }
        }
      },
      cancelPredicate = (e, sensor) => {
        if (e.key === 'Escape') {
          return { x: sensor.clientX, y: sensor.clientY };
        }
        return null;
      },
      endPredicate = (e, sensor) => {
        if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
          return { x: sensor.clientX, y: sensor.clientY };
        }
        return null;
      },
    } = options;

    this._moveDistance = moveDistance;
    this._startPredicate = startPredicate;
    this._movePredicate = movePredicate;
    this._cancelPredicate = cancelPredicate;
    this._endPredicate = endPredicate;

    this.cancel = this.cancel.bind(this);
    this._onKeyDown = this._onKeyDown.bind(this);

    document.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('blur', this.cancel);
    window.addEventListener('visibilitychange', this.cancel);
  }

  protected _onKeyDown(e: KeyboardEvent) {
    // Handle start.
    if (!this.isActive) {
      const startPosition = this._startPredicate(e, this);
      if (startPosition) {
        e.preventDefault();
        this._start({
          type: 'start',
          clientX: startPosition.x,
          clientY: startPosition.y,
          srcEvent: e,
        });
      }
      return;
    }

    // Handle cancel.
    const cancelPosition = this._cancelPredicate(e, this);
    if (cancelPosition) {
      e.preventDefault();
      this._cancel({
        type: 'cancel',
        clientX: cancelPosition.x,
        clientY: cancelPosition.y,
        srcEvent: e,
      });
      return;
    }

    // Handle end.
    const endPosition = this._endPredicate(e, this);
    if (endPosition) {
      e.preventDefault();
      this._end({
        type: 'end',
        clientX: endPosition.x,
        clientY: endPosition.y,
        srcEvent: e,
      });
      return;
    }

    // Handle move.
    const movePosition = this._movePredicate(e, this);
    if (movePosition) {
      e.preventDefault();
      this._move({
        type: 'move',
        clientX: movePosition.x,
        clientY: movePosition.y,
        srcEvent: e,
      });
      return;
    }
  }

  updateSettings(options: Partial<KeyboardSensorSettings> = {}) {
    if (options.moveDistance !== undefined) {
      this._moveDistance = options.moveDistance;
    }

    if (options.startPredicate !== undefined) {
      this._startPredicate = options.startPredicate;
    }

    if (options.movePredicate !== undefined) {
      this._movePredicate = options.movePredicate;
    }

    if (options.cancelPredicate !== undefined) {
      this._cancelPredicate = options.cancelPredicate;
    }

    if (options.endPredicate !== undefined) {
      this._endPredicate = options.endPredicate;
    }
  }

  destroy() {
    if (this.isDestroyed) return;
    document.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('blur', this.cancel);
    window.removeEventListener('visibilitychange', this.cancel);
    super.destroy();
  }
}
