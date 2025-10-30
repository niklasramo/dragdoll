import type { Point } from '../types.js';
import { BaseSensor } from './base-sensor.js';
import type {
  Sensor,
  SensorCancelEvent,
  SensorDestroyEvent,
  SensorEndEvent,
  SensorMoveEvent,
  SensorStartEvent,
} from './sensor.js';
import { SensorEventType } from './sensor.js';

export type KeyboardSensorPredicate<E extends KeyboardSensorEvents = KeyboardSensorEvents> = (
  e: KeyboardEvent,
  sensor: KeyboardSensor<E>,
) => Point | null | undefined;

export interface KeyboardSensorSettings<E extends KeyboardSensorEvents = KeyboardSensorEvents> {
  moveDistance: number | Point;
  cancelOnBlur: boolean;
  cancelOnVisibilityChange: boolean;
  startPredicate: KeyboardSensorPredicate<E>;
  movePredicate: KeyboardSensorPredicate<E>;
  cancelPredicate: KeyboardSensorPredicate<E>;
  endPredicate: KeyboardSensorPredicate<E>;
}

export interface KeyboardSensorStartEvent extends SensorStartEvent {
  srcEvent: KeyboardEvent;
}

export interface KeyboardSensorMoveEvent extends SensorMoveEvent {
  srcEvent: KeyboardEvent;
}

export interface KeyboardSensorCancelEvent extends SensorCancelEvent {
  srcEvent?: KeyboardEvent;
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

export const keyboardSensorDefaults: KeyboardSensorSettings<any> = {
  moveDistance: 25,
  cancelOnBlur: true,
  cancelOnVisibilityChange: true,
  startPredicate: (e, sensor) => {
    if (sensor.element && (e.key === 'Enter' || e.key === ' ')) {
      if (document.activeElement === sensor.element) {
        const { x, y } = sensor.element.getBoundingClientRect();
        return { x, y };
      }
    }
    return null;
  },
  movePredicate: (e, sensor) => {
    if (!sensor.drag) return null;

    switch (e.key) {
      case 'ArrowLeft': {
        return {
          x: sensor.drag.x - sensor.moveDistance.x,
          y: sensor.drag.y,
        };
      }
      case 'ArrowRight': {
        return {
          x: sensor.drag.x + sensor.moveDistance.x,
          y: sensor.drag.y,
        };
      }
      case 'ArrowUp': {
        return {
          x: sensor.drag.x,
          y: sensor.drag.y - sensor.moveDistance.y,
        };
      }
      case 'ArrowDown': {
        return {
          x: sensor.drag.x,
          y: sensor.drag.y + sensor.moveDistance.y,
        };
      }
      default: {
        return null;
      }
    }
  },
  cancelPredicate: (e, sensor) => {
    if (sensor.drag && e.key === 'Escape') {
      const { x, y } = sensor.drag;
      return { x, y };
    }
    return null;
  },
  endPredicate: (e, sensor) => {
    if (sensor.drag && (e.key === 'Enter' || e.key === ' ')) {
      const { x, y } = sensor.drag;
      return { x, y };
    }
    return null;
  },
} as const;

export class KeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>
  extends BaseSensor<E>
  implements Sensor<E>
{
  declare _events_type: E;
  readonly element: Element | null;
  readonly moveDistance: Point;
  protected _cancelOnBlur: boolean;
  protected _cancelOnVisibilityChange: boolean;
  protected _startPredicate: KeyboardSensorPredicate<E>;
  protected _movePredicate: KeyboardSensorPredicate<E>;
  protected _cancelPredicate: KeyboardSensorPredicate<E>;
  protected _endPredicate: KeyboardSensorPredicate<E>;

  constructor(element: Element | null, options: Partial<KeyboardSensorSettings<E>> = {}) {
    super();

    const {
      moveDistance = keyboardSensorDefaults.moveDistance,
      cancelOnBlur = keyboardSensorDefaults.cancelOnBlur,
      cancelOnVisibilityChange = keyboardSensorDefaults.cancelOnVisibilityChange,
      startPredicate = keyboardSensorDefaults.startPredicate,
      movePredicate = keyboardSensorDefaults.movePredicate,
      cancelPredicate = keyboardSensorDefaults.cancelPredicate,
      endPredicate = keyboardSensorDefaults.endPredicate,
    } = options;

    this.element = element;
    this.moveDistance =
      typeof moveDistance === 'number' ? { x: moveDistance, y: moveDistance } : { ...moveDistance };
    this._cancelOnBlur = cancelOnBlur;
    this._cancelOnVisibilityChange = cancelOnVisibilityChange;
    this._startPredicate = startPredicate;
    this._movePredicate = movePredicate;
    this._cancelPredicate = cancelPredicate;
    this._endPredicate = endPredicate;

    this._onKeyDown = this._onKeyDown.bind(this);
    this._internalCancel = this._internalCancel.bind(this);
    this._blurCancelHandler = this._blurCancelHandler.bind(this);

    document.addEventListener('keydown', this._onKeyDown);
    if (cancelOnBlur) {
      element?.addEventListener('blur', this._blurCancelHandler);
    }
    if (cancelOnVisibilityChange) {
      document.addEventListener('visibilitychange', this._internalCancel);
    }
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

  protected _onKeyDown(e: KeyboardEvent) {
    // Handle start.
    if (!this.drag) {
      const startPosition = this._startPredicate(e, this);
      if (startPosition) {
        e.preventDefault();
        this._start({
          type: SensorEventType.Start,
          x: startPosition.x,
          y: startPosition.y,
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
        type: SensorEventType.Cancel,
        x: cancelPosition.x,
        y: cancelPosition.y,
        srcEvent: e,
      });
      return;
    }

    // Handle end.
    const endPosition = this._endPredicate(e, this);
    if (endPosition) {
      e.preventDefault();
      this._end({
        type: SensorEventType.End,
        x: endPosition.x,
        y: endPosition.y,
        srcEvent: e,
      });
      return;
    }

    // Handle move.
    const movePosition = this._movePredicate(e, this);
    if (movePosition) {
      e.preventDefault();
      this._move({
        type: SensorEventType.Move,
        x: movePosition.x,
        y: movePosition.y,
        srcEvent: e,
      });
      return;
    }
  }

  updateSettings(options: Partial<KeyboardSensorSettings<E>>) {
    const {
      moveDistance,
      cancelOnBlur,
      cancelOnVisibilityChange,
      startPredicate,
      movePredicate,
      cancelPredicate,
      endPredicate,
    } = options;

    if (moveDistance !== undefined) {
      if (typeof moveDistance === 'number') {
        this.moveDistance.x = this.moveDistance.y = moveDistance;
      } else {
        this.moveDistance.x = moveDistance.x;
        this.moveDistance.y = moveDistance.y;
      }
    }

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

    if (startPredicate) {
      this._startPredicate = startPredicate;
    }

    if (movePredicate) {
      this._movePredicate = movePredicate;
    }

    if (cancelPredicate) {
      this._cancelPredicate = cancelPredicate;
    }

    if (endPredicate) {
      this._endPredicate = endPredicate;
    }
  }

  destroy() {
    if (this.isDestroyed) return;
    super.destroy();
    document.removeEventListener('keydown', this._onKeyDown);
    if (this._cancelOnBlur) {
      this.element?.removeEventListener('blur', this._blurCancelHandler);
    }
    if (this._cancelOnVisibilityChange) {
      document.removeEventListener('visibilitychange', this._internalCancel);
    }
  }
}
