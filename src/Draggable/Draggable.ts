import { HAS_PASSIVE_EVENTS } from '../constants';

import { Emitter, EventListenerId } from 'eventti';

import { DraggableDrag } from './DraggableDrag';

import { DraggableItem } from './DraggableItem';

import { DraggableAutoScrollProxy } from './DraggableAutoScrollProxy';

import { Sensor, SensorEvents } from '../Sensors/Sensor';

import {
  AutoScroll,
  AutoScrollItemSpeedCallback,
  AutoScrollItemEventCallback,
  AutoScrollItemTarget,
  autoScrollSmoothSpeed,
} from '../AutoScroll/AutoScroll';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker';

import { getContainingBlock } from '../utils/getContainingBlock';

import { getOffsetDiff } from '../utils/getOffsetDiff';

import { getTranslate } from '../utils/getTranslate';

import { Writeable } from '../types';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const OFFSET_DIFF = { left: 0, top: 0 };

const TRANSLATE_POSITION = { x: 0, y: 0 };

const POSITION_CHANGE = { x: 0, y: 0 };

const AUTOSCROLL_POSITION = { x: 0, y: 0 };

const AUTOSCROLL_CLIENT_RECT = { left: 0, top: 0, width: 0, height: 0 };

const DEFAULT_SETTINGS: DraggableSettings<any> = {
  container: null,
  startPredicate: () => true,
  getElements: () => null,
  destroyElements: () => {},
  getElementPosition: (element) => getTranslate(element, TRANSLATE_POSITION),
  getElementPositionChange: (_element, _startEvent, prevEvent, nextEvent) => {
    POSITION_CHANGE.x = nextEvent.clientX - prevEvent.clientX;
    POSITION_CHANGE.y = nextEvent.clientY - prevEvent.clientY;
    return POSITION_CHANGE;
  },
  renderElementPosition: (element, x, y) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  },
  autoScroll: {
    instance: null,
    targets: [],
    staticAreaSize: 0.2,
    speed: autoScrollSmoothSpeed(1000, 2000, 2500),
    smoothStop: false,
    getPosition: autoScrollGetPosition,
    getClientRect: autoScrollGetClientRect,
    onStart: null,
    onStop: null,
  },
};

enum StartPredicateState {
  Pending = 0,
  Resolved = 1,
  Rejected = 2,
}

