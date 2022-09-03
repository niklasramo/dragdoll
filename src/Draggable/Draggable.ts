import { HAS_PASSIVE_EVENTS } from '../constants';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents } from '../Sensors/Sensor';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker';

import { getContainingBlock } from '../utils/getContainingBlock';

import { getOffsetDiff } from '../utils/getOffsetDiff';

import { getTranslate } from '../utils/getTranslate';

import { Writeable } from '../types';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const OFFSET_DIFF = { left: 0, top: 0 };

const TRANSLATE_POSITION = { x: 0, y: 0 };

const POSITION_CHANGE = { x: 0, y: 0 };

enum StartPredicateState {
  PENDING = 0,
  RESOLVED = 1,
  REJECTED = 2,
}

class DraggableItem {
  element: HTMLElement | null;
  rootParent: HTMLElement | null;
  rootContainingBlock: HTMLElement | Document | null;
  dragParent: HTMLElement | null;
  dragContainingBlock: HTMLElement | Document | null;
  x: number;
  y: number;
  clientX: number;
  clientY: number;
  syncDiffX: number;
  syncDiffY: number;
  moveDiffX: number;
  moveDiffY: number;
  containerDiffX: number;
  containerDiffY: number;

  constructor() {
    this.element = null;
    this.rootParent = null;
    this.rootContainingBlock = null;
    this.dragParent = null;
    this.dragContainingBlock = null;
    this.x = 0;
    this.y = 0;
    this.clientX = 0;
    this.clientY = 0;
    this.syncDiffX = 0;
    this.syncDiffY = 0;
    this.moveDiffX = 0;
    this.moveDiffY = 0;
    this.containerDiffX = 0;
    this.containerDiffY = 0;
  }
}

class DraggableDrag<S extends Sensor[], E extends S[number]['events'] = S[number]['events']> {
  sensor: S[number] | null;
  isStarted: boolean;
  isEnded: boolean;
  startEvent: E['start'] | E['move'] | null;
  nextMoveEvent: E['move'] | null;
  prevMoveEvent: E['move'] | null;
  endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  items: DraggableItem[];

  constructor() {
    this.sensor = null;
    this.isEnded = false;
    this.isStarted = false;
    this.startEvent = null;
    this.nextMoveEvent = null;
    this.prevMoveEvent = null;
    this.endEvent = null;
    this.items = [];
  }
}

