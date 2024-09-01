import { HAS_PASSIVE_EVENTS } from '../constants.js';

import { Emitter, EventListenerId } from 'eventti';

import { Sensor, SensorEvents, SensorEventType } from '../sensors/sensor.js';

import { DraggableDrag } from './draggable-drag.js';

import { DraggableDragItem } from './draggable-drag-item.js';

import { ticker, tickerPhases } from '../singletons/ticker.js';

import { appendElement } from '../utils/append-element.js';

import { roundNumber } from '../utils/round-number.js';

import { resetMatrix } from '../utils/reset-matrix.js';

import { areMatricesEqual } from '../utils/are-matrices-equal.js';

import { isMatrixWarped } from '../utils/is-matrix-warped.js';

import { Writeable, CSSProperties, Point } from '../types.js';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const POSITION_CHANGE = { x: 0, y: 0 };

const ELEMENT_MATRIX = new DOMMatrix();

const TEMP_MATRIX = new DOMMatrix();

enum DragStartPhase {
  None = 0,
  Init = 1,
  StartPrepare = 2,
  FinishApply = 3,
}

enum DraggableStartPredicateState {
  Pending = 0,
  Resolved = 1,
  Rejected = 2,
}

export const DraggableModifierPhase = {
  Start: 'start',
  Move: 'move',
  End: 'end',
} as const;

export type DraggableModifierPhase =
  (typeof DraggableModifierPhase)[keyof typeof DraggableModifierPhase];

export const DraggableApplyPositionPhase = {
  Start: 'start',
  Move: 'move',
  End: 'end',
  Align: 'align',
} as const;

export type DraggableApplyPositionPhase =
  (typeof DraggableApplyPositionPhase)[keyof typeof DraggableApplyPositionPhase];

export type DraggableModifierData<S extends Sensor[], E extends S[number]['events']> = {
  draggable: Draggable<S, E>;
  drag: DraggableDrag<S, E>;
  item: DraggableDragItem<S, E>;
  phase: DraggableModifierPhase;
};

export type DraggableModifier<S extends Sensor[], E extends S[number]['events']> = (
  change: Point,
  data: DraggableModifierData<S, E>,
) => Point;

export interface DraggableSettings<S extends Sensor[], E extends S[number]['events']> {
  container: HTMLElement | null;
  startPredicate: (data: {
    draggable: Draggable<S, E>;
    sensor: S[number];
    event: E['start'] | E['move'];
  }) => boolean | undefined;
  elements: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
  }) => (HTMLElement | SVGSVGElement)[] | null;
  frozenStyles: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
    item: DraggableDragItem<S, E>;
    style: CSSStyleDeclaration;
  }) => CSSProperties | (keyof CSSProperties)[] | null;
  positionModifiers: DraggableModifier<S, E>[];
  applyPosition: (data: {
    draggable: Draggable<S, E>;
    drag: DraggableDrag<S, E>;
    item: DraggableDragItem<S, E>;
    phase: DraggableApplyPositionPhase;
  }) => void;
  onPrepareStart?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onStart?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onPrepareMove?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onMove?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onEnd?: (drag: DraggableDrag<S, E>, draggable: Draggable<S, E>) => void;
  onDestroy?: (draggable: Draggable<S, E>) => void;
}

export interface DraggablePlugin {
  name: string;
  version: string;
}

export type DraggablePluginMap = Record<string, DraggablePlugin | undefined>;

export const DraggableEventType = {
  PrepareStart: 'preparestart',
  Start: 'start',
  PrepareMove: 'preparemove',
  Move: 'move',
  End: 'end',
  Destroy: 'destroy',
} as const;

export type DraggableEventType = (typeof DraggableEventType)[keyof typeof DraggableEventType];

export interface DraggableEventCallbacks<E extends SensorEvents> {
  [DraggableEventType.PrepareStart]: (event: E['start'] | E['move']) => void;
  [DraggableEventType.Start]: (event: E['start'] | E['move']) => void;
  [DraggableEventType.PrepareMove]: (event: E['move']) => void;
  [DraggableEventType.Move]: (event: E['move']) => void;
  [DraggableEventType.End]: (event: E['end'] | E['cancel'] | E['destroy'] | null) => void;
  [DraggableEventType.Destroy]: () => void;
}

