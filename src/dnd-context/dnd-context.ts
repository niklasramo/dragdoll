import { Emitter, EventListenerId } from 'eventti';

import { Draggable, DraggableEventType } from '../draggable/draggable.js';

import { Droppable, DroppableEventType } from '../droppable/droppable.js';

import { SensorEventType } from '../sensors/sensor.js';

import {
  CollisionDetector,
  CollisionData,
  CollisionDetectorOptions,
} from './collision-detector.js';

import { ticker, tickerPhases } from '../singletons/ticker.js';

const SCROLL_LISTENER_OPTIONS = { capture: true, passive: true };
const EMPTY_MAP: ReadonlyMap<any, any> = new Map();

export const DndContextEventType = {
  Start: 'start',
  Move: 'move',
  Enter: 'enter',
  Leave: 'leave',
  Over: 'over',
  Drop: 'drop',
  End: 'end',
  Cancel: 'cancel',
  AddDraggable: 'addDraggable',
  RemoveDraggable: 'removeDraggable',
  AddDroppable: 'addDroppable',
  RemoveDroppable: 'removeDroppable',
  Destroy: 'destroy',
} as const;

export type DndContextEventType = (typeof DndContextEventType)[keyof typeof DndContextEventType];

export interface DndContextEventCallbacks<T extends CollisionData = CollisionData> {
  [DndContextEventType.Start]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Move]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Enter]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
    collisions: ReadonlyMap<Droppable, T>;
    addedCollisions: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Leave]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
    collisions: ReadonlyMap<Droppable, T>;
    removedCollisions: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Over]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
    collisions: ReadonlyMap<Droppable, T>;
    persistedCollisions: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Drop]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
    collisions: ReadonlyMap<Droppable, T>;
  }) => void;
  [DndContextEventType.End]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Cancel]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.AddDraggable]: (data: { draggable: Draggable<any> }) => void;
  [DndContextEventType.RemoveDraggable]: (data: { draggable: Draggable<any> }) => void;
  [DndContextEventType.AddDroppable]: (data: { droppable: Droppable }) => void;
  [DndContextEventType.RemoveDroppable]: (data: { droppable: Droppable }) => void;
  [DndContextEventType.Destroy]: () => void;
}

export interface DndContextOptions<T extends CollisionData = CollisionData> {
  collisionDetector?:
    | CollisionDetectorOptions<T>
    | ((dndContext: DndContext<T>) => CollisionDetector<T>);
}

export type DndContextCollisionDetection<T extends CollisionData = CollisionData> = (
  draggable: Draggable<any>,
  targetDroppables: Set<Droppable>,
) => Map<Droppable, T>;

export class DndContext<T extends CollisionData = CollisionData> {
  // Keep track of all added draggables and droppables.
  readonly draggables: ReadonlySet<Draggable<any>>;
  readonly droppables: ReadonlyMap<Symbol, Droppable>;

  // Used for all event listeners.
  protected _listenerId: Symbol;

  // Ticker ids.
  protected _scrollTickerId: Symbol;

  // Used to store the drag data for each active (dragged) draggable.
  protected _dragData: Map<
    Draggable<any>,
    {
      targets: Set<Droppable> | null;
      collisions: Map<Droppable, T>;
      prevCollisions: Map<Droppable, T>;
      data: { [key: string]: any };
    }
  >;

  // The current collision detection function.
  protected _collisionDetector: CollisionDetector<T>;

  // Flag to detect if we are checking collisions.
  protected _isCheckingCollisions: boolean;

  // Reusable collision detection arrays and sets for memory efficiency.
  protected _removedCollisions: Set<Droppable>;
  protected _addedCollisions: Set<Droppable>;
  protected _persistedCollisions: Set<Droppable>;

  // The internal event emitter.
  protected _emitter: Emitter<{
    [K in keyof DndContextEventCallbacks<T>]: DndContextEventCallbacks<T>[K];
  }>;

  constructor(options: DndContextOptions<T> = {}) {
    const { collisionDetector } = options;

    this.draggables = new Set();
    this.droppables = new Map();
    this._listenerId = Symbol();
    this._scrollTickerId = Symbol();
    this._dragData = new Map();
    this._isCheckingCollisions = false;
    this._emitter = new Emitter();

    // Initialize reusable collision detection arrays and sets.
    this._removedCollisions = new Set();
    this._addedCollisions = new Set();
    this._persistedCollisions = new Set();

    if (typeof collisionDetector === 'function') {
      this._collisionDetector = collisionDetector(this);
    } else {
      this._collisionDetector = new CollisionDetector<T>(this, collisionDetector);
    }
  }

  protected _getTargets(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable);
    if (dragData?.targets) return dragData.targets;

