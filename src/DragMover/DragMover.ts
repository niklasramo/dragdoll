import { HAS_PASSIVE_EVENTS } from '../constants';

import { TickCallback } from '../Ticker';

import { Emitter } from '../Emitter';

import { DragMoverData } from './DragMoverData';

import { DragMoverAutoScrollProxy } from './DragMoverAutoScrollProxy';

import { DragSensor, DragSensorEvents } from '../DragSensor/DragSensor';

import {
  AutoScrollItemSpeedCallback,
  AutoScrollItemEventCallback,
  AutoScrollItemTarget,
  smoothSpeed,
} from '../AutoScroll/AutoScrollItem';

import { autoScroll } from '../singletons/autoScroll';

import { readQueue, writeQueue } from '../singletons/ticker';

import { getContainingBlock } from '../utils/getContainingBlock';

import { getOffsetDiff } from '../utils/getOffsetDiff';

import { getTranslate } from '../utils/getTranslate';

import { createTranslate } from '../utils/createTranslate';

import { Writeable } from '../types';

const SCROLL_LISTENER_OPTIONS = HAS_PASSIVE_EVENTS ? { capture: true, passive: true } : true;

const OFFSET_DIFF = { left: 0, top: 0 };

const DEFAULT_SETTINGS: DragMoverSettings<any> = {
  container: null,
  axis: 'xy',
  startPredicate: () => true,
  getPosition: (element) => getTranslate(element),
  renderPosition: (element, x, y) => {
    element.style.transform = createTranslate(x, y, true);
  },
  addReadOperation: (callback) => readQueue.add(callback),
  cancelReadOperation: (callback) => readQueue.remove(callback),
  addWriteOperation: (callback) => writeQueue.add(callback),
  cancelWriteOperation: (callback) => writeQueue.remove(callback),
  autoScroll: {
    targets: [],
    safeZone: 0.2,
    speed: smoothSpeed(1000, 2000, 2500),
    smoothStop: false,
    onStart: null,
    onStop: null,
  },
};

let uid = 0;

enum StartPredicateState {
  pending = 0,
  resolved = 1,
  rejected = 2,
}

interface DragMoverEventCallbacks<T extends DragSensorEvents> {
  beforestart(event: T['start'] | T['move']): void;
  start(event: T['start'] | T['move']): void;
  beforemove(event: T['move']): void;
  move(event: T['move']): void;
  end(event: T['cancel'] | T['end'] | T['abort'] | T['destroy'] | null): void;
}

interface AutoScrollSettings<T extends DragSensorEvents> {
  targets: AutoScrollItemTarget[] | ((dragMover: DragMover<T>) => AutoScrollItemTarget[]);
  safeZone: number;
  speed: number | AutoScrollItemSpeedCallback;
  smoothStop: boolean;
  onStart: AutoScrollItemEventCallback | null;
  onStop: AutoScrollItemEventCallback | null;
}

interface DragMoverSettings<T extends DragSensorEvents> {
  container: HTMLElement | null;
  axis: 'x' | 'y' | 'xy';
  getPosition: (element: HTMLElement) => { x: number; y: number };
  renderPosition: (element: HTMLElement, x: number, y: number) => void;
  startPredicate: (e: T['start'] | T['move'], element: HTMLElement) => boolean | undefined | void;
  addReadOperation: (callback: TickCallback) => void;
  cancelReadOperation: (callback: TickCallback) => void;
  addWriteOperation: (callback: TickCallback) => void;
  cancelWriteOperation: (callback: TickCallback) => void;
  autoScroll: AutoScrollSettings<T>;
}

interface DragMoverOptions<T extends DragSensorEvents> {
  container?: DragMoverSettings<T>['container'];
  axis?: DragMoverSettings<T>['axis'];
  getPosition?: DragMoverSettings<T>['getPosition'];
  renderPosition?: DragMoverSettings<T>['renderPosition'];
  startPredicate?: DragMoverSettings<T>['startPredicate'];
  addReadOperation?: DragMoverSettings<T>['addReadOperation'];
  cancelReadOperation?: DragMoverSettings<T>['cancelReadOperation'];
  addWriteOperation?: DragMoverSettings<T>['addWriteOperation'];
  cancelWriteOperation?: DragMoverSettings<T>['cancelWriteOperation'];
  autoScroll?: Partial<AutoScrollSettings<T>> | null;
}