export const DRAGGABLE_DEFAULT_SETTINGS: DraggableSettings<Sensor[]> = {
  container: null,
  startPredicate: () => true,
  getElements: () => null,
  releaseElements: () => {},
  getPosition: (element) => getTranslate(element, TRANSLATE_POSITION),
  getPositionChange: (_element, _startEvent, prevEvent, nextEvent) => {
    POSITION_CHANGE.x = nextEvent.clientX - prevEvent.clientX;
    POSITION_CHANGE.y = nextEvent.clientY - prevEvent.clientY;
    return POSITION_CHANGE;
  },
  renderPosition: (element, x, y) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0px)`;
  },
};

export interface DraggableEventCallbacks<E extends SensorEvents> {
  beforestart(event: E['start'] | E['move']): void;
  start(event: E['start'] | E['move']): void;
  beforemove(event: E['move']): void;
  move(event: E['move']): void;
  beforeend(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  end(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  destroy(): void;
}

export interface DraggableSettings<
  S extends Sensor[],
  E extends S[number]['events'] = S[number]['events']
> {
  container: HTMLElement | null;
  startPredicate: (
    e: E['start'] | E['move'],
    sensor: S[number],
    draggable: Draggable<S>
  ) => boolean | undefined | void;
  getElements: (startEvent: E['start'] | E['move']) => HTMLElement[] | null | void;
  releaseElements: (elements: HTMLElement[]) => void;
  getPosition: (element: HTMLElement) => { x: number; y: number };
  getPositionChange: (
    element: HTMLElement,
    startEvent: E['start'] | E['move'],
    prevEvent: E['start'] | E['move'],
    nextEvent: E['move']
  ) => { x: number; y: number };
  renderPosition: (element: HTMLElement, x: number, y: number) => void;
}

export type DraggableOptions<S extends Sensor[]> = Partial<DraggableSettings<S>>;

export class Draggable<
  S extends Sensor[] = Sensor[],
  E extends S[number]['events'] = S[number]['events']
> {
  readonly sensors: S;
  readonly settings: DraggableSettings<S>;
  protected _sensorData: Map<
    S[number],
    {
      predicateState: StartPredicateState;
      predicateEvent: E['start'] | E['move'] | null;
      onMove: (e: Parameters<Draggable<S>['_onMove']>[0]) => void;
      onEnd: (e: Parameters<Draggable<S>['_onEnd']>[0]) => void;
    }
  >;
  protected _emitter: Emitter<{
    [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K];
  }>;
  protected _drag: DraggableDrag<S> | null;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _syncId: symbol;
  protected _isDestroyed: boolean;

  constructor(sensors: S, options: DraggableOptions<S> = {}) {
    this.sensors = sensors;
    this.settings = this._parseSettings(options);

    this._sensorData = new Map();
    this._emitter = new Emitter();
    this._drag = null;
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
      this._sensorData.set(sensor, {
        predicateState: StartPredicateState.PENDING,
        predicateEvent: null,
        onMove: (e) => this._onMove(e, sensor),
        onEnd: (e) => this._onEnd(e, sensor),
      });
      const { onMove, onEnd } = this._sensorData.get(sensor)!;
      sensor.on('start', onMove);
      sensor.on('move', onMove);
      sensor.on('cancel', onEnd);
      sensor.on('end', onEnd);
      sensor.on('destroy', onEnd);
    });
  }

  protected _parseSettings(
    options?: DraggableOptions<S>,
    defaults: DraggableSettings<S> = DRAGGABLE_DEFAULT_SETTINGS as unknown as DraggableSettings<S>
  ): DraggableSettings<S> {
    const {
      container = defaults.container,
      startPredicate = defaults.startPredicate,
      getElements = defaults.getElements,
      releaseElements = defaults.releaseElements,
      getPosition = defaults.getPosition,
      getPositionChange = defaults.getPositionChange,
      renderPosition = defaults.renderPosition,
    } = options || {};

    return {
      container,
      startPredicate,
      getElements,
      releaseElements,
      getPosition,
      getPositionChange,
      renderPosition,
    };
  }

  protected _emit<K extends keyof DraggableEventCallbacks<E>>(
    type: K,
    ...e: Parameters<DraggableEventCallbacks<E>[K]>
  ) {
    this._emitter.emit(type, ...e);
  }

  protected _onMove(e: E['start'] | E['move'], sensor: S[number]) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    switch (sensorData.predicateState) {
      case StartPredicateState.PENDING: {
        sensorData.predicateEvent = e;

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
      case StartPredicateState.RESOLVED: {
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

  protected _onEnd(e: E['end'] | E['cancel'] | E['destroy'], sensor: S[number]) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    // If there is no active drag yet, let's reset the sensor's start predicate
    // so that it can try starting drag again.
    if (!this._drag) {
      sensorData.predicateState = StartPredicateState.PENDING;
      sensorData.predicateEvent = null;
    }
    // Otherwise, if drag is active AND the sensor is the one that triggered the
    // drag process, let's reset all sensors' start preidcate states.
    else if (sensorData.predicateState === StartPredicateState.RESOLVED) {
      this._drag.endEvent = e;
      this._sensorData.forEach((data) => {
        data.predicateState = StartPredicateState.PENDING;
        data.predicateEvent = null;
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
      const { x, y } = this.settings.getPosition(element);
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
          this.settings.renderPosition(item.element, item.x, item.y);
        }
      }
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

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
      const { x: changeX, y: changeY } = this.settings.getPositionChange(
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
      this.settings.renderPosition(item.element, item.x, item.y);
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
      this.settings.renderPosition(item.element, item.x, item.y);
    }
  }

  isActive() {
    return !!this._drag;
  }

  getDragData() {
    return this._drag as Readonly<DraggableDrag<S>> | null;
  }

  on<K extends keyof DraggableEventCallbacks<E>>(
    eventName: K,
    listener: DraggableEventCallbacks<E>[K],
    listenerId?: EventListenerId
  ): EventListenerId {
    return this._emitter.on(eventName, listener, listenerId);
  }

  off<K extends keyof DraggableEventCallbacks<E>>(
    eventName: K,
    listener: DraggableEventCallbacks<E>[K] | EventListenerId
  ): void {
    this._emitter.off(eventName, listener);
  }

  synchronize(syncImmediately = false) {
    if (!this._drag) return;
    if (syncImmediately) {
      this._prepareSynchronize();
      this._applySynchronize();
    } else {
      ticker.once(tickerReadPhase, this._prepareSynchronize, this._syncId);
      ticker.once(tickerWritePhase, this._applySynchronize, this._syncId);
    }
  }

  resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    const startEvent = e || sensorData.predicateEvent;

    if (sensorData.predicateState === StartPredicateState.PENDING && startEvent) {
      // Resolve the provided sensor's start predicate.
      sensorData.predicateState = StartPredicateState.RESOLVED;
      sensorData.predicateEvent = null;
      this._drag = new DraggableDrag();
      this._drag.sensor = sensor;
      this._drag.startEvent = startEvent;

      // Reject other sensors' start predicates.
      this._sensorData.forEach((data, s) => {
        if (s === sensor) return;
        data.predicateState = StartPredicateState.REJECTED;
        data.predicateEvent = null;
      });

      // Queue drag start.
      ticker.once(tickerReadPhase, this._prepareStart, this._startId);
      ticker.once(tickerWritePhase, this._applyStart, this._startId);
    }
  }

  rejectStartPredicate(sensor: S[number]) {
    const sensorData = this._sensorData.get(sensor);
    if (sensorData?.predicateState === StartPredicateState.PENDING) {
      sensorData.predicateState = StartPredicateState.REJECTED;
      sensorData.predicateEvent = null;
    }
  }

  stop() {
    const drag = this._drag;
    if (!drag || drag.isEnded) return;

    // Mark drag process as ended.
    drag.isEnded = true;

    // Emit beforeend event.
    this._emit('beforeend', drag.endEvent);

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
          this.settings.renderPosition(item.element, item.x, item.y);
        }
      }

      // Call "releaseElements" callback.
      if (elements.length) {
        this.settings.releaseElements(elements);
      }
    }

    // Emit end event.
    this._emit('end', drag.endEvent);

    // Reset drag data.
    this._drag = null;
  }

  updateSettings(options: DraggableOptions<S> = {}) {
    (this as Writeable<this>).settings = this._parseSettings(options, this.settings);
  }

  destroy() {
    if (this._isDestroyed) return;
    this._isDestroyed = true;

    this.stop();

    this._sensorData.forEach(({ onMove, onEnd }, sensor) => {
      sensor.off('start', onMove);
      sensor.off('move', onMove);
      sensor.off('cancel', onEnd);
      sensor.off('end', onEnd);
      sensor.off('destroy', onEnd);
    });

    this._sensorData.clear();

    this._emit('destroy');

    this._emitter.off();
  }
}