interface DraggableEventCallbacks<E extends SensorEvents> {
  beforestart(event: E['start'] | E['move']): void;
  start(event: E['start'] | E['move']): void;
  beforemove(event: E['move']): void;
  move(event: E['move']): void;
  beforeend(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  end(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
}

interface AutoScrollSettings<S extends Sensor[]> {
  instance: AutoScroll | null;
  targets: AutoScrollItemTarget[] | ((draggable: Draggable<S>) => AutoScrollItemTarget[]);
  staticAreaSize: number;
  speed: number | AutoScrollItemSpeedCallback;
  smoothStop: boolean;
  getPosition: ((draggable: Draggable<S>) => { x: number; y: number }) | null;
  getClientRect:
    | ((draggable: Draggable<S>) => { left: number; top: number; width: number; height: number })
    | null;
  onStart: AutoScrollItemEventCallback | null;
  onStop: AutoScrollItemEventCallback | null;
}

interface DraggableSettings<
  S extends Sensor[],
  T extends S[number]['events'] = S[number]['events']
> {
  container: HTMLElement | null;
  startPredicate: (
    e: T['start'] | T['move'],
    sensor: S[number],
    draggable: Draggable<S>
  ) => boolean | undefined | void;
  getElements: (startEvent: T['start'] | T['move']) => HTMLElement[] | null | void;
  getElementPosition: (element: HTMLElement) => { x: number; y: number };
  getElementPositionChange: (
    element: HTMLElement,
    startEvent: T['start'] | T['move'],
    prevEvent: T['start'] | T['move'],
    nextEvent: T['move']
  ) => { x: number; y: number };
  renderElementPosition: (element: HTMLElement, x: number, y: number) => void;
  destroyElements: (elements: HTMLElement[]) => void;
  autoScroll: AutoScrollSettings<S>;
}

interface DraggableOptions<S extends Sensor[]> {
  container?: DraggableSettings<S>['container'];
  startPredicate?: DraggableSettings<S>['startPredicate'];
  getElements?: DraggableSettings<S>['getElements'];
  getElementPosition?: DraggableSettings<S>['getElementPosition'];
  getElementPositionChange?: DraggableSettings<S>['getElementPositionChange'];
  renderElementPosition?: DraggableSettings<S>['renderElementPosition'];
  destroyElements?: DraggableSettings<S>['destroyElements'];
  autoScroll?: Partial<AutoScrollSettings<S>> | null;
}

function autoScrollGetPosition<S extends Sensor[]>(draggable: Draggable<S>) {
  const drag = draggable.getDragData();
  const primaryItem = drag?.items[0];

  // Try to use the first item for the autoscroll data.
  if (primaryItem) {
    AUTOSCROLL_POSITION.x = primaryItem.x;
    AUTOSCROLL_POSITION.y = primaryItem.y;
  }
  // Fallback to the sensor's clientX/clientY values.
  else {
    const e = drag && (drag.nextMoveEvent || drag.startEvent);
    AUTOSCROLL_POSITION.x = e ? e.clientX : 0;
    AUTOSCROLL_POSITION.y = e ? e.clientY : 0;
  }

  return AUTOSCROLL_POSITION;
}

function autoScrollGetClientRect<S extends Sensor[]>(draggable: Draggable<S>) {
  const drag = draggable.getDragData();
  const primaryItem = drag?.items[0];

  // Try to use the first item for the autoscroll data.
  if (primaryItem && primaryItem.element) {
    const { left, top, width, height } = primaryItem.element.getBoundingClientRect();
    AUTOSCROLL_CLIENT_RECT.left = left;
    AUTOSCROLL_CLIENT_RECT.top = top;
    AUTOSCROLL_CLIENT_RECT.width = width;
    AUTOSCROLL_CLIENT_RECT.height = height;
  }
  // Fallback to the sensor's clientX/clientY values and a static size of
  // 50px x 50px.
  else {
    const e = drag && (drag.nextMoveEvent || drag.startEvent);
    AUTOSCROLL_CLIENT_RECT.left = e ? e.clientX - 25 : 0;
    AUTOSCROLL_CLIENT_RECT.top = e ? e.clientY - 25 : 0;
    AUTOSCROLL_CLIENT_RECT.width = e ? 50 : 0;
    AUTOSCROLL_CLIENT_RECT.height = e ? 50 : 0;
  }

  return AUTOSCROLL_CLIENT_RECT;
}

function parseAutoScrollSettings<S extends Sensor[]>(
  autoScrollOptions: Partial<AutoScrollSettings<S>> | null
) {
  const {
    instance = null,
    targets = [],
    staticAreaSize = 0.2,
    speed = autoScrollSmoothSpeed(),
    smoothStop = false,
    getPosition = autoScrollGetPosition,
    getClientRect = autoScrollGetClientRect,
    onStart = null,
    onStop = null,
  } = (autoScrollOptions || {}) as Partial<AutoScrollSettings<S>>;

  return {
    instance,
    targets,
    staticAreaSize,
    speed,
    smoothStop,
    getPosition,
    getClientRect,
    onStart,
    onStop,
  };
}

function parseSettings<S extends Sensor[]>(
  options: DraggableOptions<S>,
  defaults: DraggableSettings<S> = DEFAULT_SETTINGS
) {
  const {
    container = defaults.container,
    startPredicate = defaults.startPredicate,
    getElements = defaults.getElements,
    getElementPosition = defaults.getElementPosition,
    getElementPositionChange = defaults.getElementPositionChange,
    renderElementPosition = defaults.renderElementPosition,
    destroyElements = defaults.destroyElements,
    autoScroll = defaults.autoScroll,
  } = options;

  return {
    container,
    startPredicate,
    getElements,
    getElementPosition,
    getElementPositionChange,
    renderElementPosition,
    destroyElements,
    autoScroll: parseAutoScrollSettings<S>(autoScroll),
  };
}

export class Draggable<S extends Sensor[], E extends S[number]['events'] = S[number]['events']> {
  readonly sensors: S;
  readonly settings: DraggableSettings<S>;
  protected _sensorListeners: Map<
    S[number],
    {
      onMove: (e: Parameters<Draggable<S>['_onMove']>[1]) => void;
      onEnd: (e: Parameters<Draggable<S>['_onEnd']>[1]) => void;
    }
  >;
  protected _sensorStartPredicates: Map<
    S[number],
    {
      state: StartPredicateState;
      event: E['start'] | E['move'] | null;
    }
  >;
  protected _emitter: Emitter<{
    [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K];
  }>;
  protected _drag: DraggableDrag<S> | null;
  protected _autoScrollProxy: DraggableAutoScrollProxy<S> | null;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _syncId: symbol;
  protected _isDestroyed: boolean;

  constructor(sensors: S, options: DraggableOptions<S> = {}) {
    this.sensors = sensors;
    this.settings = parseSettings<S>(options);

    this._sensorListeners = new Map();
    this._sensorStartPredicates = new Map();
    this._emitter = new Emitter();
    this._drag = null;
    this._autoScrollProxy = null;
    this._startId = Symbol();
    this._moveId = Symbol();
    this._syncId = Symbol();
    this._isDestroyed = false;

    // Bind methods (that need binding).
    this._onMove = this._onMove.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._prepareStart = this._prepareStart.bind(this);
    this._applyStart = this._applyStart.bind(this);
    this._prepareMove = this._prepareMove.bind(this);
    this._applyMove = this._applyMove.bind(this);
    this._prepareSynchronize = this._prepareSynchronize.bind(this);
    this._applySynchronize = this._applySynchronize.bind(this);

    // Bind drag sensor events.
    this.sensors.forEach((sensor) => {
      this._sensorStartPredicates.set(sensor, {
        state: StartPredicateState.Pending,
        event: null,
      });
      this._sensorListeners.set(sensor, {
        onMove: (e) => this._onMove(sensor, e),
        onEnd: (e) => this._onEnd(sensor, e),
      });
      const { onMove, onEnd } = this._sensorListeners.get(sensor)!;
      sensor.on('start', onMove);
      sensor.on('move', onMove);
      sensor.on('cancel', onEnd);
      sensor.on('end', onEnd);
      sensor.on('destroy', onEnd);
    });
  }

  protected _emit<K extends keyof DraggableEventCallbacks<E>>(
    type: K,
    ...e: Parameters<DraggableEventCallbacks<E>[K]>
  ) {
    this._emitter.emit(type, ...e);
  }

  protected _onMove(sensor: S[number], e: E['start'] | E['move']) {
    const startPredicate = this._sensorStartPredicates.get(sensor);
    if (!startPredicate) return;

    switch (startPredicate.state) {
      case StartPredicateState.Pending: {
        startPredicate.event = e;

        // Check if drag should start.
        const shouldStart = this.settings.startPredicate(e, sensor, this);

        // Resolve procedure (start move process).
        if (shouldStart === true) {
          this.resolveStartPredicate(sensor);
        }
        // Reject procedure.
        else if (shouldStart === false) {
          this.rejectStartPredicate(sensor);
        }
        break;
      }
      case StartPredicateState.Resolved: {
        // Move the element if dragging is active.
        if (this._drag) {
          this._drag.nextMoveEvent = e as E['move'];
          ticker.once(tickerReadPhase, this._prepareMove, this._moveId);
          ticker.once(tickerWritePhase, this._applyMove, this._moveId);
        }
        break;
      }
    }
  }

  protected _onScroll() {
    this.synchronize();
  }

  protected _onEnd(sensor: S[number], e: E['end'] | E['cancel'] | E['destroy']) {
    const startPredicate = this._sensorStartPredicates.get(sensor);
    if (!startPredicate) return;

    // If there is no active drag yet, let's reset the sensor's start predicate
    // so that it can try starting drag again.
    if (!this._drag) {
      startPredicate.state = StartPredicateState.Pending;
      startPredicate.event = null;
    }
    // Otherwise, if drag is active AND the sensor is the one that triggered the
    // drag process, let's reset all sensors' start preidcate states.
    else if (startPredicate.state === StartPredicateState.Resolved) {
      this._drag.endEvent = e;
      this._sensorStartPredicates.forEach((p) => {
        p.state = StartPredicateState.Pending;
        p.event = null;
      });
      this.stop();
    }
  }

  protected _prepareStart() {
    const drag = this._drag;
    if (!drag || !drag.startEvent) return;

    // Get elements that we'll need to move with the drag.
    // NB: It is okay if there are no elements and thus no items. The drag
    // process will process as usual, but nothing is moving by default.
    const elements = this.settings.getElements(drag.startEvent) || [];

    // Create drag items.
    drag.items = elements.map((element) => {
      const item = new DraggableItem();

      // Store item element.
      item.element = element;

      // Make sure element is in the DOM.
      if (!element.isConnected) {
        if (this.settings.container) {
          this.settings.container.appendChild(element);
        } else {
          document.body.appendChild(element);
        }
      }

      // Get element's parent.
      const rootParent = element.parentNode as HTMLElement;
      item.rootParent = rootParent;

      // Get parent's containing block.
      const rootContainingBlock = getContainingBlock(rootParent);
      item.rootContainingBlock = rootContainingBlock;

      // Get element's drag parent.
      const dragParent = this.settings.container || rootParent;
      item.dragParent = dragParent;

      // Get drag container's containing block.
      const dragContainingBlock =
        dragParent === rootParent ? rootContainingBlock : getContainingBlock(dragParent);
      item.dragContainingBlock = dragContainingBlock;

      // Compute element's current elementX/Y.
      const { x, y } = this.settings.getElementPosition(element);
      item.x = x;
      item.y = y;

      // Compute the element's current clientX/Y.
      const clientRect = element.getBoundingClientRect();
      item.clientX = clientRect.left;
      item.clientY = clientRect.top;

      // If parent's containing block is different than drag container's
      // containing block let's compute the offset difference between the
      // containing blocks.
      if (rootContainingBlock !== dragContainingBlock) {
        const { left, top } = getOffsetDiff(dragContainingBlock, rootContainingBlock, OFFSET_DIFF);
        item.containerDiffX = left;
        item.containerDiffY = top;
      }

      return item;
    });
  }

  protected _applyStart() {
    let drag = this._drag;
    if (!drag || !drag.startEvent) return;

    // Emit beforestart event.
    this._emit('beforestart', drag.startEvent);

    // Make sure drag is still active after beforestart event is dispatched.
    drag = this._drag;
    if (!drag || !drag.startEvent) return;

    // Append element within the container element if such is provided.
    const { container } = this.settings;
    if (container) {
      for (const item of drag.items) {
        if (item.element && item.element.parentNode !== container) {
          container.appendChild(item.element);
          item.x += item.containerDiffX;
          item.y += item.containerDiffY;
          this.settings.renderElementPosition(item.element, item.x, item.y);
        }
      }
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Register drag mover instance to auto-scroller.
    if (!this._autoScrollProxy) {
      this._autoScrollProxy = new DraggableAutoScrollProxy(this);
      this.settings.autoScroll.instance?.addItem(this._autoScrollProxy);
    }

    // Mark drag as started.
    drag.isStarted = true;

    // Emit start event.
    this._emit('start', drag.startEvent);
  }

  protected _prepareMove() {
    const drag = this._drag;
    if (!drag || !drag.startEvent) return;

    // Get next event and previous event so we can compute the movement
    // difference between the clientX/Y values.
    const nextEvent = drag.nextMoveEvent;
    const prevEvent = drag.prevMoveEvent || drag.startEvent;
    if (!nextEvent || nextEvent === prevEvent) return;

    for (const item of drag.items) {
      if (!item.element) continue;

      // Compute how much x and y needs to be transformed.
      const { x: changeX, y: changeY } = this.settings.getElementPositionChange(
        item.element,
        drag.startEvent,
        prevEvent,
        nextEvent
      );

      // Update horizontal position data.
      if (changeX) {
        item.x = item.x - item.moveDiffX + changeX;
        item.clientX = item.clientX - item.moveDiffX + changeX;
        item.moveDiffX = changeX;
      }

      // Update vertical position data.
      if (changeY) {
        item.y = item.y - item.moveDiffY + changeY;
        item.clientY = item.clientY - item.moveDiffY + changeY;
        item.moveDiffY = changeY;
      }
    }

    // Store next event as previous event.
    drag.prevMoveEvent = nextEvent;
  }

  protected _applyMove() {
    let drag = this._drag;
    if (!drag || !drag.nextMoveEvent) return;

    // Reset movement diff.
    for (const item of drag.items) {
      item.moveDiffX = 0;
      item.moveDiffY = 0;
    }

    // Emit beforemove event.
    this._emit('beforemove', drag.nextMoveEvent);

    // Make sure drag is still active after beforemove event is dispatched.
    drag = this._drag;
    if (!drag || !drag.nextMoveEvent) return;

    // Move the element.
    for (const item of drag.items) {
      if (!item.element) continue;
      this.settings.renderElementPosition(item.element, item.x, item.y);
    }

    // Emit move event.
    this._emit('move', drag.nextMoveEvent);
  }

  protected _prepareSynchronize() {
    const drag = this._drag;
    if (!drag) return;

    for (const item of drag.items) {
      if (!item.element) continue;

      // Update container diff.
      if (item.rootContainingBlock !== item.dragContainingBlock) {
        const { left, top } = getOffsetDiff(
          item.dragContainingBlock as HTMLElement | Document,
          item.rootContainingBlock as HTMLElement | Document,
          OFFSET_DIFF
        );
        item.containerDiffX = left;
        item.containerDiffY = top;
      }

      const { left, top } = item.element.getBoundingClientRect();

      // Update horizontal position data.
      const syncDiffX = item.clientX - item.moveDiffX - left;
      item.x = item.x - item.syncDiffX + syncDiffX;
      item.syncDiffX = syncDiffX;

      // Update vertical position data.
      const syncDiffY = item.clientY - item.moveDiffY - top;
      item.y = item.y - item.syncDiffY + syncDiffY;
      item.syncDiffY = syncDiffY;
    }
  }

  protected _applySynchronize() {
    const drag = this._drag;
    if (!drag) return;

    for (const item of drag.items) {
      if (!item.element) continue;
      item.syncDiffX = 0;
      item.syncDiffY = 0;
      this.settings.renderElementPosition(item.element, item.x, item.y);
    }
  }

  isActive() {
    return !!this._drag;
  }

  getDragData() {
    return this._drag as Readonly<DraggableDrag<S>> | null;
  }

  on<K extends keyof DraggableEventCallbacks<E>>(
    eventType: K,
    listener: DraggableEventCallbacks<E>[K]
  ): EventListenerId {
    return this._emitter.on(eventType, listener);
  }

  off<K extends keyof DraggableEventCallbacks<E>>(
    eventType: K,
    listener: DraggableEventCallbacks<E>[K] | EventListenerId
  ): void {
    this._emitter.off(eventType, listener);
  }

  synchronize() {
    if (!this._drag) return;
    ticker.once(tickerReadPhase, this._prepareSynchronize, this._syncId);
    ticker.once(tickerWritePhase, this._applySynchronize, this._syncId);
  }

  resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']) {
    const startPredicate = this._sensorStartPredicates.get(sensor);
    if (!startPredicate) return;

    const startEvent = e || startPredicate.event;

    if (startPredicate.state === StartPredicateState.Pending && startEvent) {
      // Resolve the provided sensor's start predicate.
      startPredicate.state = StartPredicateState.Resolved;
      this._drag = new DraggableDrag();
      this._drag.sensor = sensor;
      this._drag.startEvent = startEvent;
      startPredicate.event = null;

      // Reject other sensors' start predicates.
      this._sensorStartPredicates.forEach((p, s) => {
        if (s === sensor) return;
        p.state = StartPredicateState.Rejected;
        p.event = null;
      });

      // Queue drag start.
      ticker.once(tickerReadPhase, this._prepareStart, this._startId);
      ticker.once(tickerWritePhase, this._applyStart, this._startId);
    }
  }

  rejectStartPredicate(sensor: S[number]) {
    const startPredicate = this._sensorStartPredicates.get(sensor);
    if (startPredicate?.state === StartPredicateState.Pending) {
      startPredicate.state = StartPredicateState.Rejected;
      startPredicate.event = null;
    }
  }

  stop() {
    const drag = this._drag;
    if (!drag || drag.isEnded) return;

    // Mark drag process as ended.
    drag.isEnded = true;

    // Emit beforeend event.
    this._emit('beforeend', drag.endEvent);

    // Destroy auto scroll proxy.
    if (this._autoScrollProxy) {
      this.settings.autoScroll.instance?.removeItem(this._autoScrollProxy);
      this._autoScrollProxy = null;
    }

    // Cancel all queued ticks.
    ticker.off(tickerReadPhase, this._startId);
    ticker.off(tickerWritePhase, this._startId);
    ticker.off(tickerReadPhase, this._moveId);
    ticker.off(tickerWritePhase, this._moveId);
    ticker.off(tickerReadPhase, this._syncId);
    ticker.off(tickerWritePhase, this._syncId);

    // If drag process is started.
    if (drag.isStarted) {
      // Unbind scroll listener.
      window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

      // Move elements within the root container and collect all elements
      // to an elements array.
      const elements: HTMLElement[] = [];
      for (const item of drag.items) {
        if (!item.element) continue;
        elements.push(item.element);
        if (item.rootParent && item.element.parentNode !== item.rootParent) {
          item.x -= item.containerDiffX;
          item.y -= item.containerDiffY;
          item.containerDiffX = 0;
          item.containerDiffY = 0;
          item.rootParent.appendChild(item.element);
          this.settings.renderElementPosition(item.element, item.x, item.y);
        }
      }

      // Call "destroyElements" callback.
      if (elements.length) {
        this.settings.destroyElements(elements);
      }
    }

    // Emit end event.
    this._emit('end', drag.endEvent);

    // Reset drag data.
    this._drag = null;
  }

  updateSettings(options: DraggableOptions<S> = {}) {
    // TODO: Should we add some special handling for autoscroll instance?
    (this as Writeable<this>).settings = parseSettings<S>(options, this.settings);
  }

  destroy() {
    if (this._isDestroyed) return;
    this._isDestroyed = true;

    this.stop();

    this._sensorListeners.forEach(({ onMove, onEnd }, sensor) => {
      sensor.off('start', onMove);
      sensor.off('move', onMove);
      sensor.off('cancel', onEnd);
      sensor.off('end', onEnd);
      sensor.off('destroy', onEnd);
    });

    this._sensorListeners.clear();
    this._sensorStartPredicates.clear();
    this._emitter.off();
  }
}
