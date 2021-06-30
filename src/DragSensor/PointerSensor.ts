import { ListenerOptions, Writeable, PointerType } from '../types';

import {
  DragSensor,
  DragSensorEventType,
  DragSensorStartEvent,
  DragSensorMoveEvent,
  DragSensorEndEvent,
  DragSensorCancelEvent,
  DragSensorAbortEvent,
  DragSensorDestroyEvent,
} from './DragSensor';

import { Emitter } from '../Emitter';

import { getPointerById } from '../utils/getPointerById';

import { getPointerType } from '../utils/getPointerType';

import { getPointerId } from '../utils/getPointerId';

import { parseListenerOptions } from '../utils/parseListenerOptions';

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

interface PointerSensorSourceEvents {
  start: PointerSensorSourceEvent;
  move: PointerSensorSourceEvent;
  end: PointerSensorSourceEvent;
  cancel: PointerSensorSourceEvent;
  abort: null;
  destroy: null;
}

export interface PointerSensorOptions {
  listenerOptions?: ListenerOptions;
  sourceEvents?: keyof typeof SOURCE_EVENTS;
  startPredicate?: (e: PointerSensorSourceEvent) => boolean;
}

export interface PointerSensorStartEvent extends DragSensorStartEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorMoveEvent extends DragSensorMoveEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorEndEvent extends DragSensorEndEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorCancelEvent extends DragSensorCancelEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorAbortEvent extends DragSensorAbortEvent {
  pointerId: number;
  pointerType: PointerType;
}

export interface PointerSensorDestroyEvent extends DragSensorDestroyEvent {}

export interface PointerSensorEvents {
  start: PointerSensorStartEvent;
  move: PointerSensorMoveEvent;
  end: PointerSensorEndEvent;
  cancel: PointerSensorCancelEvent;
  abort: PointerSensorAbortEvent;
  destroy: PointerSensorDestroyEvent;
}

export class PointerSensor extends DragSensor<PointerSensorEvents> {
  /**
   * The observed element or window, `null` if the instance is destroyed.
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
   * Indicator if a drag process is active. Will be set to `false` just before
   * emitting the final event.
   */
  protected _isActive: boolean;

  /**
   * Indicator if the instance is destroyed.
   */
  protected _isDestroyed: boolean;

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
  protected _emitter: Emitter;

