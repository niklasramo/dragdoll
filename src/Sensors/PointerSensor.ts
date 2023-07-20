import { Emitter, Events, EventListenerId } from 'eventti';

import { ListenerOptions, Writeable, PointerType } from '../types.js';

import {
  Sensor,
  SensorEventType,
  SensorStartEvent,
  SensorMoveEvent,
  SensorCancelEvent,
  SensorEndEvent,
  SensorDestroyEvent,
} from './Sensor.js';

import { getPointerEventData } from '../utils/getPointerEventData.js';

import { getPointerType } from '../utils/getPointerType.js';

import { getPointerId } from '../utils/getPointerId.js';

import { parseListenerOptions } from '../utils/parseListenerOptions.js';

import { parseSourceEvents } from '../utils/parseSourceEvents.js';

const POINTER_EVENTS = {
  start: 'pointerdown',
  move: 'pointermove',
  cancel: 'pointercancel',
  end: 'pointerup',
} as const;

const TOUCH_EVENTS = {
  start: 'touchstart',
  move: 'touchmove',
  cancel: 'touchcancel',
  end: 'touchend',
} as const;

const MOUSE_EVENTS = {
  start: 'mousedown',
  move: 'mousemove',
  cancel: '',
  end: 'mouseup',
} as const;

const SOURCE_EVENTS = {
  pointer: POINTER_EVENTS,
  touch: TOUCH_EVENTS,
  mouse: MOUSE_EVENTS,
} as const;

type PointerSensorSourceEvent = PointerEvent | TouchEvent | MouseEvent;

export type PointerSensorDragData = {
  readonly pointerId: number;
  readonly pointerType: PointerType;
  readonly x: number;
  readonly y: number;
};

export interface PointerSensorSettings {
  listenerOptions: ListenerOptions;
  sourceEvents: keyof typeof SOURCE_EVENTS | 'auto';
  startPredicate: (e: PointerSensorSourceEvent) => boolean;
}

export interface PointerSensorStartEvent extends SensorStartEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorMoveEvent extends SensorMoveEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorCancelEvent extends SensorCancelEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent | null;
  target: EventTarget | null;
}

export interface PointerSensorEndEvent extends SensorEndEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent | null;
  target: EventTarget | null;
}

export interface PointerSensorDestroyEvent extends SensorDestroyEvent {}

export interface PointerSensorEvents {
  start: PointerSensorStartEvent;
  move: PointerSensorMoveEvent;
  cancel: PointerSensorCancelEvent;
  end: PointerSensorEndEvent;
  destroy: PointerSensorDestroyEvent;
}

