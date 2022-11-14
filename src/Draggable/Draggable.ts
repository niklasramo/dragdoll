// TODO: Support dragging proxy/virtual HTMLElements too, this would be great
// for e.g. testing purposes in non-browser context.

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

enum StartPredicateState {
  PENDING = 0,
  RESOLVED = 1,
  REJECTED = 2,
}

type TransformMap = Map<HTMLElement, string>;

class DraggableDragItem {
  readonly element: HTMLElement | null;
  readonly rootParent: HTMLElement | null;
  readonly rootContainingBlock: HTMLElement | Document | null;
  readonly dragParent: HTMLElement | null;
  readonly dragContainingBlock: HTMLElement | Document | null;
  readonly x: number;
  readonly y: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly syncDiffX: number;
  readonly syncDiffY: number;
  readonly moveDiffX: number;
  readonly moveDiffY: number;
  readonly containerDiffX: number;
  readonly containerDiffY: number;

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

class DraggableDragData<S extends Sensor[], E extends S[number]['events']> {
  readonly sensor: S[number] | null;
  readonly isStarted: boolean;
  readonly isEnded: boolean;
  readonly startEvent: E['start'] | E['move'] | null;
  readonly nextMoveEvent: E['move'] | null;
  readonly prevMoveEvent: E['move'] | null;
  readonly endEvent: E['end'] | E['cancel'] | E['destroy'] | null;
  readonly items: DraggableDragItem[];
  extraData: { [key: string]: any };

  constructor() {
    this.sensor = null;
    this.isEnded = false;
    this.isStarted = false;
    this.startEvent = null;
    this.nextMoveEvent = null;
    this.prevMoveEvent = null;
    this.endEvent = null;
    this.items = [];
    this.extraData = {};
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
    getElementStartPosition: ({ element, draggable }) => {
      const { drag } = draggable;
      if (drag) {
        const transformMap: TransformMap = drag.extraData.transformMap || new Map();
        drag.extraData.transformMap = transformMap;
        const t = getStyle(element, 'transform');
        if (t && t !== 'none' && t !== IDENTITY_MATRIX && t !== IDENTITY_MATRIX_3D) {
          transformMap.set(element, t);
        } else {
          transformMap.set(element, '');
        }
      }
      return { x: 0, y: 0 };
    },
    setElementPosition: ({ draggable, element, x, y }) => {
      const { drag } = draggable;
      const transformMap: TransformMap | undefined = drag?.extraData.transformMap;
      const initTransform = transformMap?.get(element) || '';

      element.style.transform = `translate(${x}px, ${y}px) ${initTransform}`;
    },
    getElementPositionChange: ({ event, prevEvent }) => {
      POSITION_CHANGE.x = event.clientX - prevEvent.clientX;
      POSITION_CHANGE.y = event.clientY - prevEvent.clientY;
      return POSITION_CHANGE;
    },
  };
}

export interface DraggableEventCallbacks<E extends SensorEvents> {
  beforestart(event: E['start'] | E['move']): void;
  start(event: E['start'] | E['move']): void;
  beforemove(event: E['move']): void;
  move(event: E['move']): void;
  beforeend(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  end(event: E['end'] | E['cancel'] | E['destroy'] | null): void;
  destroy(): void;
}

export type DraggablePlugin<S extends Sensor[], E extends S[number]['events']> = (
  draggable: Draggable<S, E>
) => {
  name: string;
  version: string;
  [key: string]: any;
};

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
  getElementStartPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    element: HTMLElement;
  }) => { x: number; y: number };
  setElementPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    phase: 'start' | 'move' | 'end';
    element: HTMLElement;
    x: number;
    y: number;
  }) => void;
  getElementPositionChange: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    element: HTMLElement;
    event: E['move'];
    prevEvent: E['start'] | E['move'];
    startEvent: E['start'] | E['move'];
  }) => { x: number; y: number };
}

export type DraggableOptions<S extends Sensor[], E extends S[number]['events']> = Partial<
  DraggableSettings<S, E>
>;

export class Draggable<
  S extends Sensor[] = Sensor[],
  E extends S[number]['events'] = S[number]['events']