  constructor(element: HTMLElement | Window, options: PointerSensorOptions = {}) {
    super();

    const {
      listenerOptions = {},
      sourceEvents = 'pointer',
      startPredicate = (e) => ('button' in e && e.button ? false : true),
    } = options;

    this.element = element;
    this.pointerId = null;
    this.pointerType = null;

    this._isActive = false;
    this._isDestroyed = false;
    this._areWindowListenersBound = false;
    this._startPredicate = startPredicate;
    this._listenerOptions = parseListenerOptions(listenerOptions);
    this._sourceEvents = sourceEvents;
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
  protected _getTrackedPointer(
    e: PointerEvent | TouchEvent | MouseEvent
  ): PointerEvent | MouseEvent | Touch | null {
    if (this.pointerId === null) return null;
    return getPointerById(e, this.pointerId);
  }

  /**
   * Handler for start event.
   */
  protected _onStart(e: PointerEvent | TouchEvent | MouseEvent) {
    if (this._isDestroyed) return;

    // If pointer id is already assigned let's return early.
    if (this.pointerId !== null) return;

    // Make sure start predicate is fulfilled.
    if (!this._startPredicate(e)) return;

    // Try to get pointer id.
    const pointerId = getPointerId(e);
    if (pointerId === null) return;

    // Try to get pointer.
    const pointer = getPointerById(e, pointerId);
    if (pointer === null) return;

    // Setup initial data and emit start event.
    (this as Writeable<this>).pointerId = pointerId;
    (this as Writeable<this>).pointerType = getPointerType(e);
    this._isActive = true;
    this._emit(DragSensorEventType.start, e);

    // If the drag procedure was not reset within the start procedure let's
    // activate the instance (start listening to move/cancel/end events).
    if (this.pointerId !== null && this._isActive) {
      this._bindWindowListeners();
    }
  }

  /**
   * Handler for move event.
   */
  protected _onMove(e: PointerEvent | TouchEvent | MouseEvent) {
    if (!this._getTrackedPointer(e) || !this._isActive) return;
    this._emit(DragSensorEventType.move, e);
  }

  /**
   * Handler for cancel event.
   */
  protected _onCancel(e: PointerEvent | TouchEvent | MouseEvent) {
    if (!this._getTrackedPointer(e) || !this._isActive) return;
    this._isActive = false;
    this._emit(DragSensorEventType.cancel, e);
    this._reset();
  }

  /**
   * Handler for end event.
   */
  protected _onEnd(e: PointerEvent | TouchEvent | MouseEvent) {
    if (!this._getTrackedPointer(e) || !this._isActive) return;
    this._isActive = false;
    this._emit(DragSensorEventType.end, e);
    this._reset();
  }

  /**
   * Bind window event listeners for move/end/cancel.
   */
  protected _bindWindowListeners() {
    if (!this._areWindowListenersBound) {
      const { move, end, cancel } = SOURCE_EVENTS[this._sourceEvents];
      window.addEventListener(move, this._onMove, this._listenerOptions);
      window.addEventListener(end, this._onEnd, this._listenerOptions);
      if (cancel) {
        window.addEventListener(cancel, this._onCancel, this._listenerOptions);
      }
      this._areWindowListenersBound = true;
    }
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
    this._isActive = false;
    this._unbindWindowListeners();
  }

  /**
   * Emit drag sensor event.
   */
  protected _emit<T extends keyof PointerSensorSourceEvents>(
    type: T,
    e: PointerSensorSourceEvents[T]
  ) {
    if (this.pointerId === null || this.pointerType === null) return;

    let eventData:
      | PointerSensorStartEvent
      | PointerSensorMoveEvent
      | PointerSensorCancelEvent
      | PointerSensorEndEvent
      | PointerSensorAbortEvent
      | PointerSensorDestroyEvent;

    if (type === DragSensorEventType.destroy) {
      eventData = {
        type: type,
      } as PointerSensorDestroyEvent;
    } else if (type === DragSensorEventType.abort) {
      eventData = {
        type: type,
        pointerId: this.pointerId,
        pointerType: this.pointerType,
        isFirst: false,
        isFinal: true,
      } as PointerSensorAbortEvent;
    } else {
      const pointer = this._getTrackedPointer(e as PointerSensorSourceEvent);
      if (!pointer) return;

      eventData = {
        type: type,
        pointerId: this.pointerId,
        pointerType: this.pointerType,
        isFirst: type === DragSensorEventType.start,
        isFinal:
          type === DragSensorEventType.end ||
          type === DragSensorEventType.cancel ||
          type === DragSensorEventType.abort,
        srcEvent: e,
        clientX: pointer.clientX,
        clientY: pointer.clientY,
        target: pointer.target,
      } as
        | PointerSensorStartEvent
        | PointerSensorMoveEvent
        | PointerSensorCancelEvent
        | PointerSensorEndEvent;
    }

    this._emitter.emit(type, eventData);
  }

  /**
   * Forcefully abort the drag process.
   */
  abort() {
    if (!this.pointerId || !this._isActive) return;
    this._isActive = false;
    this._emit('abort', null);
    this._reset();
  }

  /**
   * Update the instance's options.
   */
  updateOptions(options: PointerSensorOptions) {
    if (this._isDestroyed) return;

    const { listenerOptions = {}, sourceEvents = 'pointer' } = options;
    const currentListenerOptions = this._listenerOptions;
    const nextListenerOptions = parseListenerOptions(listenerOptions);
    const currentInputEvents = this._sourceEvents;
    const nextInputEvents = sourceEvents;

    // If there is no change -> skip.
    if (
      currentListenerOptions.capture === nextListenerOptions.capture &&
      currentListenerOptions.passive === nextListenerOptions.passive &&
      currentInputEvents === nextInputEvents
    ) {
      return;
    }

    // Unbind start listener.
    this.element.removeEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions
    );

    // Unbind window listeners.
    this._unbindWindowListeners();

    // Abort current drag process.
    this.abort();

    // Update options to instace.
    this._sourceEvents = nextInputEvents;
    this._listenerOptions = nextListenerOptions;

    // Rebind start listener with new options.
    this.element.addEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions
    );
  }

  /**
   * Bind a drag event listener.
   */
  on<T extends keyof PointerSensorEvents>(
    event: T,
    listener: (e: PointerSensorEvents[T]) => void
  ): void {
    this._emitter.on(event, listener);
  }

  /**
   * Unbind a drag event listener.
   */
  off<T extends keyof PointerSensorEvents>(
    event: T,
    listener: (e: PointerSensorEvents[T]) => void
  ): void {
    this._emitter.off(event, listener);
  }

  /**
   * Destroy the instance and unbind all drag event listeners.
   */
  destroy() {
    if (this._isDestroyed) return;

    // Mark as destroyed.
    this._isDestroyed = true;

    // Abort any ongoing drag process.
    this.abort();

    // Emit destroy event.
    this._emit('destroy', null);

    // Destroy emitter.
    this._emitter.destroy();

    // Unbind start event handlers.
    this.element.removeEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions
    );
  }
}
