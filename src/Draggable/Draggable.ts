import { HAS_PASSIVE_EVENTS } from '../constants';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents } from '../Sensors/Sensor';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker';

import { getContainingBlock } from '../utils/getContainingBlock';

import { getOffsetDiff } from '../utils/getOffsetDiff';

import { getStyle } from 'utils/getStyle';

import { Writeable } from '../types';

const IDENTITY_MATRIX = 'matrix(1, 0, 0, 1, 0, 0)';

const IDENTITY_MATRIX_3D = 'matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const OFFSET_DIFF = { left: 0, top: 0 };

const POSITION_CHANGE = { x: 0, y: 0 };

enum DraggableStartPredicateState {
  PENDING = 0,
  RESOLVED = 1,
  REJECTED = 2,
}

class DraggableDragItem {
  readonly element: HTMLElement;
  readonly rootParent: HTMLElement;
  readonly rootContainingBlock: HTMLElement | Document;
  readonly dragParent: HTMLElement;
  readonly dragContainingBlock: HTMLElement | Document;
  readonly x: number;
  readonly y: number;
  readonly pX: number;
  readonly pY: number;
  readonly _updateDiffX: number;
  readonly _updateDiffY: number;
  readonly _moveDiffX: number;
  readonly _moveDiffY: number;
  readonly _containerDiffX: number;
  readonly _containerDiffY: number;
  readonly _transform: string;

  constructor(
    element: HTMLElement,
    rootParent: HTMLElement,
    rootContainingBlock: HTMLElement | Document,
    dragParent: HTMLElement,
    dragContainingBlock: HTMLElement | Document,
  ) {
    this.element = element;
    this.rootParent = rootParent;
    this.rootContainingBlock = rootContainingBlock;
    this.dragParent = dragParent;
    this.dragContainingBlock = dragContainingBlock;
    this.x = 0;
    this.y = 0;
    this.pX = 0;
    this.pY = 0;
    this._updateDiffX = 0;
    this._updateDiffY = 0;
    this._moveDiffX = 0;
    this._moveDiffY = 0;
    this._containerDiffX = 0;
    this._containerDiffY = 0;
    this._transform = '';
  }
}

class DraggableDrag<S extends Sensor[], E extends S[number]['events']> {
  readonly sensor: S[number] | null;
  readonly isStarted: boolean;
  readonly isEnded: boolean;
  readonly startEvent: E['start'] | E['move'] | null;
  readonly nextMoveEvent: E['move'] | null;
  readonly prevMoveEvent: E['move'] | null;
  readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  readonly items: DraggableDragItem[];

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

function getDefaultSettings<S extends Sensor[], E extends S[number]['events']>(): DraggableSettings<
  S,
  E
> {
  return {
    container: null,
    startPredicate: () => true,
    getElements: () => null,
    releaseElements: () => {},
    getStartPosition: ({ item }) => {
      // Store item element's initial transform.
      const t = getStyle(item.element, 'transform');
      if (t && t !== 'none' && t !== IDENTITY_MATRIX && t !== IDENTITY_MATRIX_3D) {
        (item as Writeable<typeof item>)._transform = t;
      } else {
        (item as Writeable<typeof item>)._transform = '';
      }
      return { x: 0, y: 0 };
    },
    setPosition: ({ item, x, y }) => {
      item.element.style.transform = `translate(${x}px, ${y}px) ${item._transform}`;
    },
    getPositionChange: ({ event, prevEvent }) => {
      POSITION_CHANGE.x = event.x - prevEvent.x;
      POSITION_CHANGE.y = event.y - prevEvent.y;
      return POSITION_CHANGE;
    },
  };
}

export interface DraggableSettings<S extends Sensor[], E extends S[number]['events']> {
  container: HTMLElement | null;
  startPredicate: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    event: E['start'] | E['move'];
  }) => boolean | undefined;
  getElements: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    startEvent: E['start'] | E['move'];
  }) => HTMLElement[] | null;
  releaseElements: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    elements: HTMLElement[];
  }) => void;
  getStartPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem;
  }) => { x: number; y: number };
  setPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    phase: 'start' | 'move' | 'end';
    item: DraggableDragItem;
    x: number;
    y: number;
  }) => void;
  getPositionChange: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem;
    event: E['move'];
    prevEvent: E['start'] | E['move'];
    startEvent: E['start'] | E['move'];
  }) => { x: number; y: number };
}

