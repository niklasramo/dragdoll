import { HAS_PASSIVE_EVENTS } from '../constants.js';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents } from '../sensors/sensor.js';

import { DraggableDrag } from './draggable-drag.js';

import { DraggableDragItem } from './draggable-drag-item.js';

import { ticker, tickerReadPhase, tickerWritePhase } from '../singletons/ticker.js';

import { getOffsetContainer } from '../utils/get-offset-container.js';

import { getOffsetDiff } from '../utils/get-offset-diff.js';

import { getStyle } from '../utils/get-style.js';

import { Writeable, CSSProperties } from '../types.js';

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
  container: Element | null;
  startPredicate: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    event: E['start'] | E['move'];
  }) => boolean | undefined;
  getElements: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    startEvent: E['start'] | E['move'];
  }) => (HTMLElement | SVGElement)[] | null;
  releaseElements: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    elements: (HTMLElement | SVGElement)[];
  }) => void;
  getFrozenProps: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem;
    style: CSSStyleDeclaration;
  }) => CSSProperties | (keyof CSSProperties)[] | null;
  getStartPosition: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    item: DraggableDragItem;
    style: CSSStyleDeclaration;
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
      const elementContainer = element.parentElement!;

      // Get parent's containing block.
      const elementOffsetContainer = getOffsetContainer(element);
      if (!elementOffsetContainer) {
        throw new Error('Offset container could not be computed for the element!');
      }

      // Get element's drag parent.
      const dragContainer = this.settings.container || elementContainer;

      // Get drag container's containing block.
      const dragOffsetContainer =
        dragContainer === elementContainer
          ? elementOffsetContainer
          : getOffsetContainer(element, dragContainer);
      if (!dragOffsetContainer) {
        throw new Error('Drag offset container could not be computed for the element!');
      }

      // Create drag item.
      const item: Writeable<DraggableDragItem> = new DraggableDragItem(
        element,
        elementContainer,
        elementOffsetContainer,
        dragContainer,
        dragOffsetContainer,
      );

      // Compute the element's current clientX/Y.
      const clientRect = element.getBoundingClientRect();
      item.x = clientRect.left;
      item.y = clientRect.top;

      // If parent's containing block is different than drag container's
      // containing block let's compute the offset difference between the
      // containing blocks.
      if (elementOffsetContainer !== dragOffsetContainer) {
        const { left, top } = getOffsetDiff(
          dragOffsetContainer,
          elementOffsetContainer,
          OFFSET_DIFF,
        );
        item._containerDiffX = left;
        item._containerDiffY = top;
      }

      // Get element's style declaration.
      const style = getStyle(element);

      // Store element's initial transform.
      const { transform } = style;
      if (
        transform &&
        transform !== 'none' &&
        transform !== IDENTITY_MATRIX &&
        transform !== IDENTITY_MATRIX_3D
      ) {
        item.initialTransform = transform;
      }

      // Get element's current elementX/Y.
      const { x, y } = this.settings.getStartPosition({
        draggable: this,
        sensor: drag.sensor!,
        item,
        style,
      });
      item.pX = x;
      item.pY = y;

      // Get element's frozen props.
      const frozenProps = this.settings.getFrozenProps({
        draggable: this,
        sensor: drag.sensor!,
        item,
        style,
      });
      if (Array.isArray(frozenProps)) {
        if (frozenProps.length) {
          const props: CSSProperties = {};
          for (const prop of frozenProps) {
            props[prop] = style[prop];
          }
          item.frozenProps = props;
        } else {
          item.frozenProps = null;
        }
      } else {
        item.frozenProps = frozenProps;
      }

      // Lastly, let's compute the unfrozen props. We store the current inline
      // style values for all frozen props so that we can reset them after the
      // drag process is over.
      if (item.frozenProps) {
        const unfrozenProps: CSSProperties = {};
        for (const key in item.frozenProps) {
          if (item.frozenProps.hasOwnProperty(key)) {
            unfrozenProps[key] = element.style[key];
          }
        }
        item.unfrozenProps = unfrozenProps;
      }

      return item;
    });

    // Emit preparestart event.
    this._emit('preparestart', drag.startEvent);
  }

  protected _applyStart() {
    const drag = this.drag;
    if (!drag || !drag.startEvent) return;

    const { container } = this.settings;
    for (const item of drag.items) {
      // Append element within the container element if such is provided.
      if (container && item.element.parentElement !== container) {
        container.appendChild(item.element);
        (item as Writeable<typeof item>).pX += item._containerDiffX;
        (item as Writeable<typeof item>).pY += item._containerDiffY;
      }

      // Freeze element's props if such are provided.
      if (item.frozenProps) {
        Object.assign(item.element.style, item.frozenProps);
      }

      // Set the element's start position.
      this.settings.setPosition({
        phase: 'start',
        draggable: this,
        sensor: drag.sensor!,
        item,
        x: item.pX,
        y: item.pY,
      });
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

    // Emit preparemove event.
    this._emit('preparemove', nextEvent);
  }

  protected _applyMove() {
    const { drag } = this;
    if (!drag || !drag.nextMoveEvent) return;

    // Reset movement diff.
    for (const item of drag.items) {
      (item as Writeable<typeof item>)._moveDiffX = 0;
      (item as Writeable<typeof item>)._moveDiffY = 0;
    }

    // Move the element.
    for (const item of drag.items) {
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
      // Update container diff.
      if (item.elementOffsetContainer !== item.dragOffsetContainer) {
        const { left, top } = getOffsetDiff(
          item.dragOffsetContainer,
          item.elementOffsetContainer,
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
      const elements: (HTMLElement | SVGElement)[] = [];
      for (const item of drag.items) {
        elements.push(item.element);
        if (item.elementContainer && item.element.parentElement !== item.elementContainer) {
          (item as Writeable<typeof item>).pX -= item._containerDiffX;
          (item as Writeable<typeof item>).pY -= item._containerDiffY;
          (item as Writeable<typeof item>)._containerDiffX = 0;
          (item as Writeable<typeof item>)._containerDiffY = 0;
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
