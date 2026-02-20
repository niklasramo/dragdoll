import type { Events } from 'eventti';
import { Emitter } from 'eventti';
import type { ListenerOptions, PointerType, Writeable } from '../types.js';
import { getPointerEventData } from '../utils/get-pointer-event-data.js';
import { getPointerId } from '../utils/get-pointer-id.js';
import { getPointerType } from '../utils/get-pointer-type.js';
import { parseListenerOptions } from '../utils/parse-listener-options.js';
import { parseSourceEvents } from '../utils/parse-source-events.js';
import type {
  BaseSensorCancelEvent,
  BaseSensorDestroyEvent,
  BaseSensorEndEvent,
  BaseSensorMoveEvent,
  BaseSensorStartEvent,
} from './base-sensor.js';
import type { Sensor, SensorEventListenerId } from './sensor.js';
import { SensorEventType } from './sensor.js';

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

export const PointerSensorDefaultSettings: PointerSensorSettings = {
  listenerOptions: {},
  sourceEvents: 'auto',
  startPredicate: (e) => ('button' in e && e.button > 0 ? false : true),
  cancelOnVisibilityChange: true,
  cancelOnEscape: true,
  preventNativeDrag: true,
  preventContextMenu: false,
} as const;

export type PointerSensorDragData = {
  readonly pointerId: number;
  readonly pointerType: PointerType;
  readonly startX: number;
  readonly startY: number;
  readonly x: number;
  readonly y: number;
  readonly deltaX: number;
  readonly deltaY: number;
};

export interface PointerSensorSettings {
  listenerOptions: ListenerOptions;
  sourceEvents: keyof typeof SOURCE_EVENTS | 'auto';
  startPredicate: (e: PointerSensorSourceEvent) => boolean;
  cancelOnVisibilityChange?: boolean;
  cancelOnEscape?: boolean;
  preventNativeDrag?: boolean;
  preventContextMenu?: boolean;
}

export interface PointerSensorStartEvent extends BaseSensorStartEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorMoveEvent extends BaseSensorMoveEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent;
  target: EventTarget | null;
}

export interface PointerSensorCancelEvent extends BaseSensorCancelEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent | null;
  target: EventTarget | null;
}

export interface PointerSensorEndEvent extends BaseSensorEndEvent {
  pointerId: number;
  pointerType: PointerType;
  srcEvent: PointerSensorSourceEvent | null;
  target: EventTarget | null;
}

export interface PointerSensorDestroyEvent extends BaseSensorDestroyEvent {}

export interface PointerSensorEvents {
  start: PointerSensorStartEvent;
  move: PointerSensorMoveEvent;
  cancel: PointerSensorCancelEvent;
  end: PointerSensorEndEvent;
  destroy: PointerSensorDestroyEvent;
}

export class PointerSensor<
  E extends PointerSensorEvents = PointerSensorEvents,