function parseAutoScrollSettings<T extends DragSensorEvents>(
  autoScrollOptions: Partial<AutoScrollSettings<T>> | null
) {
  const {
    targets = [],
    safeZone = 0.2,
    speed = smoothSpeed(1000, 2000, 2500),
    smoothStop = false,
    onStart = null,
    onStop = null,
  } = (autoScrollOptions || {}) as Partial<AutoScrollSettings<T>>;

  return {
    targets,
    safeZone,
    speed,
    smoothStop,
    onStart,
    onStop,
  };
}

function parseSettings<T extends DragSensorEvents>(
  options: DragMoverOptions<T>,
  defaults: DragMoverSettings<T> = DEFAULT_SETTINGS
) {
  const {
    container = defaults.container,
    axis = defaults.axis,
    getPosition = defaults.getPosition,
    renderPosition = defaults.renderPosition,
    startPredicate = defaults.startPredicate,
    addReadOperation = defaults.addReadOperation,
    cancelReadOperation = defaults.cancelReadOperation,
    addWriteOperation = defaults.addWriteOperation,
    cancelWriteOperation = defaults.cancelWriteOperation,
    autoScroll = defaults.autoScroll,
  } = options;

  return {
    container,
    axis,
    getPosition,
    renderPosition,
    startPredicate,
    addReadOperation,
    cancelReadOperation,
    addWriteOperation,
    cancelWriteOperation,
    autoScroll: parseAutoScrollSettings<T>(autoScroll),
  };
}

// TODO: Allow providing multiple drag sensors!
// TODO: Support cloned element drag UX.
// TODO: Support drag placeholder UX.
export class DragMover<T extends DragSensorEvents> {
  readonly id: number;
  readonly element: HTMLElement;
  readonly settings: DragMoverSettings<T>;
  readonly dragSensor: DragSensor<T>;
  protected _emitter: Emitter;
  protected _data: DragMoverData<T> | null;
  protected _autoScrollProxy: DragMoverAutoScrollProxy<T> | null;
  protected _startPredicateState: StartPredicateState;
  protected _isDestroyed: boolean;

  constructor(element: HTMLElement, dragSensor: DragSensor<T>, options: DragMoverOptions<T> = {}) {
    this.id = ++uid;
    this.element = element;
    this.dragSensor = dragSensor;
    this.settings = parseSettings<T>(options);

    this._emitter = new Emitter();
    this._data = null;
    this._autoScrollProxy = null;
    this._startPredicateState = StartPredicateState.pending;
    this._isDestroyed = false;

    // Bind methods (that need binding).
    this._onMove = this._onMove.bind(this);
    this._onScroll = this._onScroll.bind(this);
    this._onEnd = this._onEnd.bind(this);
    this._prepareStart = this._prepareStart.bind(this);
    this._applyStart = this._applyStart.bind(this);
    this._prepareMove = this._prepareMove.bind(this);
    this._applyMove = this._applyMove.bind(this);
    this._prepareSync = this._prepareSync.bind(this);
    this._applySync = this._applySync.bind(this);

    // Bind drag sensor events.
    this.dragSensor.on('start', this._onMove as (e: T['start']) => void);
    this.dragSensor.on('move', this._onMove as (e: T['move']) => void);
    this.dragSensor.on('end', this._onEnd as (e: T['end']) => void);
    this.dragSensor.on('cancel', this._onEnd as (e: T['cancel']) => void);
    this.dragSensor.on('abort', this._onEnd as (e: T['abort']) => void);
    this.dragSensor.on('destroy', this._onEnd as (e: T['destroy']) => void);
  }

  protected _emit<K extends keyof DragMoverEventCallbacks<T>>(
    type: K,
    e: Parameters<DragMoverEventCallbacks<T>[K]>[0]
  ) {
    this._emitter.emit(type, e);
  }

  protected _onMove(e: T['start'] | T['move']) {
    switch (this._startPredicateState) {
      case StartPredicateState.pending: {
        const shouldStart = this.settings.startPredicate(e, this.element);

        // Resolve procedure (start move process).
        if (shouldStart === true) {
          this._startPredicateState = StartPredicateState.resolved;
          this._data = new DragMoverData();
          this._data.startEvent = e;
          this.settings.addReadOperation(this._prepareStart);
          this.settings.addWriteOperation(this._applyStart);
        }
        // Reject procedure.
        else if (shouldStart === false) {
          this._startPredicateState = StartPredicateState.rejected;
        }
        break;
      }
      case StartPredicateState.resolved: {
        // Move the element if dragging is active.
        if (this._data) {
          this._data.nextMoveEvent = e as T['move'];
          this.settings.addReadOperation(this._prepareMove);
          this.settings.addWriteOperation(this._applyMove);
        }
        break;
      }
    }
  }