export class PointerSensor<E extends PointerSensorEvents = PointerSensorEvents>
  implements Sensor<E>
{
  declare events: E;

  /**
   * The observed element or window.
   */
  readonly element: Element | Window;

  /**
   * Current drag data, null if drag is not active.
   */
  readonly drag: PointerSensorDragData | null;

  /**
   * Indicator if the instance is destroyed.
   */
  readonly isDestroyed: boolean;

  /**
   * The options object to be used for `addEventListener`.
   */
  protected _startPredicate: (e: PointerSensorSourceEvent) => boolean;

  /**
   * The options object to be used for `addEventListener`.
   */
  protected _listenerOptions: ListenerOptions;

  /**
   * Type of tracked source events.
   */
  protected _sourceEvents: keyof typeof SOURCE_EVENTS;

  /**
   * Indicator if window's listener's are bound.
   */
  protected _areWindowListenersBound: boolean;

  /**
   * Internal event emitter instance.
   */
  protected _emitter: Emitter<Events>;

  constructor(element: Element | Window, options: Partial<PointerSensorSettings> = {}) {
    const {
      listenerOptions = {},
      sourceEvents = 'auto',
      startPredicate = (e) => ('button' in e && e.button > 0 ? false : true),
    } = options;

    this.element = element;
    this.drag = null;
    this.isDestroyed = false;

    this._areWindowListenersBound = false;
    this._startPredicate = startPredicate;
    this._listenerOptions = parseListenerOptions(listenerOptions);
    this._sourceEvents = parseSourceEvents(sourceEvents);
    this._emitter = new Emitter();

    this._onStart = this._onStart.bind(this);
    this._onMove = this._onMove.bind(this);
    this._onCancel = this._onCancel.bind(this);
    this._onEnd = this._onEnd.bind(this);

    // Listen to start event.
    element.addEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions,
    );
  }

  /**
   * Check if the provided event contains the tracked pointer id or in the case
   * of touch event if the first changed touch is the tracked touch object and
   * return the event or touch object. Otherwise return null.
   */
  protected _getTrackedPointerEventData(
    e: PointerSensorSourceEvent,
  ): PointerEvent | MouseEvent | Touch | null {
    return this.drag ? getPointerEventData(e, this.drag.pointerId) : null;
  }

  /**
   * Listener for start event.
   */
  protected _onStart(e: PointerSensorSourceEvent) {
    if (this.isDestroyed || this.drag) return;

    // Make sure start predicate is fulfilled.
    if (!this._startPredicate(e)) return;

    // Try to get pointer id.
    const pointerId = getPointerId(e);
    if (pointerId === null) return;

    // Try to get pointer.
    const pointerEventData = getPointerEventData(e, pointerId);
    if (pointerEventData === null) return;

    // Create drag data.
    const dragData: PointerSensorDragData = {
      pointerId,
      pointerType: getPointerType(e),
      x: pointerEventData.clientX,
      y: pointerEventData.clientY,
    };

    // Set drag data.
    (this as Writeable<this>).drag = dragData;

    // Emit start event.
    const eventData: PointerSensorStartEvent = {
      ...dragData,
      type: SensorEventType.start,
      srcEvent: e,
      target: pointerEventData.target,
    };
    this._emitter.emit(eventData.type, eventData);

    // If the drag procedure was not reset within the start procedure let's
    // activate the instance (start listening to move/cancel/end events).
    if (this.drag) {
      this._bindWindowListeners();
    }
  }

  /**
   * Listener for move event.
   */
  protected _onMove(e: PointerSensorSourceEvent) {
    if (!this.drag) return;

    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;

    (this.drag.x as Writeable<number>) = pointerEventData.clientX;
    (this.drag.y as Writeable<number>) = pointerEventData.clientY;

    const eventData: PointerSensorMoveEvent = {
      type: SensorEventType.move,
      srcEvent: e,
      target: pointerEventData.target,
      ...this.drag,
    };

    this._emitter.emit(eventData.type, eventData);
  }

  /**
   * Listener for cancel event.
   */
  protected _onCancel(e: PointerEvent | TouchEvent) {
    if (!this.drag) return;

    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;

    (this.drag.x as Writeable<number>) = pointerEventData.clientX;
    (this.drag.y as Writeable<number>) = pointerEventData.clientY;

    const eventData: PointerSensorCancelEvent = {
      type: SensorEventType.cancel,
      srcEvent: e,
      target: pointerEventData.target,
      ...this.drag,
    };

    this._emitter.emit(eventData.type, eventData);

    this._resetDrag();
  }

  /**
   * Listener for end event.
   */
  protected _onEnd(e: PointerSensorSourceEvent) {
    if (!this.drag) return;

    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;

    (this.drag.x as Writeable<number>) = pointerEventData.clientX;
    (this.drag.y as Writeable<number>) = pointerEventData.clientY;

    const eventData: PointerSensorEndEvent = {
      type: SensorEventType.end,
      srcEvent: e,
      target: pointerEventData.target,
      ...this.drag,
    };

    this._emitter.emit(eventData.type, eventData);

    this._resetDrag();
  }

  /**
   * Bind window event listeners for move/end/cancel.
   */
  protected _bindWindowListeners() {
    if (this._areWindowListenersBound) return;
    const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
    window.addEventListener(move, this._onMove, this._listenerOptions);
    window.addEventListener(end, this._onEnd, this._listenerOptions);
    if (cancel) {
      window.addEventListener(cancel, this._onCancel, this._listenerOptions);
    }
    this._areWindowListenersBound = true;
  }

  /**
   * Unbind window event listeners for move/end/cancel.
   */
  protected _unbindWindowListeners() {
    if (this._areWindowListenersBound) {
      const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
      window.removeEventListener(move, this._onMove, this._listenerOptions);
      window.removeEventListener(end, this._onEnd, this._listenerOptions);
      if (cancel) {
        window.removeEventListener(cancel, this._onCancel, this._listenerOptions);
      }
      this._areWindowListenersBound = false;
    }
  }

  /**
   * Reset drag data.
   */
  protected _resetDrag() {
    (this as Writeable<this>).drag = null;
    this._unbindWindowListeners();
  }

  /**
   * Forcefully cancel the drag process.
   */
  cancel() {
    if (!this.drag) return;

    const eventData: PointerSensorCancelEvent = {
      type: SensorEventType.cancel,
      srcEvent: null,
      target: null,
      ...this.drag,
    };

    this._emitter.emit(eventData.type, eventData);

    this._resetDrag();
  }

  /**
   * Update the instance's settings.
   */
  updateSettings(options: Partial<PointerSensorSettings>) {
    if (this.isDestroyed) return;

    const { listenerOptions, sourceEvents, startPredicate } = options;
    const nextSourceEvents = parseSourceEvents(sourceEvents);
    const nextListenerOptions = parseListenerOptions(listenerOptions);

    // Update start predicate if needed.
    if (startPredicate && this._startPredicate !== startPredicate) {
      this._startPredicate = startPredicate;
    }

    // Update listener options and/or source events if needed.
    if (
      (listenerOptions &&
        (this._listenerOptions.capture !== nextListenerOptions.capture ||
          this._listenerOptions.passive === nextListenerOptions.passive)) ||
      (sourceEvents && this._sourceEvents !== nextSourceEvents)
    ) {
      // Unbind start listener.
      this.element.removeEventListener(
        SOURCE_EVENTS[this._sourceEvents].start,
        this._onStart as EventListener,
        this._listenerOptions,
      );

      // Unbind window listeners.
      this._unbindWindowListeners();

      // Cancel current drag process.
      this.cancel();

      // Update options to instace.
      if (sourceEvents) {
        this._sourceEvents = nextSourceEvents;
      }
      if (listenerOptions && nextListenerOptions) {
        this._listenerOptions = nextListenerOptions;
      }

      // Rebind start listener with new options.
      this.element.addEventListener(
        SOURCE_EVENTS[this._sourceEvents].start,
        this._onStart as EventListener,
        this._listenerOptions,
      );
    }
  }

  /**
   * Bind a drag event listener.
   */
  on<K extends keyof E>(
    eventName: K,
    listener: (e: E[K]) => void,
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(eventName, listener, listenerId);
  }

  /**
   * Unbind a drag event listener.
   */
  off<K extends keyof E>(eventName: K, listener: ((e: E[K]) => void) | EventListenerId): void {
    this._emitter.off(eventName, listener);
  }

  /**
   * Destroy the instance and unbind all drag event listeners.
   */
  destroy() {
    if (this.isDestroyed) return;

    // Mark as destroyed.
    (this as Writeable<this>).isDestroyed = true;

    // Cancel any ongoing drag process.
    this.cancel();

    // Emit destroy event.
    this._emitter.emit(SensorEventType.destroy, {
      type: SensorEventType.destroy,
    });

    // Destroy emitter.
    this._emitter.off();

    // Unbind start event listeners.
    this.element.removeEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions,
    );
  }
}