> {
  readonly sensors: S;
  readonly settings: DraggableSettings<S, E>;
  readonly drag: DraggableDragData<S, E> | null;
  readonly plugins: Map<string, ReturnType<DraggablePlugin<S, E>>>;
  readonly isDestroyed: boolean;
  protected _sensorData: Map<
    S[number],
    {
      predicateState: StartPredicateState;
      predicateEvent: E['start'] | E['move'] | null;
      onMove: (e: Parameters<Draggable<S, E>['_onMove']>[0]) => void;
      onEnd: (e: Parameters<Draggable<S, E>['_onEnd']>[0]) => void;
    }
  >;
  protected _emitter: Emitter<{
    [K in keyof DraggableEventCallbacks<E>]: DraggableEventCallbacks<E>[K];
  }>;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _syncId: symbol;

  constructor(sensors: S, options: DraggableOptions<S, E> = {}) {
    this.sensors = sensors;
    this.settings = this._parseSettings(options);
    this.drag = null;
    this.plugins = new Map();
    this.isDestroyed = false;

    this._sensorData = new Map();
    this._emitter = new Emitter();
    this._startId = Symbol();
    this._moveId = Symbol();
    this._syncId = Symbol();

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
    options?: DraggableOptions<S, E>,
    defaults: DraggableSettings<S, E> = getDefaultSettings()
  ): DraggableSettings<S, E> {
    const {
      container = defaults.container,
      startPredicate = defaults.startPredicate,
      getElements = defaults.getElements,
      releaseElements = defaults.releaseElements,
      getElementStartPosition = defaults.getElementStartPosition,
      setElementPosition = defaults.setElementPosition,
      getElementPositionChange = defaults.getElementPositionChange,
    } = options || {};

    return {
      container,
      startPredicate,
      getElements,
      releaseElements,
      getElementStartPosition,
      setElementPosition,
      getElementPositionChange,
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
      case StartPredicateState.RESOLVED: {
        // Move the element if dragging is active.
        if (this.drag) {
          (this.drag as Writeable<DraggableDragData<S, E>>).nextMoveEvent = e as E['move'];
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
    if (!this.drag) {
      sensorData.predicateState = StartPredicateState.PENDING;
      sensorData.predicateEvent = null;
    }
    // Otherwise, if drag is active AND the sensor is the one that triggered the
    // drag process, let's reset all sensors' start preidcate states.
    else if (sensorData.predicateState === StartPredicateState.RESOLVED) {
      (this.drag as Writeable<DraggableDragData<S, E>>).endEvent = e;
      this._sensorData.forEach((data) => {
        data.predicateState = StartPredicateState.PENDING;
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
    (drag as Writeable<DraggableDragData<S, E>>).items = elements.map((element) => {
      // Make sure element is in connected (to DOM or shadow DOM).
      // https://developer.mozilla.org/en-US/docs/Web/API/Node/isConnected
      if (!element.isConnected) {
        throw new Error('Element is not connected');
      }

      const item: Writeable<DraggableDragItem> = new DraggableDragItem();

      // Store item element.
      item.element = element;

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
      const { x, y } = this.settings.getElementStartPosition({
        draggable: this,
        sensor: drag.sensor!,
        element,
      });
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
          (item as Writeable<typeof item>).x += item.containerDiffX;
          (item as Writeable<typeof item>).y += item.containerDiffY;
        }
        this.settings.setElementPosition({
          phase: 'start',
          draggable: this,
          sensor: drag.sensor!,
          element: item.element,
          x: item.x,
          y: item.y,
        });
      }
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Mark drag as started.
    (drag as Writeable<DraggableDragData<S, E>>).isStarted = true;

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
      const { x: changeX, y: changeY } = this.settings.getElementPositionChange({
        draggable: this,
        sensor: drag.sensor!,
        element: item.element,
        startEvent: drag.startEvent,
        prevEvent,
        event: nextEvent,
      });

      // Update horizontal position data.
      if (changeX) {
        (item as Writeable<typeof item>).x = item.x - item.moveDiffX + changeX;
        (item as Writeable<typeof item>).clientX = item.clientX - item.moveDiffX + changeX;
        (item as Writeable<typeof item>).moveDiffX = changeX;
      }

      // Update vertical position data.
      if (changeY) {
        (item as Writeable<typeof item>).y = item.y - item.moveDiffY + changeY;
        (item as Writeable<typeof item>).clientY = item.clientY - item.moveDiffY + changeY;
        (item as Writeable<typeof item>).moveDiffY = changeY;
      }
    }

    // Store next event as previous event.
    (drag as Writeable<DraggableDragData<S, E>>).prevMoveEvent = nextEvent;
  }

  protected _applyMove() {
    const { drag } = this;
    if (!drag || !drag.nextMoveEvent) return;

    // Reset movement diff.
    for (const item of drag.items) {
      (item as Writeable<typeof item>).moveDiffX = 0;
      (item as Writeable<typeof item>).moveDiffY = 0;
    }

    // Emit beforemove event.
    this._emit('beforemove', drag.nextMoveEvent);

    // Make sure drag is still active after beforemove event is dispatched.
    if (this.drag !== drag) return;

    // Move the element.
    for (const item of drag.items) {
      if (!item.element) continue;
      this.settings.setElementPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor!,
        element: item.element,
        x: item.x,
        y: item.y,
      });
    }

    // Emit move event.
    this._emit('move', drag.nextMoveEvent);
  }

  protected _prepareSynchronize() {
    const { drag } = this;
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
        (item as Writeable<typeof item>).containerDiffX = left;
        (item as Writeable<typeof item>).containerDiffY = top;
      }

      const { left, top } = item.element.getBoundingClientRect();

      // Update horizontal position data.
      const syncDiffX = item.clientX - item.moveDiffX - left;
      (item as Writeable<typeof item>).x = item.x - item.syncDiffX + syncDiffX;
      (item as Writeable<typeof item>).syncDiffX = syncDiffX;

      // Update vertical position data.
      const syncDiffY = item.clientY - item.moveDiffY - top;
      (item as Writeable<typeof item>).y = item.y - item.syncDiffY + syncDiffY;
      (item as Writeable<typeof item>).syncDiffY = syncDiffY;
    }
  }

  protected _applySynchronize() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items) {
      if (!item.element) continue;
      (item as Writeable<typeof item>).syncDiffX = 0;
      (item as Writeable<typeof item>).syncDiffY = 0;
      this.settings.setElementPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor!,
        element: item.element,
        x: item.x,
        y: item.y,
      });
    }
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
    if (!this.drag) return;
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
      (this as Writeable<this>).drag = new DraggableDragData();
      (this.drag as Writeable<DraggableDragData<S, E>>).sensor = sensor;
      (this.drag as Writeable<DraggableDragData<S, E>>).startEvent = startEvent;

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
    const { drag } = this;
    if (!drag || drag.isEnded) return;

    // Mark drag process as ended.
    (drag as Writeable<DraggableDragData<S, E>>).isEnded = true;

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
          (item as Writeable<typeof item>).x -= item.containerDiffX;
          (item as Writeable<typeof item>).y -= item.containerDiffY;
          (item as Writeable<typeof item>).containerDiffX = 0;
          (item as Writeable<typeof item>).containerDiffY = 0;
          item.rootParent.appendChild(item.element);
        }
        this.settings.setElementPosition({
          phase: 'end',
          draggable: this,
          sensor: drag.sensor!,
          element: item.element,
          x: item.x,
          y: item.y,
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

  updateSettings(options: DraggableOptions<S, E> = {}) {
    (this as Writeable<this>).settings = this._parseSettings(options, this.settings);
  }

  use(plugin: DraggablePlugin<S, E>) {
    const pluginInstance = plugin(this);

    if (!pluginInstance.name) {
      throw new Error('Plugin has no name.');
    }

    if (this.plugins.has(pluginInstance.name)) {
      throw new Error(`${pluginInstance.name} plugin is already added.`);
    }

    this.plugins.set(pluginInstance.name, pluginInstance);

    return this;
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
