import { HAS_PASSIVE_EVENTS } from '../constants.js';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents } from '../sensors/sensor.js';

import { DraggableDrag } from './draggable-drag.js';

import { DraggableDragItem } from './draggable-drag-item.js';

import { ticker, tickerPhases } from '../singletons/ticker.js';

import { appendElement } from 'utils/append-element.js';

import { roundNumber } from 'utils/round-number.js';

import { Writeable, CSSProperties, Point } from '../types.js';
import { areMatricesEqual } from 'utils/are-matrices-equal.js';

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
    // TODO: This will create quite large matrix strings and is potentially
    // called a lot. We should probably avoid using `setMatrixValue` and instead
    // use the other `DOMMatrix` methods directly manipulating the matrix.
    // Benchmark before changing.
    setPosition: ({ item, x, y, phase }) => {
      const isEndPhase = phase === 'end';
      const [containerMatrix, inverseContainerMatrix] = item.getContainerMatrix();
      const [_dragContainerMatrix, inverseDragContainerMatrix] = item.getDragContainerMatrix();
      const { startOffset, containerOffset, elementTransformMatrix, elementTransformOrigin } = item;
      const { x: oX, y: oY, z: oZ } = elementTransformOrigin;
      const hasTransformOrigin = oX !== 0 || oY !== 0 || oZ !== 0;
      const tX = isEndPhase ? x : containerOffset.x + (x - startOffset.x);
      const tY = isEndPhase ? y : containerOffset.y + (y - startOffset.y);
      let matrixValue = '';

      // First of all negate the element's transform origin.
      if (hasTransformOrigin) {
        if (oZ === 0) {
          matrixValue += `translate(${oX * -1}px, ${oY * -1}px) `;
        } else {
          matrixValue += `translate3d(${oX * -1}px, ${oY * -1}px, ${oZ * -1}px) `;
        }
      }

      // Invert the current container's matrix, so we can apply the
      // translation in world space coordinates. If this is the end phase the
      // element will have been appended back to the original container if
      // there was a drag container defined. Otherwise the element will be
      // appended to the drag container (if defined).
      if (isEndPhase) {
        if (!inverseContainerMatrix.isIdentity) {
          matrixValue += `${inverseContainerMatrix} `;
        }
      } else {
        if (!inverseDragContainerMatrix.isIdentity) {
          matrixValue += `${inverseDragContainerMatrix} `;
        }
      }

      // Apply the translation (in world space coordinates).
      matrixValue += `translate(${tX}px, ${tY}px) `;

      // Apply the element's original container's world matrix so we can apply
      // the element's original transform as if it was in the original
      // container's local space coordinates.
      if (!containerMatrix.isIdentity) {
        matrixValue += `${containerMatrix} `;
      }

      // Undo the tranform origin negation.
      if (hasTransformOrigin) {
        if (oZ === 0) {
          matrixValue += `translate(${oX}px, ${oY}px) `;
        } else {
          matrixValue += `translate3d(${oX}px, ${oY}px, ${oZ}px) `;
        }
      }

      // Apply the element's original transform.
      if (!elementTransformMatrix.isIdentity) {
        matrixValue += `${elementTransformMatrix} `;
      }

      // Create the final matrix value.
      DOM_MATRIX.setMatrixValue(matrixValue.trim());

      // Apply the matrix to the element.
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
    phase: 'start' | 'move' | 'end' | 'align' | 'start-align';
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
          (this.drag as Writeable<typeof this.drag>).event = e;
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
      (this.drag as Writeable<typeof this.drag>).endEvent = e;
      this._sensorData.forEach((data) => {
        data.predicateState = DraggableStartPredicateState.PENDING;
        data.predicateEvent = null;
      });
      this.stop();
    }
  }

  protected _prepareStart() {
    const drag = this.drag;
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
    (drag as Writeable<typeof drag>).items = elements.map((element) => {
      return new DraggableDragItem(element, this);
    });

    // Emit preparestart event.
    this._emit('preparestart', drag.startEvent);
  }

  protected _applyStart() {
    const drag = this.drag;
    if (!drag) return;

    for (const item of drag.items) {
      // Append element within the container element if such is provided.
      if (item.dragContainer !== item.elementContainer) {
        appendElement(item.element, item.dragContainer);
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
        item,
        x: item.position.x,
        y: item.position.y,
      });
    }

    // Compute the start offset (if needed).
    for (const item of drag.items) {
      const containerMatrix = item.getContainerMatrix()[0];
      const dragContainerMatrix = item.getDragContainerMatrix()[0];

      // If both container matrices are equal, we can skip the computation.
      if (areMatricesEqual(containerMatrix, dragContainerMatrix)) {
        continue;
      }

      // TODO: We can probably also skip computation if both matrices contain
      // only translations.

      const rect = item.element.getBoundingClientRect();
      const { startOffset } = item;

      // Round the align diff to nearest 3rd decimal to avoid applying it if the
      // value is so small that it's not visible.
      startOffset.x = roundNumber(rect.x - item.clientRect.x, 3);
      startOffset.y = roundNumber(rect.y - item.clientRect.y, 3);
    }

    // Apply start offset (if needed).
    for (const item of drag.items) {
      const { startOffset } = item;
      if (startOffset.x !== 0 || startOffset.y !== 0) {
        this.settings.setPosition({
          phase: 'start-align',
          draggable: this,
          sensor: drag.sensor,
          item,
          x: item.position.x,
          y: item.position.y,
        });
      }
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Update start phase.
    this._startPhase = DragStartPhase.FINISH_APPLY;

    // Emit start event.
    this._emit('start', drag.startEvent);
  }

  protected _prepareMove() {
    const drag = this.drag;
    if (!drag) return;

    // Get next event and previous event so we can compute the movement
    // difference between the clientX/Y values.
    const { event, prevEvent, startEvent, sensor } = drag;
    if (event === prevEvent) return;

    for (const item of drag.items) {
      // Compute how much x and y needs to be transformed.
      const { x: changeX, y: changeY } = this.settings.getPositionChange({
        draggable: this,
        sensor,
        item,
        event,
        prevEvent,
        startEvent,
      });

      // Update horizontal position data.
      if (changeX) {
        item.position.x += changeX;
        item.clientRect.x += changeX;
        item['_moveDiff'].x += changeX;
      }

      // Update vertical position data.
      if (changeY) {
        item.position.y += changeY;
        item.clientRect.y += changeY;
        item['_moveDiff'].y += changeY;
      }
    }

    // Store next event as previous event.
    (drag as Writeable<typeof drag>).prevEvent = event;

    // Emit preparemove event.
    this._emit('preparemove', event as E['move']);
  }

  protected _applyMove() {
    const drag = this.drag;
    if (!drag) return;

    // Reset movement diff and move the element.
    for (const item of drag.items) {
      item['_moveDiff'].x = 0;
      item['_moveDiff'].y = 0;

      this.settings.setPosition({
        phase: 'move',
        draggable: this,
        sensor: drag.sensor,
        item,
        x: item.position.x,
        y: item.position.y,
      });
    }

    // Emit move event.
    if (drag.event) {
      this._emit('move', drag.event as E['move']);
    }
  }

  protected _prepareAlign() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items) {
      const { x, y } = item.element.getBoundingClientRect();

      // Note that we INTENTIONALLY DO NOT UPDATE THE CLIENT RECT COORDINATES
      // here. The point of this method is to update the POSITION of the
      // draggable item based on how much the client rect has drifted so that
      // the element is visually repostioned to the correct place.

      // Update horizontal position data.
      const alignDiffX = item.clientRect.x - item['_moveDiff'].x - x;
      item.position.x = item.position.x - item['_alignDiff'].x + alignDiffX;
      item['_alignDiff'].x = alignDiffX;

      // Update vertical position data.
      const alignDiffY = item.clientRect.y - item['_moveDiff'].y - y;
      item.position.y = item.position.y - item['_alignDiff'].y + alignDiffY;
      item['_alignDiff'].y = alignDiffY;
    }
  }

  protected _applyAlign() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items) {
      item['_alignDiff'].x = 0;
      item['_alignDiff'].y = 0;

      this.settings.setPosition({
        phase: 'align',
        draggable: this,
        sensor: drag.sensor,
        item,
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
    const drag = this.drag;
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
    (drag as Writeable<typeof drag>).isEnded = true;

    // Cancel all queued ticks.
    ticker.off(tickerPhases.read, this._startId);
    ticker.off(tickerPhases.write, this._startId);
    ticker.off(tickerPhases.read, this._moveId);
    ticker.off(tickerPhases.write, this._moveId);
    ticker.off(tickerPhases.read, this._alignId);
    ticker.off(tickerPhases.write, this._alignId);

    // Unbind scroll listener.
    window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Adjust items' positions for the drop. When the drag starts the container
    // offset is computed once, but not updated during drag (because we don't
    // need to). But on drop we need to how much the offset diff has changed
    // from the start and then add the diff to the item's position, and finally
    // reset the container offser. Let's do this procedure in a separate loop to
    // avoid layout thrashing.
    drag['_clientOffsetCache'].clear();
    for (const item of drag.items) {
      if (item.elementContainer !== item.dragContainer) {
        const { x: startX, y: startY } = item.containerOffset;
        item.updateContainerOffset();
        const { x: endX, y: endY } = item.containerOffset;
        item.position.x += (endX - startX) * -1;
        item.position.y += (endY - startY) * -1;
        item.containerOffset.x = 0;
        item.containerOffset.y = 0;
      }
    }

    // Move elements within the root container and collect all elements
    // to an elements array.
    const elements: (HTMLElement | SVGSVGElement)[] = [];
    for (const item of drag.items) {
      elements.push(item.element);

      if (item.elementContainer !== item.dragContainer) {
        appendElement(item.element, item.elementContainer);
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
        item,
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

    // Remove measure elements.
    drag['_measureElements'].forEach((el) => el.remove());

    // Emit end event.
    this._emit('end', drag.endEvent);

    // Reset drag data.
    (this as Writeable<this>).drag = null;
  }

  align(instant = false) {
    if (!this.drag) return;
    if (instant) {
      this._prepareAlign();
      this._applyAlign();
    } else {
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
