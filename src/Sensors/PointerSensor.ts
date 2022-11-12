import { Emitter, Events, EventListenerId } from 'eventti';

import { ListenerOptions, Writeable, PointerType } from '../types';

import {
  Sensor,
  SensorEventType,
  SensorStartEvent,
  SensorMoveEvent,
  SensorCancelEvent,
  SensorEndEvent,
  SensorDestroyEvent,
} from './Sensor';

import { getPointerEventData } from '../utils/getPointerEventData';

import { getPointerType } from '../utils/getPointerType';

import { getPointerId } from '../utils/getPointerId';

import { parseListenerOptions } from '../utils/parseListenerOptions';

import { parseSourceEvents } from '../utils/parseSourceEvents';

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

export class PointerSensor<T extends PointerSensorEvents = PointerSensorEvents>
  implements Sensor<T>
{
  declare events: T;

  /**
   * The observed element or window.
   */
  readonly element: HTMLElement | Window;

  /**
   * Pointer id of the current drag process, `null` when the element is not
   * being dragged.
   */
  readonly pointerId: number | null;

  /**
   * Pointer type of the current drag process, `null` when the element is not
   * being dragged.
   */
  readonly pointerType: PointerType | null;

  /**
   * Current client x-position of the drag input, `null` when the element is
   * not being dragged.
   */
  readonly clientX: number | null;

  /**
   * Current client y-position of the drag input, `null` when the element is
   * not being dragged.
   */
  readonly clientY: number | null;

  /**
   * Indicator if a drag process is active. Will be set to `false` just before
   * emitting the final event.
   */
  readonly isActive: boolean;

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

  constructor(element: HTMLElement | Window, options: Partial<PointerSensorSettings> = {}) {
    const {
      listenerOptions = {},
      sourceEvents = 'auto',
      startPredicate = (e) => ('button' in e && e.button > 0 ? false : true),
    } = options;

    this.element = element;
    this.pointerId = null;
    this.pointerType = null;
    this.clientX = null;
    this.clientY = null;
    this.isActive = false;
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
      this._listenerOptions
    );
  }

  /**
   * Check if the provided event contains the tracked pointer id or in the case
   * of touch event if the first changed touch is the tracked touch object and
   * return the event or touch object. Otherwise return null.
   */
  protected _getTrackedPointerEventData(
    e: PointerEvent | TouchEvent | MouseEvent
  ): PointerEvent | MouseEvent | Touch | null {
    if (this.pointerId === null) return null;
    return getPointerEventData(e, this.pointerId);
  }

  /**
   * Listener for start event.
   */
  protected _onStart(e: PointerEvent | TouchEvent | MouseEvent) {
    if (this.isDestroyed) return;

    // If pointer id is already assigned let's return early.
    if (this.pointerId !== null) return;

    // Make sure start predicate is fulfilled.
    if (!this._startPredicate(e)) return;

    // Try to get pointer id.
    const pointerId = getPointerId(e);
    if (pointerId === null) return;

    // Try to get pointer.
    const pointerEventData = getPointerEventData(e, pointerId);
    if (pointerEventData === null) return;

    // Setup initial data.
    (this as Writeable<this>).pointerId = pointerId;
    (this as Writeable<this>).pointerType = getPointerType(e);
    (this as Writeable<this>).clientX = pointerEventData.clientX;
    (this as Writeable<this>).clientY = pointerEventData.clientY;
    (this as Writeable<this>).isActive = true;

    // Emit start event.
    const eventData: PointerSensorStartEvent = {
      type: SensorEventType.start,
      clientX: (this as Writeable<this>).clientX as number,
      clientY: (this as Writeable<this>).clientY as number,
      pointerId: (this as Writeable<this>).pointerId as number,
      pointerType: (this as Writeable<this>).pointerType as PointerType,
      srcEvent: e,
      target: pointerEventData.target,
    };
    this._emitter.emit(eventData.type, eventData);

    // If the drag procedure was not reset within the start procedure let's
    // activate the instance (start listening to move/cancel/end events).
    if (this.pointerId !== null && this.isActive) {
      this._bindWindowListeners();
    }
  }

  /**
   * Listener for move event.
   */
  protected _onMove(e: PointerEvent | TouchEvent | MouseEvent) {
    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData || !this.isActive) return;

    (this as Writeable<this>).clientX = pointerEventData.clientX;
    (this as Writeable<this>).clientY = pointerEventData.clientY;

    const eventData: PointerSensorMoveEvent = {
      type: SensorEventType.move,
      clientX: this.clientX as number,
      clientY: this.clientY as number,
      pointerId: this.pointerId as number,
      pointerType: this.pointerType as PointerType,
      srcEvent: e,
      target: pointerEventData.target,
    };

    this._emitter.emit(eventData.type, eventData);
  }

  /**
   * Listener for cancel event.
   */
  protected _onCancel(e: PointerEvent | TouchEvent) {
    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData || !this.isActive) return;

    (this as Writeable<this>).isActive = false;
    (this as Writeable<this>).clientX = pointerEventData.clientX;
    (this as Writeable<this>).clientY = pointerEventData.clientY;

    const eventData: PointerSensorCancelEvent = {
      type: SensorEventType.cancel,
      clientX: this.clientX as number,
      clientY: this.clientY as number,
      pointerId: this.pointerId as number,
      pointerType: this.pointerType as PointerType,
      srcEvent: e,
      target: pointerEventData.target,
    };

    this._emitter.emit(eventData.type, eventData);

    this._reset();
  }

  /**
   * Listener for end event.
   */
  protected _onEnd(e: PointerEvent | TouchEvent | MouseEvent) {
    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData || !this.isActive) return;

    (this as Writeable<this>).isActive = false;
    (this as Writeable<this>).clientX = pointerEventData.clientX;
    (this as Writeable<this>).clientY = pointerEventData.clientY;

    const eventData: PointerSensorEndEvent = {
      type: SensorEventType.end,
      clientX: this.clientX as number,
      clientY: this.clientY as number,
      pointerId: this.pointerId as number,
      pointerType: this.pointerType as PointerType,
      srcEvent: e,
      target: pointerEventData.target,
    };

    this._emitter.emit(eventData.type, eventData);

    this._reset();
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
   * Reset current drag operation data.
   */
  protected _reset() {
    (this as Writeable<this>).pointerId = null;
    (this as Writeable<this>).pointerType = null;
    (this as Writeable<this>).clientX = null;
    (this as Writeable<this>).clientY = null;
    (this as Writeable<this>).isActive = false;
    this._unbindWindowListeners();
  }

  /**
   * Forcefully cancel the drag process.
   */
  cancel() {
    if (!this.pointerId || !this.isActive) return;

    (this as Writeable<this>).isActive = false;

    const eventData: PointerSensorCancelEvent = {
      type: SensorEventType.cancel,
      clientX: this.clientX as number,
      clientY: this.clientY as number,
      pointerId: this.pointerId as number,
      pointerType: this.pointerType as PointerType,
      srcEvent: null,
      target: null,
    };

    this._emitter.emit(eventData.type, eventData);

    this._reset();
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
        this._listenerOptions
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
        this._listenerOptions
      );
    }
  }

  /**
   * Bind a drag event listener.
   */
  on<K extends keyof T>(
    eventName: K,
    listener: (e: T[K]) => void,
    listenerId?: EventListenerId
  ): EventListenerId {
    return this._emitter.on(eventName, listener, listenerId);
  }

  /**
   * Unbind a drag event listener.
   */
  off<K extends keyof T>(eventName: K, listener: ((e: T[K]) => void) | EventListenerId): void {
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
      this._listenerOptions
    );
  }
}