export interface DraggablePlugin {
  name: string;
  version: string;
}

export type DraggablePluginMap = Record<string, DraggablePlugin | undefined>;

export interface DraggableEventCallbacks<E extends SensorEvents> {
  beforestart(event: E['start'] | E['move']): void;
  start(event: E['start'] | E['move']): void;
  beforemove(event: E['move']): void;
  move(event: E['move']): void;
  beforeend(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  end(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  destroy(): void;
}

export class Draggable<
  S extends Sensor[] = Sensor[],
  E extends S[number]['events'] = S[number]['events'],
  P extends DraggablePluginMap = {},
> {
  readonly sensors: S;
  readonly settings: DraggableSettings<S, E>;
  readonly plugins: P;
  readonly drag: DraggableDrag<S, E> | null;
  readonly isDestroyed: boolean;
  protected _sensorData: Map<
    S[number],
    {
      predicateState: DraggableStartPredicateState;
      predicateEvent: E['start'] | E['move'] | null;
      onMove: (e: Parameters<Draggable<S, E, P>['_onMove']>[0]) => void;
      onEnd: (e: Parameters<Draggable<S, E, P>['_onEnd']>[0]) => void;
    }
  >;
  protected _emitter: Emitter<{
    [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K];
  }>;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _updateId: symbol;

  constructor(sensors: S, options: Partial<DraggableSettings<S, E>> = {}) {
    this.sensors = sensors;
    this.settings = this._parseSettings(options);
    this.plugins = {} as P;
    this.drag = null;
    this.isDestroyed = false;

    this._sensorData = new Map();
    this._emitter = new Emitter();
    this._startId = Symbol();
    this._moveId = Symbol();
    this._updateId = Symbol();

    // Bind methods (that need binding).
    this._onMove = this._onMove.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._prepareStart = this._prepareStart.bind(this);
    this._applyStart = this._applyStart.bind(this);
    this._prepareMove = this._prepareMove.bind(this);
    this._applyMove = this._applyMove.bind(this);
    this._preparePositionUpdate = this._preparePositionUpdate.bind(this);
    this._applyPositionUpdate = this._applyPositionUpdate.bind(this);

    // Bind drag sensor events.
    this.sensors.forEach((sensor) => {
      this._sensorData.set(sensor, {
        predicateState: DraggableStartPredicateState.PENDING,
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
    options?: Partial<this['settings']>,
    defaults: this['settings'] = getDefaultSettings(),
  ): this['settings'] {
    const {
      container = defaults.container,
      startPredicate = defaults.startPredicate,
      getElements = defaults.getElements,
      releaseElements = defaults.releaseElements,
      getStartPosition = defaults.getStartPosition,
      setPosition = defaults.setPosition,
      getPositionChange = defaults.getPositionChange,
    } = options || {};

    return {
      container,
      startPredicate,
      getElements,
      releaseElements,
      getStartPosition,
      setPosition,
      getPositionChange,
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
      case DraggableStartPredicateState.PENDING: {
        sensorData.predicateEvent = e;

        // Check if drag should start.
        const shouldStart = this.settings.startPredicate({
          draggable: this,
          sensor,
          event: e,
        });

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
      case DraggableStartPredicateState.RESOLVED: {
        // Move the element if dragging is active.
        if (this.drag) {
          (this.drag as Writeable<DraggableDrag<S, E>>).nextMoveEvent = e as E['move'];
          ticker.once(tickerReadPhase, this._prepareMove, this._moveId);
          ticker.once(tickerWritePhase, this._applyMove, this._moveId);
        }
        break;
      }
    }
  }

  protected _onScroll() {
    this.updatePosition();
  }

  protected _onEnd(e: E['end'] | E['cancel'] | E['destroy'], sensor: S[number]) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    // If there is no active drag yet, let's reset the sensor's start predicate
    // so that it can try starting drag again.
    if (!this.drag) {
      sensorData.predicateState = DraggableStartPredicateState.PENDING;
      sensorData.predicateEvent = null;
    }
    // Otherwise, if drag is active AND the sensor is the one that triggered the
    // drag process, let's reset all sensors' start preidcate states.
    else if (sensorData.predicateState === DraggableStartPredicateState.RESOLVED) {
      (this.drag as Writeable<DraggableDrag<S, E>>).endEvent = e;
      this._sensorData.forEach((data) => {
        data.predicateState = DraggableStartPredicateState.PENDING;
        data.predicateEvent = null;
      });
      this.stop();
    }
  }

  protected _prepareStart() {
    const { drag } = this;
    if (!drag || !drag.startEvent) return;

    // Get elements that we'll need to move with the drag.
    // NB: It is okay if there are no elements and thus no items. The drag
    // process will process as usual, but nothing is moving by default.
    const elements =
      this.settings.getElements({
        draggable: this,
        sensor: drag.sensor!,
        startEvent: drag.startEvent,
      }) || [];

    // Create drag items.
    (drag as Writeable<DraggableDrag<S, E>>).items = elements.map((element) => {
      // Make sure element is in connected (to DOM or shadow DOM).
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
      if (!element.isConnected) {
        throw new Error('Element is not connected');
      }

      // Get element's parent.
      const rootParent = element.parentNode as HTMLElement;

      // Get parent's containing block.
      const rootContainingBlock = getContainingBlock(rootParent);

      // Get element's drag parent.
      const dragParent = this.settings.container || rootParent;

      // Get drag container's containing block.
      const dragContainingBlock =
        dragParent === rootParent ? rootContainingBlock : getContainingBlock(dragParent);

      // Create drag item.
      const item: Writeable<DraggableDragItem> = new DraggableDragItem(
        element,
        rootParent,
        rootContainingBlock,
        dragParent,
        dragContainingBlock,
      );

      // Compute the element's current clientX/Y.
      const clientRect = element.getBoundingClientRect();
      item.x = clientRect.left;
      item.y = clientRect.top;

      // If parent's containing block is different than drag container's
      // containing block let's compute the offset difference between the
      // containing blocks.
      if (rootContainingBlock !== dragContainingBlock) {
        const { left, top } = getOffsetDiff(dragContainingBlock, rootContainingBlock, OFFSET_DIFF);
        item._containerDiffX = left;
        item._containerDiffY = top;
      }

      // Lastly, compute element's current elementX/Y.
      const { x, y } = this.settings.getStartPosition({
        draggable: this,
        sensor: drag.sensor!,
        item,
      });
      item.pX = x;
      item.pY = y;

      return item;
    });
  }

  protected _applyStart() {
    const drag = this.drag;
    if (!drag || !drag.startEvent) return;

    // Emit beforestart event.
    this._emit('beforestart', drag.startEvent);

    // Make sure drag is still active after beforestart event is dispatched.
    if (this.drag !== drag) return;

    // Append element within the container element if such is provided.
    const { container } = this.settings;
    if (container) {
      for (const item of drag.items) {
        if (!item.element) continue;
        if (item.element.parentNode !== container) {
          container.appendChild(item.element);
          (item as Writeable<typeof item>).pX += item._containerDiffX;
          (item as Writeable<typeof item>).pY += item._containerDiffY;
        }
        this.settings.setPosition({
          phase: 'start',
          draggable: this,
          sensor: drag.sensor!,
          item,
          x: item.pX,
          y: item.pY,
        });
      }
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Mark drag as started.
    (drag as Writeable<DraggableDrag<S, E>>).isStarted = true;

    // Emit start event.
    this._emit('start', drag.startEvent);
  }

  protected _prepareMove() {
    const { drag } = this;
    if (!drag || !drag.startEvent) return;

    // Get next event and previous event so we can compute the movement
    // difference between the clientX/Y values.
    const nextEvent = drag.nextMoveEvent;
    const prevEvent = drag.prevMoveEvent || drag.startEvent;
    if (!nextEvent || nextEvent === prevEvent) return;

    for (const item of drag.items) {
      if (!item.element) continue;

      // Compute how much x and y needs to be transformed.
      const { x: changeX, y: changeY } = this.settings.getPositionChange({
        draggable: this,
        sensor: drag.sensor!,
        item,
        startEvent: drag.startEvent,
        prevEvent,
        event: nextEvent,
      });

      // Update horizontal position data.
      if (changeX) {
        (item as Writeable<typeof item>).pX = item.pX - item._moveDiffX + changeX;
        (item as Writeable<typeof item>).x = item.x - item._moveDiffX + changeX;
        (item as Writeable<typeof item>)._moveDiffX = changeX;
      }

      // Update vertical position data.
      if (changeY) {
        (item as Writeable<typeof item>).pY = item.pY - item._moveDiffY + changeY;
        (item as Writeable<typeof item>).y = item.y - item._moveDiffY + changeY;
        (item as Writeable<typeof item>)._moveDiffY = changeY;
      }
    }

    // Store next event as previous event.
    (drag as Writeable<DraggableDrag<S, E>>).prevMoveEvent = nextEvent;
  }

  protected _applyMove() {
    const { drag } = this;
    if (!drag || !drag.nextMoveEvent) return;

    // Reset movement diff.
    for (const item of drag.items) {
      (item as Writeable<typeof item>)._moveDiffX = 0;
      (item as Writeable<typeof item>)._moveDiffY = 0;
    }

    // Emit beforemove event.
    this._emit('beforemove', drag.nextMoveEvent);

    // Make sure drag is still active after beforemove event is dispatched.
    if (this.drag !== drag) return;

    // Move the element.
    for (const item of drag.items) {
      if (!item.element) continue;
      this.settings.setPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor!,
        item,
        x: item.pX,
        y: item.pY,
      });
    }

    // Emit move event.
    this._emit('move', drag.nextMoveEvent);
  }

  protected _preparePositionUpdate() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items) {
      if (!item.element) continue;

      // Update container diff.
      if (item.rootContainingBlock !== item.dragContainingBlock) {
        const { left, top } = getOffsetDiff(
          item.dragContainingBlock as HTMLElement | Document,
          item.rootContainingBlock as HTMLElement | Document,
          OFFSET_DIFF,
        );
        (item as Writeable<typeof item>)._containerDiffX = left;
        (item as Writeable<typeof item>)._containerDiffY = top;
      }

      const { left, top } = item.element.getBoundingClientRect();

      // Update horizontal position data.
      const _updateDiffX = item.x - item._moveDiffX - left;
      (item as Writeable<typeof item>).pX = item.pX - item._updateDiffX + _updateDiffX;
      (item as Writeable<typeof item>)._updateDiffX = _updateDiffX;

      // Update vertical position data.
      const _updateDiffY = item.y - item._moveDiffY - top;
      (item as Writeable<typeof item>).pY = item.pY - item._updateDiffY + _updateDiffY;
      (item as Writeable<typeof item>)._updateDiffY = _updateDiffY;
    }
  }

  protected _applyPositionUpdate() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items) {
      if (!item.element) continue;
      (item as Writeable<typeof item>)._updateDiffX = 0;
      (item as Writeable<typeof item>)._updateDiffY = 0;
      this.settings.setPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor!,
        item,
        x: item.pX,
        y: item.pY,
      });
    }
  }

  on<K extends keyof DraggableEventCallbacks<E>>(
    eventName: K,
    listener: DraggableEventCallbacks<E>[K],
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(eventName, listener, listenerId);
  }

  off<K extends keyof DraggableEventCallbacks<E>>(
    eventName: K,
    listener: DraggableEventCallbacks<E>[K] | EventListenerId,
  ): void {
    this._emitter.off(eventName, listener);
  }

  resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    const startEvent = e || sensorData.predicateEvent;

    if (sensorData.predicateState === DraggableStartPredicateState.PENDING && startEvent) {
      // Resolve the provided sensor's start predicate.
      sensorData.predicateState = DraggableStartPredicateState.RESOLVED;
      sensorData.predicateEvent = null;
      (this as Writeable<this>).drag = new DraggableDrag();
      (this.drag as Writeable<DraggableDrag<S, E>>).sensor = sensor;
      (this.drag as Writeable<DraggableDrag<S, E>>).startEvent = startEvent;

      // Reject other sensors' start predicates.
      this._sensorData.forEach((data, s) => {
        if (s === sensor) return;
        data.predicateState = DraggableStartPredicateState.REJECTED;
        data.predicateEvent = null;
      });

      // Queue drag start.
      ticker.once(tickerReadPhase, this._prepareStart, this._startId);
      ticker.once(tickerWritePhase, this._applyStart, this._startId);
    }
  }

  rejectStartPredicate(sensor: S[number]) {
    const sensorData = this._sensorData.get(sensor);
    if (sensorData?.predicateState === DraggableStartPredicateState.PENDING) {
      sensorData.predicateState = DraggableStartPredicateState.REJECTED;
      sensorData.predicateEvent = null;
    }
  }

  stop() {
    const { drag } = this;
    if (!drag || drag.isEnded) return;

    // Mark drag process as ended.
    (drag as Writeable<DraggableDrag<S, E>>).isEnded = true;

    // Emit beforeend event.
    this._emit('beforeend', drag.endEvent);

    // Cancel all queued ticks.
    ticker.off(tickerReadPhase, this._startId);
    ticker.off(tickerWritePhase, this._startId);
    ticker.off(tickerReadPhase, this._moveId);
    ticker.off(tickerWritePhase, this._moveId);
    ticker.off(tickerReadPhase, this._updateId);
    ticker.off(tickerWritePhase, this._updateId);

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
          (item as Writeable<typeof item>).pX -= item._containerDiffX;
          (item as Writeable<typeof item>).pY -= item._containerDiffY;
          (item as Writeable<typeof item>)._containerDiffX = 0;
          (item as Writeable<typeof item>)._containerDiffY = 0;
          item.rootParent.appendChild(item.element);
        }
        this.settings.setPosition({
          phase: 'end',
          draggable: this,
          sensor: drag.sensor!,
          item,
          x: item.pX,
          y: item.pY,
        });
      }

      // Call "releaseElements" callback.
      if (elements.length) {
        this.settings.releaseElements({
          draggable: this,
          sensor: drag.sensor!,
          elements,
        });
      }
    }

    // Emit end event.
    this._emit('end', drag.endEvent);

    // Reset drag data.
    (this as Writeable<this>).drag = null;
  }

  updatePosition(instant = false) {
    if (!this.drag) return;
    if (instant) {
      this._preparePositionUpdate();
      this._applyPositionUpdate();
    } else {
      ticker.once(tickerReadPhase, this._preparePositionUpdate, this._updateId);
      ticker.once(tickerWritePhase, this._applyPositionUpdate, this._updateId);
    }
  }

  updateSettings(options: Partial<this['settings']> = {}) {
    (this as Writeable<this>).settings = this._parseSettings(options, this.settings);
  }

  use<SS extends S, EE extends SS[number]['events'], PP extends P>(
    plugin: (draggable: this) => Draggable<SS, EE, PP>,
  ) {
    return plugin(this);
  }

  destroy() {
    if (this.isDestroyed) return;
    (this as Writeable<this>).isDestroyed = true;

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
