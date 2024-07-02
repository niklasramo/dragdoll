import { HAS_PASSIVE_EVENTS } from '../constants.js';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents } from '../sensors/sensor.js';

import { DraggableDrag } from './draggable-drag.js';

import { DraggableDragItem } from './draggable-drag-item.js';

import { ticker, tickerPhases } from '../singletons/ticker.js';

import { appendElement } from 'utils/append-element.js';

import { createWrapperElement } from 'utils/create-wrapper-element.js';

import { Writeable, CSSProperties, Point } from '../types.js';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const POSITION_CHANGE = { x: 0, y: 0 };

const DOM_MATRIX = new DOMMatrix();

enum DragStartPhase {
  NONE = 0,
  INIT = 1,
  START_PREPARE = 2,
  FINISH_APPLY = 3,
}

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
      const [containerMatrix, inverseContainerMatrix] = item.getContainerMatrix();

      DOM_MATRIX.setMatrixValue(
        `${inverseContainerMatrix} translate(${x}px, ${y}px) ${containerMatrix} ${item.elementMatrix}`,
      );

      item.element.style.transform = `${DOM_MATRIX}`;
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
  }) => Point;
  setPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    phase: 'start' | 'move' | 'end' | 'pre-align' | 'align';
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
  }) => Point;
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
  protected _startPhase: DragStartPhase;
  protected _startId: symbol;
  protected _moveId: symbol;
  protected _alignId: symbol;

  constructor(sensors: S, options: Partial<DraggableSettings<S, E>> = {}) {
    this.sensors = sensors;
    this.settings = this._parseSettings(options);
    this.plugins = {} as P;
    this.drag = null;
    this.isDestroyed = false;

    this._sensorData = new Map();
    this._emitter = new Emitter();
    this._startPhase = DragStartPhase.NONE;
    this._startId = Symbol();
    this._moveId = Symbol();
    this._alignId = Symbol();

    // Bind methods (that need binding).
    this._onMove = this._onMove.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._prepareStart = this._prepareStart.bind(this);
    this._applyStart = this._applyStart.bind(this);
    this._prepareMove = this._prepareMove.bind(this);
    this._applyMove = this._applyMove.bind(this);
    this._prepareAlign = this._prepareAlign.bind(this);
    this._applyAlign = this._applyAlign.bind(this);
    this._computeOffsets = this._computeOffsets.bind(this);
    this._applyOffsets = this._applyOffsets.bind(this);

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
          ticker.once(tickerPhases.read, this._prepareMove, this._moveId);
          ticker.once(tickerPhases.write, this._applyMove, this._moveId);
        }
        break;
      }
    }
  }

  protected _onScroll() {
    this.align();
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

    // Update start phase.
    this._startPhase = DragStartPhase.START_PREPARE;

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

    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      // Append element within the container element if such is provided.
      if (item.dragContainer !== item.elementContainer) {
        item.dragInnerContainer = createWrapperElement();
        item.applyContainerOffset();
        appendElement(item.element, item.dragContainer, item.dragInnerContainer);
      }

      // Freeze element's props if such are provided.
      if (item.frozenProps) {
        Object.assign(item.element.style, item.frozenProps);
      }

      // Set element's start position.
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

    // Update start phase.
    this._startPhase = DragStartPhase.FINISH_APPLY;

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
        item.clientRect.x += changeX;
        item.moveDiff.x += changeX;
      }

      // Update vertical position data.
      if (changeY) {
        item.position.y += changeY;
        item.clientRect.y += changeY;
        item.moveDiff.y += changeY;
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
      item.moveDiff.x = 0;
      item.moveDiff.y = 0;

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

  protected _computeOffsets(updateMatrices = false) {
    const { drag } = this;
    if (!drag) return;

    // Invalidate matrix cache.
    if (updateMatrices) {
      drag.matrixCache.invalidate();
    }

    // Invalidate client offset cache.
    drag.clientOffsetCache.invalidate();

    // Update drag items' world matrices and container offsets.
    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      if (updateMatrices) {
        item.updateContainerMatrices();
      }
      item.updateContainerOffset();
    }
  }

  protected _applyOffsets(updateMatrices = false) {
    const { drag } = this;
    if (!drag) return;

    // Apply new transforms to the drag inner containers. This unfortunately
    // needs to be done before we query the client rects in the next step.
    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      item.applyContainerOffset();

      // Apply the changed matrices to the element BEFORE we query the client
      // rect.
      if (updateMatrices) {
        this.settings.setPosition({
          phase: 'pre-align',
          draggable: this,
          sensor: drag.sensor,
          item: item as DraggableDragItem<S, E>,
          x: item.position.x - item.alignDiff.x - item.moveDiff.x,
          y: item.position.y - item.alignDiff.y - item.moveDiff.y,
        });
      }
    }
  }

  protected _prepareAlign() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      const { x, y } = item.element.getBoundingClientRect();

      // Note that we INTENTIONALLY DO NOT UPDATE THE CLIENT RECT COORDINATES
      // here. The point of this method is to update the POSITION of the
      // draggable item based on how much the client rect has drifted so that
      // the element is visually repostioned to the correct place.

      // Update horizontal position data.
      const alignDiffX = item.clientRect.x - item.moveDiff.x - x;
      item.position.x = item.position.x - item.alignDiff.x + alignDiffX;
      item.alignDiff.x = alignDiffX;

      // Update vertical position data.
      const alignDiffY = item.clientRect.y - item.moveDiff.y - y;
      item.position.y = item.position.y - item.alignDiff.y + alignDiffY;
      item.alignDiff.y = alignDiffY;
    }
  }

  protected _applyAlign() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      item.alignDiff.x = 0;
      item.alignDiff.y = 0;

      this.settings.setPosition({
        phase: 'align',
        draggable: this,
        sensor: drag.sensor,
        item: item as DraggableDragItem<S, E>,
        x: item.position.x,
        y: item.position.y,
      });
    }
  }

  on<T extends keyof DraggableEventCallbacks<E>>(
    type: T,
    listener: DraggableEventCallbacks<E>[T],
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<T extends keyof DraggableEventCallbacks<E>>(type: T, listenerId: EventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  resolveStartPredicate(sensor: S[number], e?: E['start'] | E['move']) {
    const sensorData = this._sensorData.get(sensor);
    if (!sensorData) return;

    const startEvent = e || sensorData.predicateEvent;

    if (sensorData.predicateState === DraggableStartPredicateState.PENDING && startEvent) {
      //  Update start phase.
      this._startPhase = DragStartPhase.INIT;

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
      ticker.once(tickerPhases.read, this._prepareStart, this._startId);
      ticker.once(tickerPhases.write, this._applyStart, this._startId);
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

    // If drag start process is still in the prepare and apply phase, let's
    // wait for it to finish before stopping the drag process. This is a very
    // rare edge case, but it can happen if the drag process is stopped
    // forcefully during the start phase.
    // NB: We reuse the `_startId` symbol to queue the stop procedure.
    if (this._startPhase === DragStartPhase.START_PREPARE) {
      this.off('start', this._startId);
      this.on('start', () => this.stop(), this._startId);
      return;
    }

    // Reset drag start phase.
    this._startPhase = DragStartPhase.NONE;

    // Mark drag process as ended.
    drag.isEnded = true;

    // Cancel all queued ticks.
    ticker.off(tickerPhases.read, this._startId);
    ticker.off(tickerPhases.write, this._startId);
    ticker.off(tickerPhases.read, this._moveId);
    ticker.off(tickerPhases.write, this._moveId);
    ticker.off(tickerPhases.preRead, this._alignId);
    ticker.off(tickerPhases.preWrite, this._alignId);
    ticker.off(tickerPhases.read, this._alignId);
    ticker.off(tickerPhases.write, this._alignId);

    // Unbind scroll listener.
    window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Remove measure elements.
    for (const [_element, measureElement] of drag.measureElements) {
      measureElement.remove();
    }

    // Move elements within the root container and collect all elements
    // to an elements array.
    const elements: (HTMLElement | SVGSVGElement)[] = [];
    for (const item of drag.items as Writeable<DraggableDragItem<S, E>>[]) {
      elements.push(item.element);

      if (item.elementContainer !== item.dragContainer) {
        appendElement(item.element, item.elementContainer);

        // Remove drag inner container if such exists.
        if (item.dragInnerContainer) {
          item.dragInnerContainer.remove();
        }
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

  align({
    instant = false,
    updateMatrices = false,
  }: {
    instant?: boolean;
    updateMatrices?: boolean;
  } = {}) {
    if (!this.drag) return;
    if (instant) {
      this._computeOffsets(updateMatrices);
      this._applyOffsets(updateMatrices);
      this._prepareAlign();
      this._applyAlign();
    } else {
      ticker.once(tickerPhases.preRead, () => this._computeOffsets(updateMatrices), this._alignId);
      ticker.once(tickerPhases.preWrite, () => this._applyOffsets(updateMatrices), this._alignId);
      ticker.once(tickerPhases.read, this._prepareAlign, this._alignId);
      ticker.once(tickerPhases.write, this._applyAlign, this._alignId);
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