  protected _onScroll() {
    this.sync();
  }

  protected _onEnd(e: T['cancel'] | T['end'] | T['abort'] | T['destroy']) {
    if (this._data) {
      this._data.endEvent = e;
    }

    this._startPredicateState = StartPredicateState.pending;

    if (e.type === 'destroy') {
      this.destroy();
    } else {
      this.stop();
    }
  }

  protected _prepareStart() {
    const data = this._data;
    if (!data) return;

    // Get element's parent.
    const rootParent = this.element.parentNode as HTMLElement;
    data.rootParent = rootParent;

    // Get parent's containing block.
    const rootContainingBlock = getContainingBlock(rootParent);
    data.rootContainingBlock = rootContainingBlock;

    // Get element's drag parent.
    const dragParent = this.settings.container || rootParent;
    data.dragParent = dragParent;

    // Get drag container's containing block.
    const dragContainingBlock =
      dragParent === rootParent ? rootContainingBlock : getContainingBlock(dragParent);
    data.dragContainingBlock = dragContainingBlock;

    // Compute element's current elementX/Y.
    const position = this.settings.getPosition(this.element);
    data.elementX = position.x;
    data.elementY = position.y;

    // Compute the element's current clientX/Y.
    const clientRect = this.element.getBoundingClientRect();
    data.elementClientX = clientRect.left;
    data.elementClientY = clientRect.top;

    // If parent's containing block is different than drag container's
    // containing block let's compute the offset difference between the
    // containing blocks.
    if (rootContainingBlock !== dragContainingBlock) {
      const { left, top } = getOffsetDiff(dragContainingBlock, rootContainingBlock, OFFSET_DIFF);
      data.containerDiffX = left;
      data.containerDiffY = top;
    }
  }

  protected _applyStart() {
    let data = this._data;
    if (!data || !data.startEvent) return;

    // Emit beforestart event.
    this._emit('beforestart', data.startEvent);

    // Make sure drag is still active after beforestart event is dispatched.
    data = this._data;
    if (!data || !data.startEvent) return;

    // Append element within the container element if such is provided.
    const { container } = this.settings;
    if (container && this.element.parentNode !== container) {
      container.appendChild(this.element);
      data.elementX += data.containerDiffX;
      data.elementY += data.containerDiffY;
      this.settings.renderPosition(this.element, data.elementX, data.elementY);
    }

    // Bind scroll handlers.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Register drag mover instance to auto-scroller.
    if (!this._autoScrollProxy) {
      this._autoScrollProxy = new DragMoverAutoScrollProxy(this);
      autoScroll.addItem(this._autoScrollProxy);
    }

    // Mark drag as started.
    data.isStarted = true;

    // Emit start event.
    this._emit('start', data.startEvent);
  }

  protected _prepareMove() {
    const data = this._data;
    if (!data) return;

    // Get next event and previout event so we can compute the movement
    // difference between the clientX/Y values.
    const nextEvent = data.nextMoveEvent;
    const prevEvent = data.prevMoveEvent || data.startEvent || nextEvent;
    if (!nextEvent || !prevEvent || nextEvent === prevEvent) return;

    const { axis } = this.settings;

    // Update horizontal position data.
    if (axis !== 'y') {
      const moveDiffX = nextEvent.clientX - prevEvent.clientX;
      data.elementX = data.elementX - data.moveDiffX + moveDiffX;
      data.elementClientX = data.elementClientX - data.moveDiffX + moveDiffX;
      data.moveDiffX = moveDiffX;
    }

    // Update vertical position data.
    if (axis !== 'x') {
      const moveDiffY = nextEvent.clientY - prevEvent.clientY;
      data.elementY = data.elementY - data.moveDiffY + moveDiffY;
      data.elementClientY = data.elementClientY - data.moveDiffY + moveDiffY;
      data.moveDiffY = moveDiffY;
    }

    // Store next event as previous event.
    data.prevMoveEvent = nextEvent;
  }