export const DraggableDefaultSettings: DraggableSettings<any, any> = {
  container: null,
  startPredicate: () => true,
  elements: () => null,
  frozenStyles: () => null,
  applyPosition: ({ item, phase }) => {
    const isEndPhase = phase === 'end';
    const [containerMatrix, inverseContainerMatrix] = item.getContainerMatrix();
    const [_dragContainerMatrix, inverseDragContainerMatrix] = item.getDragContainerMatrix();
    const {
      position,
      alignmentOffset,
      containerOffset,
      elementTransformMatrix,
      elementTransformOrigin,
    } = item;
    const { x: oX, y: oY, z: oZ } = elementTransformOrigin;
    const needsOriginOffset =
      !elementTransformMatrix.isIdentity && (oX !== 0 || oY !== 0 || oZ !== 0);
    const tX = position.x + alignmentOffset.x + containerOffset.x;
    const tY = position.y + alignmentOffset.y + containerOffset.y;

    // Reset the matrix to identity.
    resetMatrix(ELEMENT_MATRIX);

    // First of all negate the element's transform origin.
    if (needsOriginOffset) {
      if (oZ === 0) {
        ELEMENT_MATRIX.translateSelf(-oX, -oY);
      } else {
        ELEMENT_MATRIX.translateSelf(-oX, -oY, -oZ);
      }
    }

    // Invert the current container's matrix, so we can apply the
    // translation in world space coordinates. If this is the end phase the
    // element will have been appended back to the original container if
    // there was a drag container defined. Otherwise the element will be
    // appended to the drag container (if defined).
    if (isEndPhase) {
      if (!inverseContainerMatrix.isIdentity) {
        ELEMENT_MATRIX.multiplySelf(inverseContainerMatrix);
      }
    } else {
      if (!inverseDragContainerMatrix.isIdentity) {
        ELEMENT_MATRIX.multiplySelf(inverseDragContainerMatrix);
      }
    }

    // Apply the translation (in world space coordinates).
    resetMatrix(TEMP_MATRIX).translateSelf(tX, tY);
    ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);

    // Apply the element's original container's world matrix so we can apply
    // the element's original transform as if it was in the original
    // container's local space coordinates.
    if (!containerMatrix.isIdentity) {
      ELEMENT_MATRIX.multiplySelf(containerMatrix);
    }

    // Undo the transform origin negation.
    if (needsOriginOffset) {
      resetMatrix(TEMP_MATRIX).translateSelf(oX, oY, oZ);
      ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);
    }

    // Apply the element's original transform.
    if (!elementTransformMatrix.isIdentity) {
      ELEMENT_MATRIX.multiplySelf(elementTransformMatrix);
    }

    // Apply the matrix to the element.
    item.element.style.transform = `${ELEMENT_MATRIX}`;
  },
  positionModifiers: [],
} as const;

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
    this._startPhase = DragStartPhase.None;
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
        predicateState: DraggableStartPredicateState.Pending,
        predicateEvent: null,
        onMove: (e) => this._onMove(e, sensor),
        onEnd: (e) => this._onEnd(e, sensor),
      });
      const { onMove, onEnd } = this._sensorData.get(sensor)!;
      sensor.on(SensorEventType.Start, onMove, onMove);
      sensor.on(SensorEventType.Move, onMove, onMove);
      sensor.on(SensorEventType.Cancel, onEnd, onEnd);
      sensor.on(SensorEventType.End, onEnd, onEnd);
      sensor.on(SensorEventType.Destroy, onEnd, onEnd);
    });
  }

  protected _parseSettings(
    options?: Partial<this['settings']>,
    defaults: this['settings'] = DraggableDefaultSettings,
  ): this['settings'] {
    const {
      container = defaults.container,
      startPredicate = defaults.startPredicate,
      elements = defaults.elements,
      frozenStyles = defaults.frozenStyles,
      positionModifiers = defaults.positionModifiers,
      applyPosition = defaults.applyPosition,
      onPrepareStart = defaults.onPrepareStart,
      onStart = defaults.onStart,
      onPrepareMove = defaults.onPrepareMove,
      onMove = defaults.onMove,
      onEnd = defaults.onEnd,
      onDestroy = defaults.onDestroy,
    } = options || {};

    return {
      container,
      startPredicate,
      elements,
      frozenStyles,
      positionModifiers,
      applyPosition,
      onPrepareStart,
      onStart,
      onPrepareMove,
      onMove,
      onEnd,
      onDestroy,
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
      case DraggableStartPredicateState.Pending: {
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
      case DraggableStartPredicateState.Resolved: {
        // Move the element if dragging is active.
        if (this.drag) {
          (this.drag as Writeable<typeof this.drag>).moveEvent = e;
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
      sensorData.predicateState = DraggableStartPredicateState.Pending;
      sensorData.predicateEvent = null;
    }
    // Otherwise, if drag is active AND the sensor is the one that triggered the
    // drag process, let's reset all sensors' start predicate states.
    else if (sensorData.predicateState === DraggableStartPredicateState.Resolved) {
      (this.drag as Writeable<typeof this.drag>).endEvent = e;
      this._sensorData.forEach((data) => {
        data.predicateState = DraggableStartPredicateState.Pending;
        data.predicateEvent = null;
      });
      this.stop();
    }
  }

  protected _prepareStart() {
    const drag = this.drag;
    if (!drag) return;

    // Update start phase.
    this._startPhase = DragStartPhase.StartPrepare;

    // Get elements that we'll need to move with the drag.
    // NB: It is okay if there are no elements and thus no items. The drag
    // process will process as usual, but no elements will be moved.
    const elements =
      this.settings.elements({
        draggable: this,
        drag,
      }) || [];

    // Create drag items.
    (drag as Writeable<typeof drag>).items = elements.map((element) => {
      return new DraggableDragItem(element, this);
    });

    // Apply modifiers for the start phase.
    this._applyModifiers(DraggableModifierPhase.Start, 0, 0);

    // Emit preparestart event.
    this._emit(DraggableEventType.PrepareStart, drag.startEvent);

    // Call onPrepareStart callback.
    this.settings.onPrepareStart?.(drag, this);
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
      if (item.frozenStyles) {
        Object.assign(item.element.style, item.frozenStyles);
      }

      // Set element's start position.
      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.Start,
        draggable: this,
        drag,
        item,
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

      // We can also skip computation if both matrices contain only 2D
      // translations.
      if (!isMatrixWarped(containerMatrix) && !isMatrixWarped(dragContainerMatrix)) {
        continue;
      }

      const rect = item.element.getBoundingClientRect();
      const { alignmentOffset } = item;

      // Round the align diff to nearest 3rd decimal to avoid applying it if the
      // value is so small that it's not visible.
      alignmentOffset.x += roundNumber(item.clientRect.x - rect.x, 3);
      alignmentOffset.y += roundNumber(item.clientRect.y - rect.y, 3);
    }

    // Apply start offset (if needed).
    for (const item of drag.items) {
      const { alignmentOffset } = item;
      if (alignmentOffset.x !== 0 || alignmentOffset.y !== 0) {
        this.settings.applyPosition({
          phase: DraggableApplyPositionPhase.Align,
          draggable: this,
          drag,
          item,
        });
      }
    }

    // Bind scroll listeners.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Update start phase.
    this._startPhase = DragStartPhase.FinishApply;

    // Emit start event.
    this._emit(DraggableEventType.Start, drag.startEvent);

    // Call onStart callback.
    this.settings.onStart?.(drag, this);
  }

  protected _prepareMove() {
    const drag = this.drag;
    if (!drag) return;

    // Get next event and previous event so we can compute the movement
    // difference between the clientX/Y values.
    const { moveEvent, prevMoveEvent } = drag;
    if (moveEvent === prevMoveEvent) return;

    // Apply modifiers for the move phase.
    this._applyModifiers(
      DraggableModifierPhase.Move,
      moveEvent.x - prevMoveEvent.x,
      moveEvent.y - prevMoveEvent.y,
    );

    // Emit preparemove event.
    this._emit(DraggableEventType.PrepareMove, moveEvent as E['move']);

    // Call onPrepareMove callback.
    this.settings.onPrepareMove?.(drag, this);

    // Store next move event as previous move event.
    (drag as Writeable<typeof drag>).prevMoveEvent = moveEvent;
  }

  protected _applyMove() {
    const drag = this.drag;
    if (!drag) return;

    // Reset movement diff and move the element.
    for (const item of drag.items) {
      item['_moveDiff'].x = 0;
      item['_moveDiff'].y = 0;

      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.Move,
        draggable: this,
        drag,
        item,
      });
    }

    // Emit move event.
    this._emit(DraggableEventType.Move, drag.moveEvent as E['move']);

    // Call onMove callback.
    this.settings.onMove?.(drag, this);
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
      item.alignmentOffset.x = item.alignmentOffset.x - item['_alignDiff'].x + alignDiffX;
      item['_alignDiff'].x = alignDiffX;

      // Update vertical position data.
      const alignDiffY = item.clientRect.y - item['_moveDiff'].y - y;
      item.alignmentOffset.y = item.alignmentOffset.y - item['_alignDiff'].y + alignDiffY;
      item['_alignDiff'].y = alignDiffY;
    }
  }

  protected _applyAlign() {
    const { drag } = this;
    if (!drag) return;

    for (const item of drag.items) {
      item['_alignDiff'].x = 0;
      item['_alignDiff'].y = 0;

      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.Align,
        draggable: this,
        drag,
        item,
      });
    }
  }

  _applyModifiers(phase: DraggableModifierPhase, changeX: number, changeY: number) {
    const { drag } = this;
    if (!drag) return;

    const { positionModifiers } = this.settings;
    for (const item of drag.items) {
      let positionChange = POSITION_CHANGE;
      positionChange.x = changeX;
      positionChange.y = changeY;
      for (const modifier of positionModifiers) {
        positionChange = modifier(positionChange, {
          draggable: this,
          drag,
          item,
          phase,
        });
      }
      item.position.x += positionChange.x;
      item.position.y += positionChange.y;
      item.clientRect.x += positionChange.x;
      item.clientRect.y += positionChange.y;
      if (phase === 'move') {
        item['_moveDiff'].x += positionChange.x;
        item['_moveDiff'].y += positionChange.y;
      }
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

    if (sensorData.predicateState === DraggableStartPredicateState.Pending && startEvent) {
      //  Update start phase.
      this._startPhase = DragStartPhase.Init;

      // Resolve the provided sensor's start predicate.
      sensorData.predicateState = DraggableStartPredicateState.Resolved;
      sensorData.predicateEvent = null;

      (this as Writeable<this>).drag = new DraggableDrag(sensor, startEvent);

      // Reject other sensors' start predicates.
      this._sensorData.forEach((data, s) => {
        if (s === sensor) return;
        data.predicateState = DraggableStartPredicateState.Rejected;
        data.predicateEvent = null;
      });

      // Queue drag start.
      ticker.once(tickerPhases.read, this._prepareStart, this._startId);
      ticker.once(tickerPhases.write, this._applyStart, this._startId);
    }
  }

  rejectStartPredicate(sensor: S[number]) {
    const sensorData = this._sensorData.get(sensor);
    if (sensorData?.predicateState === DraggableStartPredicateState.Pending) {
      sensorData.predicateState = DraggableStartPredicateState.Rejected;
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
    if (this._startPhase === DragStartPhase.StartPrepare) {
      this.off(DraggableEventType.Start, this._startId);
      this.on(DraggableEventType.Start, () => this.stop(), this._startId);
      return;
    }

    // Reset drag start phase.
    this._startPhase = DragStartPhase.None;

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
    // reset the container offset. Let's do this procedure in a separate loop to
    // avoid layout thrashing.
    drag['_clientOffsetCache'].clear();
    for (const item of drag.items) {
      if (item.elementContainer !== item.dragContainer) {
        const { x: startX, y: startY } = item.containerOffset;
        item['_updateContainerOffset']();
        const { x: endX, y: endY } = item.containerOffset;
        item.alignmentOffset.x = startX - endX;
        item.alignmentOffset.y = startY - endY;
        item.containerOffset.x = 0;
        item.containerOffset.y = 0;
      }
    }

    // Apply modifiers for the end phase.
    this._applyModifiers(DraggableModifierPhase.End, 0, 0);

    // Move elements within the root container.
    for (const item of drag.items) {
      if (item.elementContainer !== item.dragContainer) {
        appendElement(item.element, item.elementContainer);
      }

      // Unfreeze element's props if such are provided.
      if (item.unfrozenStyles) {
        for (const key in item.unfrozenStyles) {
          item.element.style[key] = item.unfrozenStyles[key] || '';
        }
      }

      // Set final position after drag.
      this.settings.applyPosition({
        phase: DraggableApplyPositionPhase.End,
        draggable: this,
        drag,
        item,
      });
    }

    // Emit end event.
    this._emit(DraggableEventType.End, drag.endEvent);

    // Call onEnd callback.
    this.settings.onEnd?.(drag, this);

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
      sensor.off(SensorEventType.Start, onMove);
      sensor.off(SensorEventType.Move, onMove);
      sensor.off(SensorEventType.Cancel, onEnd);
      sensor.off(SensorEventType.End, onEnd);
      sensor.off(SensorEventType.Destroy, onEnd);
    });

    this._sensorData.clear();

    this._emit(DraggableEventType.Destroy);

    this.settings.onDestroy?.(this);

    this._emitter.off();
  }
}
