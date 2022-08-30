import {
  Sensor,
  SensorStartEvent,
  SensorMoveEvent,
  SensorCancelEvent,
  SensorEndEvent,
  SensorDestroyEvent,
} from './Sensor';

import { BaseSensor } from './BaseSensor';

const DEFAULT_MOVE_DISTANCE = 25;

export type KeyboardSensorPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor
) => { x: number; y: number } | null | void;

export interface KeyboardSensorOptions {
  startPredicate?: KeyboardSensorPredicate;
  movePredicate?: KeyboardSensorPredicate;
  cancelPredicate?: KeyboardSensorPredicate;
  endPredicate?: KeyboardSensorPredicate;
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

export class KeyboardSensor
  extends BaseSensor<KeyboardSensorEvents>
  implements Sensor<KeyboardSensorEvents>
{
  declare events: KeyboardSensorEvents;
  protected _startPredicate: KeyboardSensorPredicate;
  protected _movePredicate: KeyboardSensorPredicate;
  protected _cancelPredicate: KeyboardSensorPredicate;
  protected _endPredicate: KeyboardSensorPredicate;

  constructor(options: KeyboardSensorOptions = {}) {
    super();

    const {
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
              x: (sensor.clientX as number) - DEFAULT_MOVE_DISTANCE,
              y: sensor.clientY as number,
            };
          }
          case 'ArrowRight': {
            return {
              x: (sensor.clientX as number) + DEFAULT_MOVE_DISTANCE,
              y: sensor.clientY as number,
            };
          }
          case 'ArrowUp': {
            return {
              x: sensor.clientX as number,
              y: (sensor.clientY as number) - DEFAULT_MOVE_DISTANCE,
            };
          }
          case 'ArrowDown': {
            return {
              x: sensor.clientX as number,
              y: (sensor.clientY as number) + DEFAULT_MOVE_DISTANCE,
            };
          }
          default: {
            return null;
          }
        }
      },
      cancelPredicate = (e, sensor) => {
        if (e.key === 'Escape') {
          return { x: sensor.clientX as number, y: sensor.clientY as number };
        }
        return null;
      },
      endPredicate = (e, sensor) => {
        if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
          return { x: sensor.clientX as number, y: sensor.clientY as number };
        }
        return null;
      },
    } = options;

    this._startPredicate = startPredicate;
    this._movePredicate = movePredicate;
    this._cancelPredicate = cancelPredicate;
    this._endPredicate = endPredicate;

    this._onKeyDown = this._onKeyDown.bind(this);
    document.addEventListener('keydown', this._onKeyDown);
  }

  protected _onKeyDown(e: KeyboardEvent) {
    // Handle start.
    if (!this._isActive) {
      const startPosition = this._startPredicate(e, this);
      if (startPosition) {
        e.preventDefault();
        this._start({
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
        clientX: movePosition.x,
        clientY: movePosition.y,
        srcEvent: e,
      });
      return;
    }
  }

  updateSettings(options: KeyboardSensorOptions = {}) {
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
    if (this._isDestroyed) return;
    document.removeEventListener('keydown', this._onKeyDown);
    super.destroy();
  }
}