    const targets = new Set<Droppable>();
    for (const droppable of this.droppables.values()) {
      if (this.isMatch(draggable, droppable)) {
        targets.add(droppable);
      }
    }

    if (dragData) {
      dragData.targets = targets;
    }

    return targets;
  }

  protected _onDragPrepareStart(draggable: Draggable<any>) {
    // Make sure the draggable is registered.
    if (!this.draggables.has(draggable)) return;

    // Make sure the draggable is not being dragged, yet.
    if (this._dragData.get(draggable)) return;

    // Recompute the droppable client rects.
    this.updateDroppableClientRects();
  }

  protected _onDragStart(draggable: Draggable<any>) {
    // Make sure the draggable is registered.
    if (!this.draggables.has(draggable)) return;

    // Make sure the draggable is not being dragged, yet.
    if (this._dragData.get(draggable)) return;

    // Find all droppables that are colliding with the draggable.
    const targets = this._getTargets(draggable);
    const collisions = new Map<Droppable, T>();
    const prevCollisions = new Map<Droppable, T>();
    this._collisionDetector.detectCollisions(draggable, targets, collisions);

    // Create the drag data.
    const dragData = { targets, collisions, prevCollisions, data: {} };
    this._dragData.set(draggable, dragData);

    // Add scroll listener.
    window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Emit start event.
    if (this._emitter.listenerCount(DndContextEventType.Start)) {
      this._emitter.emit(DndContextEventType.Start, {
        draggable,
        targets,
      });
    }

    // If there are any collisions, update the collision state and emit enter
    // events.
    if (collisions.size && this._emitter.listenerCount(DndContextEventType.Enter)) {
      // Create added collisions set.
      const addedCollisions = this._addedCollisions;
      addedCollisions.clear();
      for (const droppable of collisions.keys()) {
        addedCollisions.add(droppable);
      }

      // Emit enter event.
      this._emitter.emit(DndContextEventType.Enter, {
        draggable,
        targets,
        collisions,
        addedCollisions,
      });

      // Clear reusable set.
      addedCollisions.clear();
    }
  }

  protected _onDragMove(draggable: Draggable<any>) {
    // Make sure the draggable is being dragged.
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    // Emit move event.
    if (this._emitter.listenerCount(DndContextEventType.Move)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndContextEventType.Move, {
        draggable,
        targets,
      });
    }

    // Run collision detection.
    this.detectCollisions(draggable);
  }

  protected _onDragEnd(draggable: Draggable<any>) {
    // Make sure the draggable is being dragged.
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    // Remove scroll ticker.
    ticker.off(tickerPhases.read, this._scrollTickerId);

    // Remove scroll listener.
    window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    const targets = this._getTargets(draggable);
    const collisions = dragData.collisions;

    // Emit drop events for all current collisions.
    if (collisions.size > 0 && this._emitter.listenerCount(DndContextEventType.Drop)) {
      this._emitter.emit(DndContextEventType.Drop, {
        draggable,
        targets,
        collisions,
      });
    }

    // Emit end event.
    if (this._emitter.listenerCount(DndContextEventType.End)) {
      this._emitter.emit(DndContextEventType.End, {
        draggable,
        targets,
      });
    }

    // Remove the drag data.
    this._dragData.delete(draggable);
  }

  protected _onDragCancel(draggable: Draggable<any>) {
    // Make sure the draggable is being dragged.
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    // Remove scroll ticker.
    ticker.off(tickerPhases.read, this._scrollTickerId);

    // Remove scroll listener.
    window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);

    // Emit cancel event.
    if (this._emitter.listenerCount(DndContextEventType.Cancel)) {
      this._emitter.emit(DndContextEventType.Cancel, {
        draggable,
        targets: this._getTargets(draggable),
      });
    }

    // Remove the drag data.
    this._dragData.delete(draggable);
  }

  protected _onDragDestroy(draggable: Draggable<any>) {
    this.removeDraggable(draggable);
  }

  protected _onScroll = () => {
    ticker.once(
      tickerPhases.read,
      () => {
        this.updateDroppableClientRects();
        this._dragData.forEach((_, draggable) => {
          this.detectCollisions(draggable);
        });
      },
      this._scrollTickerId,
    );
  };

  on<K extends keyof DndContextEventCallbacks<T>>(
    type: K,
    listener: DndContextEventCallbacks<T>[K],
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<K extends keyof DndContextEventCallbacks<T>>(type: K, listenerId: EventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  isMatch(draggable: Draggable<any>, droppable: Droppable) {
    let isMatch =
      typeof droppable.accept === 'function'
        ? droppable.accept(draggable)
        : droppable.accept.includes(draggable.settings.group as any);

    // Make sure that none of the draggable's elements match the droppable's
    // element.
    if (isMatch && draggable.drag) {
      const items = draggable.drag.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].element === droppable.element) {
          return false;
        }
      }
    }

    return isMatch;
  }

  getData(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable);
    if (!dragData) return null;
    return dragData.data;
  }

  clearTargets(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable);
    if (dragData) dragData.targets = null;
  }

  updateDroppableClientRects() {
    this.droppables.forEach((droppable) => {
      droppable.updateClientRect();
    });
  }

  detectCollisions(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    if (this._isCheckingCollisions) {
      throw new Error('Cannot detect collisions while already checking collisions.');
    }

    // Set the checking collisions flag.
    this._isCheckingCollisions = true;

    // Assign reusable sets.
    const removedCollisions = this._removedCollisions;
    const addedCollisions = this._addedCollisions;
    const persistedCollisions = this._persistedCollisions;

    // Clear reusable sets.
    removedCollisions.clear();
    addedCollisions.clear();
    persistedCollisions.clear();

    const emitter = this._emitter;
    const targets = this._getTargets(draggable);

    // Swap collision maps.
    const prevCollisions = dragData.collisions;
    const collisions = dragData.prevCollisions;
    dragData.prevCollisions = prevCollisions;
    dragData.collisions = collisions;

    // NB: Running collision detection will mutate the collision data of the
    // current collisions (since we use object pool objects directly for memory
    // efficiency), so if we need to compare the current and next collisions we
    // need to cache the current collisions before running the detection. But,
    // for now, we just care about the previous colliding droppables so this is
    // fine.
    this._collisionDetector.detectCollisions(draggable, targets, collisions);

    // Check if there are any listeners for the events we need to emit.
    const hasLeaveListeners = emitter.listenerCount(DndContextEventType.Leave);
    const hasOverListeners = emitter.listenerCount(DndContextEventType.Over);
    const hasEnterListeners = emitter.listenerCount(DndContextEventType.Enter);

    // Find out persisted and removed collisions (if needed).
    if (hasLeaveListeners || hasOverListeners) {
      for (const droppable of prevCollisions.keys()) {
        if (collisions.has(droppable)) {
          persistedCollisions.add(droppable);
        } else {
          removedCollisions.add(droppable);
        }
      }
    }

    // Find out added collisions (if needed).
    if (hasEnterListeners) {
      for (const droppable of collisions.keys()) {
        if (!prevCollisions.has(droppable)) {
          addedCollisions.add(droppable);
        }
      }
    }

    // Emit leave events.
    if (hasLeaveListeners && removedCollisions.size > 0) {
      emitter.emit(DndContextEventType.Leave, {
        draggable,
        targets,
        collisions,
        removedCollisions,
      });
    }

    // Emit enter events.
    if (hasEnterListeners && addedCollisions.size > 0) {
      emitter.emit(DndContextEventType.Enter, {
        draggable,
        targets,
        collisions,
        addedCollisions,
      });
    }

    // Emit over events.
    if (hasOverListeners && persistedCollisions.size > 0) {
      emitter.emit(DndContextEventType.Over, {
        draggable,
        targets,
        collisions,
        persistedCollisions,
      });
    }

    // Clear reusable sets.
    removedCollisions.clear();
    addedCollisions.clear();
    persistedCollisions.clear();

    // Clear prevCollisions to prevent access to stale pooled data.
    prevCollisions.clear();

    // Reset the checking collisions flag.
    this._isCheckingCollisions = false;
  }

  addDraggable(draggable: Draggable<any>) {
    if (this.draggables.has(draggable)) return;

    (this.draggables as Set<Draggable<any>>).add(draggable);

    draggable.on(
      DraggableEventType.PrepareStart,
      () => {
        this._onDragPrepareStart(draggable);
      },
      this._listenerId,
    );

    draggable.on(
      DraggableEventType.Start,
      () => {
        this._onDragStart(draggable);
      },
      this._listenerId,
    );

    draggable.on(
      DraggableEventType.Move,
      () => {
        this._onDragMove(draggable);
      },
      this._listenerId,
    );

    draggable.on(
      DraggableEventType.End,
      (e) => {
        if (e?.type === SensorEventType.End) {
          this._onDragEnd(draggable);
        } else if (e?.type === SensorEventType.Cancel) {
          this._onDragCancel(draggable);
        }
      },
      this._listenerId,
    );

    draggable.on(
      DraggableEventType.Destroy,
      () => {
        this._onDragDestroy(draggable);
      },
      this._listenerId,
    );

    // Emit add draggable event. Note that we intentionally call this before
    // we call the onDragStart method, so that the add event is called before
    // the start event.
    this._emitter.emit(DndContextEventType.AddDraggable, { draggable });

    // If the draggable is already being dragged, start the drag process
    // manually.
    if (draggable.drag && !draggable.drag.isEnded) {
      this._onDragStart(draggable);
    }
  }

  removeDraggable(draggable: Draggable<any>) {
    // Make sure the draggable is registered.
    if (!this.draggables.has(draggable)) return;

    // Unbind the event listeners.
    draggable.off(DraggableEventType.PrepareStart, this._listenerId);
    draggable.off(DraggableEventType.Start, this._listenerId);
    draggable.off(DraggableEventType.Move, this._listenerId);
    draggable.off(DraggableEventType.End, this._listenerId);
    draggable.off(DraggableEventType.Destroy, this._listenerId);

    // If this draggable is being dragged, emit leave and cancel events.
    const dragData = this._dragData.get(draggable);
    if (dragData) {
      // Emit leave event if there are any collisions.
      if (dragData.collisions.size && this._emitter.listenerCount(DndContextEventType.Leave)) {
        // Create removed collisions set.
        const removedCollisions = this._removedCollisions;
        removedCollisions.clear();
        for (const droppable of dragData.collisions.keys()) {
          removedCollisions.add(droppable);
        }

        // Emit leave event.
        this._emitter.emit(DndContextEventType.Leave, {
          draggable,
          targets: this._getTargets(draggable),
          collisions: EMPTY_MAP as ReadonlyMap<Droppable, T>,
          removedCollisions,
        });

        // Clear reusable set.
        removedCollisions.clear();
      }

      // Emit cancel event.
      if (this._emitter.listenerCount(DndContextEventType.Cancel)) {
        this._emitter.emit(DndContextEventType.Cancel, {
          draggable,
          targets: this._getTargets(draggable),
        });
      }
    }

    // Remove drag data.
    this._dragData.delete(draggable);

    // Remove draggable.
    (this.draggables as Set<Draggable<any>>).delete(draggable);

    // Emit remove draggable event.
    this._emitter.emit(DndContextEventType.RemoveDraggable, { draggable });
  }

  addDroppable(droppable: Droppable) {
    if (this.droppables.has(droppable.id)) return;

    // Add the droppable to the droppable map.
    (this.droppables as Map<Symbol, Droppable>).set(droppable.id, droppable);

    // Bind the destroy event listener.
    droppable.on(
      DroppableEventType.Destroy,
      () => {
        this.removeDroppable(droppable);
      },
      this._listenerId,
    );

    // Add the droppable to the targets of all currently dragged draggables,
    // where the droppable is a valid target.
    this._dragData.forEach(({ targets }, draggable) => {
      if (targets && this.isMatch(draggable, droppable)) {
        targets.add(droppable);
      }
    });

    // Emit add droppable event.
    this._emitter.emit(DndContextEventType.AddDroppable, { droppable });

    // NB: We intentionally do not run collision detection here. It might not
    // be wanted/necessary behavior for some applications, so users can call
    // `detectCollisions` manually after adding the droppables if they want to.
  }

  removeDroppable(droppable: Droppable) {
    if (!this.droppables.has(droppable.id)) return;

    // Remove the droppable from the set of droppables.
    (this.droppables as Map<Symbol, Droppable>).delete(droppable.id);

    // Unbind the destroy event listener.
    droppable.off(DroppableEventType.Destroy, this._listenerId);

    // Remove the droppable from the targets map.
    this._dragData.forEach(({ targets }) => {
      targets?.delete(droppable);
    });

    // Remove the droppable from the collisions map and emit leave events for
    // all draggables that are colliding with it.
    if (this._emitter.listenerCount(DndContextEventType.Leave)) {
      this._dragData.forEach(({ collisions }, draggable) => {
        if (collisions.has(droppable)) {
          // Create removed collisions set.
          const removedCollisions = this._removedCollisions;
          removedCollisions.clear();
          removedCollisions.add(droppable);

          // Remove the droppable from the collisions map.
          collisions.delete(droppable);

          // Emit leave event.
          this._emitter.emit(DndContextEventType.Leave, {
            draggable,
            targets: this._getTargets(draggable),
            collisions,
            removedCollisions,
          });

          // Clear reusable set.
          removedCollisions.clear();
        }
      });
    }

    // Emit remove droppable event.
    this._emitter.emit(DndContextEventType.RemoveDroppable, { droppable });
  }

  destroy() {
    ticker.off(tickerPhases.read, this._scrollTickerId);
    this._collisionDetector.destroy();
    this._emitter.emit(DndContextEventType.Destroy);
    this._emitter.off();
  }
}