  protected _applyMove() {
    let data = this._data;
    if (!data || !data.nextMoveEvent) return;

    // Reset movement diff.
    data.moveDiffX = 0;
    data.moveDiffY = 0;

    // Emit beforemove event.
    this._emit('beforemove', data.nextMoveEvent);

    // Make sure drag is still active after beforemove event is dispatched.
    data = this._data;
    if (!data || !data.nextMoveEvent) return;

    // Move the element.
    this.settings.renderPosition(this.element, data.elementX, data.elementY);

    // Emit move event.
    this._emit('move', data.nextMoveEvent);
  }

  protected _prepareSync() {
    const data = this._data;
    if (!data) return;

    // Update container diff.
    if (data.rootContainingBlock !== data.dragContainingBlock) {
      const { left, top } = getOffsetDiff(
        data.dragContainingBlock as HTMLElement | Document,
        data.rootContainingBlock as HTMLElement | Document,
        OFFSET_DIFF
      );
      data.containerDiffX = left;
      data.containerDiffY = top;
    }

    const { axis } = this.settings;
    const { left, top } = this.element.getBoundingClientRect();

    // Update horizontal position data.
    if (axis !== 'y') {
      const syncDiffX = data.elementClientX - data.moveDiffX - data.syncDiffX - left;
      data.elementX = data.elementX - data.syncDiffX + syncDiffX;
      data.syncDiffX = syncDiffX;
    }

    // Update vertical position data.
    if (axis !== 'x') {
      const syncDiffY = data.elementClientY - data.moveDiffY - data.syncDiffY - top;
      data.elementY = data.elementY - data.syncDiffY + syncDiffY;
      data.syncDiffY = syncDiffY;
    }
  }

  protected _applySync() {
    const data = this._data;
    if (!data) return;

    data.syncDiffX = 0;
    data.syncDiffY = 0;

    this.settings.renderPosition(this.element, data.elementX, data.elementY);
  }

  isActive() {
    return !!this._data;
  }

  getData() {
    return this._data;
  }

  on<K extends keyof DragMoverEventCallbacks<T>>(
    event: K,
    listener: DragMoverEventCallbacks<T>[K]
  ): void {
    this._emitter.on(event, listener);
  }

  off<K extends keyof DragMoverEventCallbacks<T>>(
    event: K,
    listener: DragMoverEventCallbacks<T>[K]
  ): void {
    this._emitter.off(event, listener);
  }

  sync(synchronously = false) {
    if (!this._data) return;
    if (synchronously) {
      this.settings.cancelReadOperation(this._prepareSync);
      this.settings.cancelWriteOperation(this._applySync);
      this._prepareSync();
      this._applySync();
    } else {
      this.settings.addReadOperation(this._prepareSync);
      this.settings.addWriteOperation(this._applySync);
    }
  }

  stop() {
    const data = this._data;
    if (!data) return;

    const { endEvent } = data;

    if (this._autoScrollProxy) {
      autoScroll.removeItem(this._autoScrollProxy);
      this._autoScrollProxy = null;
    }

    this.settings.cancelReadOperation(this._prepareStart);
    this.settings.cancelWriteOperation(this._applyStart);
    this.settings.cancelReadOperation(this._prepareMove);
    this.settings.cancelWriteOperation(this._applyMove);
    this.settings.cancelReadOperation(this._prepareSync);
    this.settings.cancelWriteOperation(this._applySync);

    if (data.isStarted) {
      window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);
      if (data.rootParent && this.element.parentNode !== data.rootParent) {
        data.elementX -= data.containerDiffX;
        data.elementY -= data.containerDiffY;
        data.containerDiffX = 0;
        data.containerDiffY = 0;
        data.rootParent.appendChild(this.element);
        this.settings.renderPosition(this.element, data.elementX, data.elementY);
      }
    }

    this._data = null;

    this._emit('end', endEvent);
  }

  updateSettings(options: DragMoverOptions<T> = {}) {
    (this as Writeable<this>).settings = parseSettings<T>(options, this.settings);
  }

  destroy() {
    if (this._isDestroyed) return;
    this._isDestroyed = true;

    this.stop();

    this.dragSensor.off('start', this._onMove as (e: T['start']) => void);
    this.dragSensor.off('move', this._onMove as (e: T['move']) => void);
    this.dragSensor.off('end', this._onEnd as (e: T['end']) => void);
    this.dragSensor.off('cancel', this._onEnd as (e: T['cancel']) => void);
    this.dragSensor.off('abort', this._onEnd as (e: T['abort']) => void);
    this.dragSensor.off('destroy', this._onEnd as (e: T['destroy']) => void);
  }
}