> implements Sensor<E> {
  declare _events_type: E;

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

  /**
   * Internal event payload for pooled emitting.
   */
  protected _eventData: any | null = null;

  /**
   * Cleanup function for the click blocker, null if not active.
   */
  protected _removeClickBlocker: (() => void) | null = null;

  protected _cancelOnVisibilityChange: boolean;

  protected _cancelOnEscape: boolean;

  protected _preventNativeDrag: boolean;

  protected _preventContextMenu: boolean;

  protected _preventNativeDragHandler = (e: Event) => e.preventDefault();

  protected _preventContextMenuHandler = (e: Event) => e.preventDefault();

  protected _visibilityChangeHandler = () => {
    this.cancel();
  };

  protected _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.drag) {
      e.preventDefault();
      this.cancel();
    }
  };

  constructor(element: Element | Window, options: Partial<PointerSensorSettings> = {}) {
    const {
      listenerOptions = PointerSensorDefaultSettings.listenerOptions,
      sourceEvents = PointerSensorDefaultSettings.sourceEvents,
      startPredicate = PointerSensorDefaultSettings.startPredicate,
      cancelOnVisibilityChange = PointerSensorDefaultSettings.cancelOnVisibilityChange,
      cancelOnEscape = PointerSensorDefaultSettings.cancelOnEscape,
      preventNativeDrag = PointerSensorDefaultSettings.preventNativeDrag,
      preventContextMenu = PointerSensorDefaultSettings.preventContextMenu,
    } = options;

    this.element = element;
    this.drag = null;
    this.isDestroyed = false;

    this._areWindowListenersBound = false;
    this._cancelOnVisibilityChange = cancelOnVisibilityChange ?? true;
    this._cancelOnEscape = cancelOnEscape ?? true;
    this._preventNativeDrag = preventNativeDrag ?? true;
    this._preventContextMenu = preventContextMenu ?? false;
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

    if (cancelOnVisibilityChange) {
      document.addEventListener('visibilitychange', this._visibilityChangeHandler);
    }
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
    // Clear any existing click blocker from a previous interaction.
    this._removeClickBlocker?.();

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
      startX: pointerEventData.clientX,
      startY: pointerEventData.clientY,
      x: pointerEventData.clientX,
      y: pointerEventData.clientY,
      deltaX: 0,
      deltaY: 0,
    };

    // Set drag data.
    (this as Writeable<this>).drag = dragData;

    // Create a separate event payload object to avoid polluting drag data with extra properties.
    this._eventData = {
      ...dragData,
      type: SensorEventType.Start,
      srcEvent: e,
      target: pointerEventData.target,
    };

    // Emit start event.
    this._emitter.emit(this._eventData.type, this._eventData);

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
    const drag = this.drag;
    const eventData = this._eventData;
    if (!drag || !eventData) return;

    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;

    const clientX = pointerEventData.clientX;
    const clientY = pointerEventData.clientY;

    (drag.deltaX as Writeable<number>) = clientX - drag.x;
    (drag.deltaY as Writeable<number>) = clientY - drag.y;
    (drag.x as Writeable<number>) = clientX;
    (drag.y as Writeable<number>) = clientY;

    eventData.type = SensorEventType.Move;
    eventData.srcEvent = e;
    eventData.target = pointerEventData.target;
    eventData.x = clientX;
    eventData.y = clientY;
    eventData.deltaX = drag.deltaX;
    eventData.deltaY = drag.deltaY;

    this._emitter.emit(eventData.type, eventData);
  }

  /**
   * Listener for cancel event.
   */
  protected _onCancel(e: PointerEvent | TouchEvent) {
    const drag = this.drag;
    const eventData = this._eventData;
    if (!drag || !eventData) return;

    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;

    const clientX = pointerEventData.clientX;
    const clientY = pointerEventData.clientY;

    (drag.deltaX as Writeable<number>) = clientX - drag.x;
    (drag.deltaY as Writeable<number>) = clientY - drag.y;
    (drag.x as Writeable<number>) = clientX;
    (drag.y as Writeable<number>) = clientY;

    eventData.type = SensorEventType.Cancel;
    eventData.srcEvent = e;
    eventData.target = pointerEventData.target;
    eventData.x = clientX;
    eventData.y = clientY;
    eventData.deltaX = drag.deltaX;
    eventData.deltaY = drag.deltaY;

    this._emitter.emit(eventData.type, eventData);

    this._resetDrag();
  }

  /**
   * Listener for end event.
   */
  protected _onEnd(e: PointerSensorSourceEvent) {
    const drag = this.drag;
    const eventData = this._eventData;
    if (!drag || !eventData) return;

    const pointerEventData = this._getTrackedPointerEventData(e);
    if (!pointerEventData) return;

    const clientX = pointerEventData.clientX;
    const clientY = pointerEventData.clientY;

    (drag.deltaX as Writeable<number>) = clientX - drag.x;
    (drag.deltaY as Writeable<number>) = clientY - drag.y;
    (drag.x as Writeable<number>) = clientX;
    (drag.y as Writeable<number>) = clientY;

    eventData.type = SensorEventType.End;
    eventData.srcEvent = e;
    eventData.target = pointerEventData.target;
    eventData.x = clientX;
    eventData.y = clientY;
    eventData.deltaX = drag.deltaX;
    eventData.deltaY = drag.deltaY;

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
    if (this._cancelOnEscape) {
      document.addEventListener('keydown', this._onKeyDown);
    }
    if (this._preventNativeDrag) {
      window.addEventListener('dragstart', this._preventNativeDragHandler);
    }
    if (this._preventContextMenu) {
      window.addEventListener('contextmenu', this._preventContextMenuHandler);
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
      if (this._cancelOnEscape) {
        document.removeEventListener('keydown', this._onKeyDown);
      }
      if (this._preventNativeDrag) {
        window.removeEventListener('dragstart', this._preventNativeDragHandler);
      }
      if (this._preventContextMenu) {
        window.removeEventListener('contextmenu', this._preventContextMenuHandler);
      }
      this._areWindowListenersBound = false;
    }
  }

  /**
   * Reset drag data.
   */
  protected _resetDrag() {
    (this as Writeable<this>).drag = null;
    this._eventData = null;
    this._unbindWindowListeners();
  }

  /**
   * Forcefully cancel the drag process.
   */
  cancel() {
    if (!this.drag) return;

    this._eventData.type = SensorEventType.Cancel;
    this._eventData.srcEvent = null;
    this._eventData.target = null;
    this._eventData.x = this.drag.x;
    this._eventData.y = this.drag.y;
    this._eventData.deltaX = this.drag.deltaX;
    this._eventData.deltaY = this.drag.deltaY;

    this._emitter.emit(this._eventData.type, this._eventData);

    this._resetDrag();
  }

  /**
   * Update the element to be tracked.
   */
  updateElement(element: Element | Window) {
    if (this.isDestroyed || this.element === element) return;

    // Unbind start event listeners for the old element.
    this.element.removeEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions,
    );

    // Bind start event listeners for the new element.
    element.addEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions,
    );

    // Update the element.
    (this as Writeable<this>).element = element;
  }

  /**
   * Update the instance's settings.
   */
  updateSettings(options: Partial<PointerSensorSettings>) {
    if (this.isDestroyed) return;

    const {
      listenerOptions,
      sourceEvents,
      startPredicate,
      cancelOnVisibilityChange,
      cancelOnEscape,
      preventNativeDrag,
      preventContextMenu,
    } = options;
    const nextSourceEvents = parseSourceEvents(sourceEvents);
    const nextListenerOptions = parseListenerOptions(listenerOptions);

    // Update start predicate if needed.
    if (startPredicate && this._startPredicate !== startPredicate) {
      this._startPredicate = startPredicate;
    }

    if (
      cancelOnVisibilityChange !== undefined &&
      this._cancelOnVisibilityChange !== cancelOnVisibilityChange
    ) {
      this._cancelOnVisibilityChange = cancelOnVisibilityChange;
      if (cancelOnVisibilityChange) {
        document.addEventListener('visibilitychange', this._visibilityChangeHandler);
      } else {
        document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
      }
    }

    if (cancelOnEscape !== undefined && this._cancelOnEscape !== cancelOnEscape) {
      this._cancelOnEscape = cancelOnEscape;
      if (this._areWindowListenersBound) {
        if (cancelOnEscape) {
          document.addEventListener('keydown', this._onKeyDown);
        } else {
          document.removeEventListener('keydown', this._onKeyDown);
        }
      }
    }

    if (preventNativeDrag !== undefined && this._preventNativeDrag !== preventNativeDrag) {
      this._preventNativeDrag = preventNativeDrag;
      if (this._areWindowListenersBound) {
        if (preventNativeDrag) {
          window.addEventListener('dragstart', this._preventNativeDragHandler);
        } else {
          window.removeEventListener('dragstart', this._preventNativeDragHandler);
        }
      }
    }

    if (preventContextMenu !== undefined && this._preventContextMenu !== preventContextMenu) {
      this._preventContextMenu = preventContextMenu;
      if (this._areWindowListenersBound) {
        if (preventContextMenu) {
          window.addEventListener('contextmenu', this._preventContextMenuHandler);
        } else {
          window.removeEventListener('contextmenu', this._preventContextMenuHandler);
        }
      }
    }

    // Update listener options and/or source events if needed.
    if (
      (listenerOptions &&
        (this._listenerOptions.capture !== nextListenerOptions.capture ||
          this._listenerOptions.passive !== nextListenerOptions.passive)) ||
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
  on<T extends keyof E>(
    type: T,
    listener: (e: E[T]) => void,
    listenerId?: SensorEventListenerId,
  ): SensorEventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  /**
   * Unbind a drag event listener.
   */
  off<T extends keyof E>(type: T, listenerId: SensorEventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  /**
   * Prevent the next click event from propagating and performing default action.
   * This is useful for blocking clicks after a drag ends to avoid triggering
   * click handlers on draggable elements (e.g., links, buttons).
   *
   * The blocker automatically removes itself after blocking a click or when
   * a new pointer interaction starts on this sensor.
   */
  preventClickOnEnd(): void {
    // Clean up any existing blocker first.
    this._removeClickBlocker?.();

    const blockClick = (e: Event) => {
      // Only block native browser-generated clicks, not programmatic ones.
      // This allows testing frameworks and accessibility tools to work.
      if (e.isTrusted) {
        e.preventDefault();
        e.stopPropagation();
        this._removeClickBlocker?.();
      }
    };

    this.element.addEventListener('click', blockClick, { capture: true });

    this._removeClickBlocker = () => {
      this.element.removeEventListener('click', blockClick, true);
      this._removeClickBlocker = null;
    };
  }

  /**
   * Destroy the instance and unbind all drag event listeners.
   */
  destroy() {
    if (this.isDestroyed) return;

    // Mark as destroyed.
    (this as Writeable<this>).isDestroyed = true;

    // Clean up click blocker if present.
    this._removeClickBlocker?.();

    // Cancel any ongoing drag process.
    this.cancel();

    // Emit destroy event.
    this._emitter.emit(SensorEventType.Destroy, {
      type: SensorEventType.Destroy,
    });

    // Destroy emitter.
    this._emitter.off();

    // Unbind start event listeners.
    this.element.removeEventListener(
      SOURCE_EVENTS[this._sourceEvents].start,
      this._onStart as EventListener,
      this._listenerOptions,
    );

    if (this._cancelOnVisibilityChange) {
      document.removeEventListener('visibilitychange', this._visibilityChangeHandler);
    }
  }
}
