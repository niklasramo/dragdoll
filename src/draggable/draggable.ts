import { HAS_PASSIVE_EVENTS } from '../constants.js';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents } from '../sensors/sensor.js';

import { DraggableDrag } from './draggable-drag.js';

import { DraggableDragItem } from './draggable-drag-item.js';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker.js';

import { getOffsetDiff } from '../utils/get-offset-diff.js';

import { Writeable, CSSProperties } from '../types.js';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const OFFSET_DIFF = { left: 0, top: 0 };

const POSITION_CHANGE = { x: 0, y: 0 };

enum DraggableStartPredicateState {
  PENDING = 0,
  RESOLVED = 1,
  REJECTED = 2,
}

function getDefaultSettings<S extends Sensor[], E extends S[number]['events']>(): DraggableSettings<
  S,
  E
> {
  return {
    container: null,
    startPredicate: () => true,
    getElements: () => null,
    releaseElements: () => null,
    getFrozenProps: () => null,
    getStartPosition: () => {
      return { x: 0, y: 0 };
    },
    setPosition: ({ item, x, y }) => {
      item.element.style.transform = `translate(${x}px, ${y}px) ${item.initialTransform}`;
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
  }) => (HTMLElement | SVGSVGElement)[] | null;
  releaseElements: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    elements: (HTMLElement | SVGSVGElement)[];
  }) => void;
  getFrozenProps: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem<S, E>;
    style: CSSStyleDeclaration;
  }) => CSSProperties | (keyof CSSProperties)[] | null;
  getStartPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem<S, E>;
    style: CSSStyleDeclaration;
  }) => { x: number; y: number };
  setPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    phase: 'start' | 'move' | 'end';
    item: DraggableDragItem<S, E>;
    x: number;
    y: number;
  }) => void;
  getPositionChange: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem<S, E>;
    event: E['start'] | E['move'];
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
  preparestart(event: E['start'] | E['move']): void;
  start(event: E['start'] | E['move']): void;
  preparemove(event: E['move']): void;
  move(event: E['move']): void;
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
      sensor.on('start', onMove, onMove);
      sensor.on('move', onMove, onMove);
      sensor.on('cancel', onEnd, onEnd);
      sensor.on('end', onEnd, onEnd);
      sensor.on('destroy', onEnd, onEnd);
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
      getFrozenProps = defaults.getFrozenProps,
      getStartPosition = defaults.getStartPosition,
      setPosition = defaults.setPosition,
      getPositionChange = defaults.getPositionChange,
    } = options || {};

    return {
      container,
      startPredicate,
      getElements,
      releaseElements,
      getFrozenProps,
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
          (this.drag as Writeable<DraggableDrag<S, E>>).event = e;
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
    const drag: Writeable<DraggableDrag<S, E>> | null = this.drag;
    if (!drag) return;

    // Get elements that we'll need to move with the drag.
    // NB: It is okay if there are no elements and thus no items. The drag
    // process will process as usual, but nothing is moving by default.
    const elements =
      this.settings.getElements({
        draggable: this,
        sensor: drag.sensor,
        startEvent: drag.startEvent,
      }) || [];

    // Create drag items.
    drag.items = elements.map((element) => {
      return new DraggableDragItem(element, this);
    });

    // Emit preparestart event.
    this._emit('preparestart', drag.startEvent);
  }

  protected _applyStart() {
    const drag: Writeable<DraggableDrag<S, E>> | null = this.drag;
    if (!drag) return;

    const { container } = this.settings;
    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      // Append element within the container element if such is provided.
      if (container && item.element.parentElement !== container) {
        container.appendChild(item.element);
        item.position.x += item._containerDiff.x;
        item.position.y += item._containerDiff.y;
      }

      // Freeze element's props if such are provided.
      if (item.frozenProps) {
        Object.assign(item.element.style, item.frozenProps);
      }

      // Set the element's start position.
      this.settings.setPosition({
        phase: 'start',
        draggable: this,
        sensor: drag.sensor,
        item: item as DraggableDragItem<S, E>,
        x: item.position.x,
        y: item.position.y,
      });
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Emit start event.
    this._emit('start', drag.startEvent);
  }

  protected _prepareMove() {
    const drag: Writeable<DraggableDrag<S, E>> | null = this.drag;
    if (!drag) return;

    // Get next event and previous event so we can compute the movement
    // difference between the clientX/Y values.
    const { event, prevEvent, startEvent, sensor } = drag;
    if (event === prevEvent) return;

    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      // Compute how much x and y needs to be transformed.
      const { x: changeX, y: changeY } = this.settings.getPositionChange({
        draggable: this,
        sensor,
        item: item as DraggableDragItem<S, E>,
        event,
        prevEvent,
        startEvent,
      });

      // Update horizontal position data.
      if (changeX) {
        item.position.x += changeX;
        item.clientRect.left += changeX;
        item._moveDiff.x += changeX;
      }

      // Update vertical position data.
      if (changeY) {
        item.position.y += changeY;
        item.clientRect.top += changeY;
        item._moveDiff.y += changeY;
      }
    }

    // Store next event as previous event.
    (drag as Writeable<DraggableDrag<S, E>>).prevEvent = event;

    // Emit preparemove event.
    this._emit('preparemove', event as E['move']);
  }

  protected _applyMove() {
    const drag: Writeable<DraggableDrag<S, E>> | null = this.drag;
    if (!drag) return;

    // Reset movement diff and move the element.
    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      item._moveDiff.x = 0;
      item._moveDiff.y = 0;

      this.settings.setPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor,
        item: item as DraggableDragItem<S, E>,
        x: item.position.x,
        y: item.position.y,
      });
    }

    // Emit move event.
    if (drag.event) {
      this._emit('move', drag.event as E['move']);
    }
  }

  protected _preparePositionUpdate() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      // Update container diff.
      if (item.elementOffsetContainer !== item.dragOffsetContainer) {
        const { left, top } = getOffsetDiff(
          item.dragOffsetContainer,
          item.elementOffsetContainer,
          OFFSET_DIFF,
        );
        item._containerDiff.x = left;
        item._containerDiff.y = top;
      }

      const { left, top, width, height } = item.element.getBoundingClientRect();

      // Update horizontal position data.
      const updateDiffX = item.clientRect.left - item._moveDiff.x - left;
      item.position.x = item.position.x - item._updateDiff.x + updateDiffX;
      item._updateDiff.x = updateDiffX;

      // Update vertical position data.
      const updateDiffY = item.clientRect.top - item._moveDiff.y - top;
      item.position.y = item.position.y - item._updateDiff.y + updateDiffY;
      item._updateDiff.y = updateDiffY;

      // Update item client size. This is not necessary for the drag process,
      // but since we're computing the bounding client rect, we might as well
      // update the size in the process. The size is used by the auto-scroll
      // plugin and possibly some other third-party plugins.
      item.clientRect.width = width;
      item.clientRect.height = height;
    }
  }

  protected _applyPositionUpdate() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      item._updateDiff.x = 0;
      item._updateDiff.y = 0;

      this.settings.setPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor,
        item: item as DraggableDragItem<S, E>,
        x: item.position.x,
        y: item.position.y,
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

  off<K extends keyof DraggableEventCallbacks<E>>(eventName: K, listenerId: EventListenerId): void {
    this._emitter.off(eventName, listenerId);
  }

  resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    const startEvent = e || sensorData.predicateEvent;

    if (sensorData.predicateState === DraggableStartPredicateState.PENDING && startEvent) {
      // Resolve the provided sensor's start predicate.
      sensorData.predicateState = DraggableStartPredicateState.RESOLVED;
      sensorData.predicateEvent = null;

      (this as Writeable<this>).drag = new DraggableDrag(sensor, startEvent);

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
    const drag: Writeable<DraggableDrag<S, E>> | null = this.drag;
    if (!drag || drag.isEnded) return;

    // Mark drag process as ended.
    drag.isEnded = true;

    // Cancel all queued ticks.
    ticker.off(tickerReadPhase, this._startId);
    ticker.off(tickerWritePhase, this._startId);
    ticker.off(tickerReadPhase, this._moveId);
    ticker.off(tickerWritePhase, this._moveId);
    ticker.off(tickerReadPhase, this._updateId);
    ticker.off(tickerWritePhase, this._updateId);

    // Unbind scroll listener.
    window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Move elements within the root container and collect all elements
    // to an elements array.
    const elements: (HTMLElement | SVGSVGElement)[] = [];
    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      elements.push(item.element);
      if (item.elementContainer && item.element.parentElement !== item.elementContainer) {
        item.position.x -= item._containerDiff.x;
        item.position.y -= item._containerDiff.y;
        item._containerDiff.x = 0;
        item._containerDiff.y = 0;
        item.elementContainer.appendChild(item.element);
      }

      // Unfreeze element's props if such are provided.
      if (item.unfrozenProps) {
        for (const key in item.unfrozenProps) {
          item.element.style[key] = item.unfrozenProps[key] || '';
        }
      }

      // Set final position after drag.
      this.settings.setPosition({
        phase: 'end',
        draggable: this,
        sensor: drag.sensor,
        item: item as DraggableDragItem<S, E>,
        x: item.position.x,
        y: item.position.y,
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
