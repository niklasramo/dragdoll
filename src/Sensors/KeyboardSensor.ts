import {
  Sensor,
  SensorStartEvent,
  SensorMoveEvent,
  SensorCancelEvent,
  SensorEndEvent,
  SensorDestroyEvent,
} from './Sensor.js';

import { BaseSensor } from './BaseSensor.js';

export type KeyboardSensorPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor,
  moveDistance: number,
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

export class KeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>
  extends BaseSensor<E>
  implements Sensor<E>
{
  declare events: E;
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
          if (document.activeElement && document.activeElement !== document.body) {
            const { left, top } = document.activeElement.getBoundingClientRect();
            return { x: left, y: top };
          }
        }
        return null;
      },
      movePredicate = (e, sensor, moveDistance) => {
        if (!sensor.drag) return null;

        switch (e.key) {
          case 'ArrowLeft': {
            return {
              x: sensor.drag.x - moveDistance,
              y: sensor.drag.y,
            };
          }
          case 'ArrowRight': {
            return {
              x: sensor.drag.x + moveDistance,
              y: sensor.drag.y,
            };
          }
          case 'ArrowUp': {
            return {
              x: sensor.drag.x,
              y: sensor.drag.y - moveDistance,
            };
          }
          case 'ArrowDown': {
            return {
              x: sensor.drag.x,
              y: sensor.drag.y + moveDistance,
            };
          }
          default: {
            return null;
          }
        }
      },
      cancelPredicate = (e, sensor) => {
        if (sensor.drag && e.key === 'Escape') {
          return { x: sensor.drag.x, y: sensor.drag.y };
        }
        return null;
      },
      endPredicate = (e, sensor) => {
        if (sensor.drag && (e.key === 'Enter' || e.key === 'Space' || e.key === ' ')) {
          return { x: sensor.drag.x, y: sensor.drag.y };
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
    if (!this.drag) {
      const startPosition = this._startPredicate(e, this, this._moveDistance);
      if (startPosition) {
        e.preventDefault();
        this._start({
          type: 'start',
          x: startPosition.x,
          y: startPosition.y,
          srcEvent: e,
        });
      }
      return;
    }

    // Handle cancel.
    const cancelPosition = this._cancelPredicate(e, this, this._moveDistance);
    if (cancelPosition) {
      e.preventDefault();
      this._cancel({
        type: 'cancel',
        x: cancelPosition.x,
        y: cancelPosition.y,
        srcEvent: e,
      });
      return;
    }

    // Handle end.
    const endPosition = this._endPredicate(e, this, this._moveDistance);
    if (endPosition) {
      e.preventDefault();
      this._end({
        type: 'end',
        x: endPosition.x,
        y: endPosition.y,
        srcEvent: e,
      });
      return;
    }

    // Handle move.
    const movePosition = this._movePredicate(e, this, this._moveDistance);
    if (movePosition) {
      e.preventDefault();
      this._move({
        type: 'move',
        x: movePosition.x,
        y: movePosition.y,
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
    super.destroy();
    document.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('blur', this.cancel);
    window.removeEventListener('visibilitychange', this.cancel);
  }
}
