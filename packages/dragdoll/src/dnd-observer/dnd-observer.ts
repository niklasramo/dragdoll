import { Emitter } from 'eventti';
import type { AnyDraggable, Draggable, DraggableId } from '../draggable/draggable.js';
import { DraggableEventType } from '../draggable/draggable.js';
import type { Droppable, DroppableId } from '../droppable/droppable.js';
import { DroppableEventType } from '../droppable/droppable.js';
import type { SensorEventListenerId } from '../sensors/sensor.js';
import { SensorEventType } from '../sensors/sensor.js';
import { ticker, tickerPhases } from '../singletons/ticker.js';
import type { Writeable } from '../types.js';
import type { CollisionData } from './collision-detector.js';
import { CollisionDetector } from './collision-detector.js';

enum CollisionDetectionPhase {
  Idle = 0,
  Computing = 1,
  Computed = 2,
  Emitting = 3,
}

const SCROLL_LISTENER_OPTIONS = { capture: true, passive: true };

interface DndObserverInternalDragData<T extends CollisionData = CollisionData> {
  isEnded: boolean;
  data: { [key: string]: any };
  _targets: Map<DroppableId, Droppable> | null;
  _cd: {
    phase: CollisionDetectionPhase;
    tickerId: symbol;
    targets: Map<DroppableId, Droppable>;
    collisions: T[];
    contacts: Set<Droppable>;
    prevContacts: Set<Droppable>;
    addedContacts: Set<Droppable>;
    persistedContacts: Set<Droppable>;
  };
}

export const DndObserverEventType = {
  Start: 'start',
  Move: 'move',
  Enter: 'enter',
  Leave: 'leave',
  Collide: 'collide',
  End: 'end',
  AddDraggables: 'addDraggables',
  RemoveDraggables: 'removeDraggables',
  AddDroppables: 'addDroppables',
  RemoveDroppables: 'removeDroppables',
  Destroy: 'destroy',
} as const;

export type DndObserverEventType = (typeof DndObserverEventType)[keyof typeof DndObserverEventType];

export interface DndObserverEventCallbacks<T extends CollisionData = CollisionData> {
  [DndObserverEventType.Start]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
  }) => void;
  [DndObserverEventType.Move]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
  }) => void;
  [DndObserverEventType.Enter]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    addedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndObserverEventType.Leave]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    removedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndObserverEventType.Collide]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    addedContacts: ReadonlySet<Droppable>;
    removedContacts: ReadonlySet<Droppable>;
    persistedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndObserverEventType.End]: (data: {
    canceled: boolean;
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
  }) => void;
  [DndObserverEventType.AddDraggables]: (data: { draggables: ReadonlySet<AnyDraggable> }) => void;
  [DndObserverEventType.RemoveDraggables]: (data: {
    draggables: ReadonlySet<AnyDraggable>;
  }) => void;
  [DndObserverEventType.AddDroppables]: (data: { droppables: ReadonlySet<Droppable> }) => void;
  [DndObserverEventType.RemoveDroppables]: (data: { droppables: ReadonlySet<Droppable> }) => void;
  [DndObserverEventType.Destroy]: () => void;
}

// Public drag data exposed to consumers.
// Top-level is read-only. Nested `data` object contents are mutable.
export type DndObserverDragData = Readonly<{
  isEnded: boolean;
  data: { [key: string]: any };
}>;

export interface DndObserverOptions<T extends CollisionData = CollisionData> {
  collisionDetector?: (dndObserver: DndObserver<T>) => CollisionDetector<T>;
}

export class DndObserver<T extends CollisionData = CollisionData> {
  // Keep track of all added draggables and droppables.
  readonly draggables: ReadonlyMap<DraggableId, AnyDraggable>;
  readonly droppables: ReadonlyMap<DroppableId, Droppable>;
  readonly isDestroyed: boolean;

  // Keep track of all active draggables and their drag data.
  protected _drags: Map<AnyDraggable, DndObserverInternalDragData<T>>;

  // Used for all all event listeners and scroll ticker listener.
  protected _listenerId: symbol;

  // The current collision detection function.
  protected _collisionDetector: CollisionDetector<T>;

  // The internal event emitter.
  protected _emitter: Emitter<{
    [K in keyof DndObserverEventCallbacks<T>]: DndObserverEventCallbacks<T>[K];
  }>;

  constructor(options: DndObserverOptions<T> = {}) {
    const { collisionDetector } = options;

    this.draggables = new Map();
    this.droppables = new Map();
    this.isDestroyed = false;
    this._drags = new Map();
    this._listenerId = Symbol();
    this._emitter = new Emitter();

    // Bind methods.
    this._onScroll = this._onScroll.bind(this);

    // Create the collision detector.
    this._collisionDetector = collisionDetector
      ? collisionDetector(this)
      : new CollisionDetector<T>(this);
  }

  get drags() {
    return this._drags as ReadonlyMap<AnyDraggable, DndObserverDragData>;
  }

  protected _isMatch(draggable: AnyDraggable, droppable: Droppable) {
    let isMatch = false;

    // If the droppable has an accept function, use it to determine the match.
    if (typeof droppable.accept === 'function') {
      isMatch = droppable.accept(draggable);
    }
    // Otherwise, use the groups to determine the match.
    else {
      const draggableSet = draggable.settings.dndGroups;
      const droppableSet = droppable.accept;

      // Make sure that there are groups to match.
      if (!draggableSet || draggableSet.size === 0 || droppableSet.size === 0) {
        return false;
      }

      // Find out which set is smaller.
      const isDroppableSetSmaller = droppableSet.size < draggableSet.size;
      const smallerSet = isDroppableSetSmaller ? droppableSet : draggableSet;
      const largerSet = isDroppableSetSmaller ? draggableSet : droppableSet;

      // Loop through the smaller set and check if any of the groups match the
      // larger set.
      for (const group of smallerSet) {
        if (largerSet.has(group)) {
          isMatch = true;
          break;
        }
      }
    }

    return isMatch;
  }

  protected _getTargets(draggable: AnyDraggable) {
    const drag = this._drags.get(draggable);
    if (drag?._targets) return drag._targets;

    const targets = new Map<DroppableId, Droppable>();
    for (const droppable of this.droppables.values()) {
      if (this._isMatch(draggable, droppable)) {
        targets.set(droppable.id, droppable);
      }
    }

    if (drag) drag._targets = targets;

    return targets;
  }

  protected _onDragPrepareStart(draggable: AnyDraggable) {
    // Make sure the draggable is registered.
    if (!this.draggables.has(draggable.id)) return;

    // Make sure the draggable is not being dragged, yet.
    if (this._drags.get(draggable)) return;

    // Set the initial drag data for the draggable.
    this._drags.set(draggable, {
      isEnded: false,
      data: {},
      _targets: null,
      _cd: {
        phase: CollisionDetectionPhase.Idle,
        tickerId: Symbol(),
        targets: new Map(),
        collisions: [],
        contacts: new Set(),
        prevContacts: new Set(),
        addedContacts: new Set(),
        persistedContacts: new Set(),
      },
    });

    // Recompute the droppable client rects if this is the first dragged
    // draggable. We only want to do this once per "drag process" and that
    // starts when a draggable starts dragging while there are no other dragged
    // draggables, and stops when a draggable ends dragging while there are no
    // other dragged draggables.
    if (this._drags.size === 1) {
      this.updateDroppableClientRects();
    }

    // Run collision detection for the draggable. Note that we just compute the
    // collisions here, but don't _yet_ emit the collisions events, we do that
    // part after emitting the start event.
    this._computeCollisions(draggable);

    // Add scroll listener if this is the first dragged draggable.
    if (this._drags.size === 1) {
      window.addEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);
    }
  }

  protected _onDragStart(draggable: AnyDraggable) {
    // Make sure the draggable is being dragged.
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;

    // Emit "start" event.
    if (this._emitter.listenerCount(DndObserverEventType.Start)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndObserverEventType.Start, {
        draggable,
        targets,
      });
    }

    // Lastly, emit collisions events.
    this._emitCollisions(draggable);
  }

  protected _onDragPrepareMove(draggable: AnyDraggable) {
    // Make sure the draggable is being dragged.
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;

    // Run collision detection.
    this._computeCollisions(draggable);
  }

  protected _onDragMove(draggable: AnyDraggable) {
    // Make sure the draggable is being dragged.
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;

    // Emit "move" event.
    if (this._emitter.listenerCount(DndObserverEventType.Move)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndObserverEventType.Move, {
        draggable,
        targets,
      });
    }

    // Lastly, emit collisions events.
    this._emitCollisions(draggable);
  }

  protected _onDragEnd(draggable: AnyDraggable) {
    this._stopDrag(draggable);
  }

  protected _onDragCancel(draggable: AnyDraggable) {
    this._stopDrag(draggable, true);
  }

  protected _onDraggableDestroy(draggable: AnyDraggable) {
    this.removeDraggables([draggable]);
  }

  protected _onScroll = () => {
    if (this._drags.size === 0) return;

    // Queue droppable client rects update.
    ticker.once(
      tickerPhases.read,
      () => {
        this.updateDroppableClientRects();
      },
      this._listenerId,
    );

    // Queue collision detection for all active draggables.
    this.detectCollisions();
  };

  // Returns true if the final cleanup was queued to a microtask.
  protected _stopDrag(draggable: AnyDraggable, canceled = false) {
    // Make sure the draggable is being dragged.
    const drag = this._drags.get(draggable);
    if (!drag || drag.isEnded) return;

    // Throw an error if collisions are being emitted. This guards against user
    // manually stopping dragging while collisions are being emitted, in one of
    // the collision event callbacks. Doing that will result the end event
    // being potentially emitted before all the collision event callbacks are
    // executed, which is confusing behavior. We want to guarantee the end event
    // to be the last event to be emitted in the dnd process.
    if (drag._cd.phase === CollisionDetectionPhase.Emitting) {
      throw new Error('Cannot stop dragging while collisions are being emitted.');
    }

    // Mark the drag as ended.
    drag.isEnded = true;

    // Do a final collision detection pass before emitting the drop event to
    // ensure we have the most up to date collisions data.
    this._computeCollisions(draggable, true);
    this._emitCollisions(draggable, true);

    // Get the targets, collisions and colliding targets from the last collision
    // detection pass.
    const { targets, collisions, contacts } = drag._cd;

    // Emit "end" event.
    if (this._emitter.listenerCount(DndObserverEventType.End)) {
      this._emitter.emit(DndObserverEventType.End, {
        canceled,
        draggable,
        targets,
        collisions,
        contacts,
      });
    }

    // Remove the drag data.
    this._drags.delete(draggable);

    // Free up the collision data pool from the collision detector.
    this._collisionDetector['_removeCollisionDataArena'](draggable);

    // Clear the queued detect collisions callbacks.
    ticker.off(tickerPhases.read, drag._cd.tickerId);
    ticker.off(tickerPhases.write, drag._cd.tickerId);

    // Remove scroll ticker and listener if this was the last dragged draggable.
    if (!this._drags.size) {
      ticker.off(tickerPhases.read, this._listenerId);
      window.removeEventListener('scroll', this._onScroll, SCROLL_LISTENER_OPTIONS);
    }
  }

  protected _computeCollisions(draggable: AnyDraggable, force = false) {
    const drag = this._drags.get(draggable);
    if (!drag || (!force && drag.isEnded)) return;

    const cd = drag._cd;

    // Throw an error if collisions are being computed or emitted.
    switch (cd.phase) {
      case CollisionDetectionPhase.Computing:
        throw new Error('Collisions are being computed.');
      case CollisionDetectionPhase.Emitting:
        throw new Error('Collisions are being emitted.');
      default:
        break;
    }

    // Mark collision detection as computing.
    cd.phase = CollisionDetectionPhase.Computing;

    // Get the targets of the draggable and set them as the collision targets.
    cd.targets = this._getTargets(draggable);

    // NB: Running collision detection will mutate the collision data of the
    // current collisions of the draggable (since we use object pool objects
    // directly for memory efficiency), so if we need to compare the current and
    // next collisions we need to cache the current collisions before running
    // the detection. But, we don't need to do that now, we just care about the
    // previous colliding droppables so this is fine.
    this._collisionDetector.detectCollisions(draggable, cd.targets, cd.collisions);

    // Mark collision detection as computed.
    cd.phase = CollisionDetectionPhase.Computed;
  }

  protected _emitCollisions(draggable: AnyDraggable, force = false) {
    const drag = this._drags.get(draggable);
    if (!drag || (!force && drag.isEnded)) return;

    const cd = drag._cd;

    // Make sure we have computed the collisions.
    switch (cd.phase) {
      case CollisionDetectionPhase.Computing:
        throw new Error('Collisions are being computed.');
      case CollisionDetectionPhase.Emitting:
        throw new Error('Collisions are being emitted.');
      case CollisionDetectionPhase.Idle:
        // Silently ignore if collisions have not been computed yet. This is
        // a potential scenario, a valid one, but we should not throw an error
        // here.
        return;
      default:
        break;
    }

    // Mark collision detection as emitting.
    cd.phase = CollisionDetectionPhase.Emitting;

    const emitter = this._emitter;
    const collisions = cd.collisions;
    const targets = cd.targets;
    const addedContacts = cd.addedContacts;
    const persistedContacts = cd.persistedContacts;

    // Swap pointers to the colliding droppables sets.
    const prevContacts = cd.contacts;
    const contacts = cd.prevContacts;
    cd.prevContacts = prevContacts;
    cd.contacts = contacts;

    // Make removedContacts piggyback on prevContacts.
    const removedContacts = prevContacts;

    // Clear reusable sets.
    addedContacts.clear();
    persistedContacts.clear();
    contacts.clear();

    // Populate the colliding droppables set based on collisions and find out
    // added, persisted and removed collisions (leftover from the previous
    // collision phase).
    for (const collision of collisions) {
      const droppable = targets.get(collision.droppableId);
      // NB: We should always have a droppable here since we compute the
      // collisions with the targets of the draggable, but it's still good to
      // be defensive here.
      if (!droppable) continue;
      contacts.add(droppable);
      if (prevContacts.has(droppable)) {
        persistedContacts.add(droppable);
        // Let's remove the droppable from the previous colliding droppables set,
        // this way the removed collisions will be the ones that are left in the
        // previous colliding droppables set.
        prevContacts.delete(droppable);
      } else {
        addedContacts.add(droppable);
      }
    }

    // Emit "leave" events.
    if (prevContacts.size && emitter.listenerCount(DndObserverEventType.Leave)) {
      emitter.emit(DndObserverEventType.Leave, {
        draggable,
        targets,
        collisions,
        contacts,
        removedContacts,
      });
    }

    // Emit "enter" events.
    if (addedContacts.size && emitter.listenerCount(DndObserverEventType.Enter)) {
      emitter.emit(DndObserverEventType.Enter, {
        draggable,
        targets,
        collisions,
        contacts,
        addedContacts,
      });
    }

    // Emit "collide" events if we have any contacts or removed contacts.
    if (
      emitter.listenerCount(DndObserverEventType.Collide) &&
      (contacts.size || removedContacts.size)
    ) {
      emitter.emit(DndObserverEventType.Collide, {
        draggable,
        targets,
        collisions,
        contacts,
        addedContacts,
        removedContacts,
        persistedContacts,
      });
    }

    // Clear reusable sets.
    addedContacts.clear();
    persistedContacts.clear();
    prevContacts.clear();

    // Mark collision detection as idle.
    cd.phase = CollisionDetectionPhase.Idle;
  }

  on<K extends keyof DndObserverEventCallbacks<T>>(
    type: K,
    listener: DndObserverEventCallbacks<T>[K],
    listenerId?: SensorEventListenerId,
  ): SensorEventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<K extends keyof DndObserverEventCallbacks<T>>(
    type: K,
    listenerId: SensorEventListenerId,
  ): void {
    this._emitter.off(type, listenerId);
  }

  updateDroppableClientRects() {
    for (const droppable of this.droppables.values()) {
      droppable.updateClientRect();
    }
  }

  clearTargets(draggable?: AnyDraggable) {
    if (draggable) {
      const drag = this._drags.get(draggable);
      if (drag) drag._targets = null;
    } else {
      for (const drag of this._drags.values()) {
        drag._targets = null;
      }
    }
  }

  detectCollisions(draggable?: AnyDraggable) {
    if (this.isDestroyed) return;

    if (draggable) {
      const drag = this._drags.get(draggable);
      if (!drag || drag.isEnded) return;
      ticker.once(tickerPhases.read, () => this._computeCollisions(draggable), drag._cd.tickerId);
      ticker.once(tickerPhases.write, () => this._emitCollisions(draggable), drag._cd.tickerId);
    } else {
      for (const [d, drag] of this._drags) {
        if (drag.isEnded) continue;
        ticker.once(tickerPhases.read, () => this._computeCollisions(d), drag._cd.tickerId);
        ticker.once(tickerPhases.write, () => this._emitCollisions(d), drag._cd.tickerId);
      }
    }
  }

  addDraggables(draggables: AnyDraggable[] | Set<AnyDraggable>) {
    if (this.isDestroyed) return;

    const addedDraggables = new Set<AnyDraggable>();

    for (const draggable of draggables as Set<Draggable>) {
      if (this.draggables.has(draggable.id)) continue;

      addedDraggables.add(draggable);

      (this.draggables as Map<DraggableId, AnyDraggable>).set(draggable.id, draggable);

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
        DraggableEventType.PrepareMove,
        () => {
          this._onDragPrepareMove(draggable);
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
        (drag) => {
          // If the end event's type is "end", call the end callback.
          if (drag.endEvent?.type === SensorEventType.End) {
            this._onDragEnd(draggable);
          }
          // In other cases, call the cancel callback.
          else {
            this._onDragCancel(draggable);
          }
        },
        this._listenerId,
      );

      draggable.on(
        DraggableEventType.Destroy,
        () => {
          this._onDraggableDestroy(draggable);
        },
        this._listenerId,
      );
    }

    // If no draggables were added, return.
    if (!addedDraggables.size) return;

    // Emit "addDraggables" event.
    if (this._emitter.listenerCount(DndObserverEventType.AddDraggables)) {
      this._emitter.emit(DndObserverEventType.AddDraggables, { draggables: addedDraggables });
    }

    // Start the drag process for the added draggables, if needed.
    for (const draggable of addedDraggables) {
      // If the draggable is already being dragged, start the drag process
      // manually. Note that we are reading internal state of the draggable here
      // (`_startPhase`) to avoid double starting the drag process. We need to
      // be careful here and make sure to update this logic if we change the
      // draggable's internal state logic.
      if (!this.isDestroyed && draggable.drag && !draggable.drag.isEnded) {
        const startPhase = draggable['_startPhase'];
        if (startPhase >= 2) this._onDragPrepareStart(draggable);
        if (startPhase >= 4) this._onDragStart(draggable);
      }
    }
  }

  removeDraggables(draggables: AnyDraggable[] | Set<AnyDraggable>) {
    if (this.isDestroyed) return;

    const removedDraggables = new Set<AnyDraggable>();

    for (const draggable of draggables) {
      if (!this.draggables.has(draggable.id)) continue;

      removedDraggables.add(draggable);

      // Remove draggable.
      (this.draggables as Map<DraggableId, AnyDraggable>).delete(draggable.id);

      // Unbind the event listeners.
      draggable.off(DraggableEventType.PrepareStart, this._listenerId);
      draggable.off(DraggableEventType.Start, this._listenerId);
      draggable.off(DraggableEventType.PrepareMove, this._listenerId);
      draggable.off(DraggableEventType.Move, this._listenerId);
      draggable.off(DraggableEventType.End, this._listenerId);
      draggable.off(DraggableEventType.Destroy, this._listenerId);
    }

    // Cancel the drag.
    // NB: We need to do this after first removing the draggables from the
    // registry to avoid calling removeDraggables more than once per draggable.
    for (const draggable of removedDraggables) {
      this._stopDrag(draggable, true);
    }

    // Emit "removeDraggables" event.
    if (this._emitter.listenerCount(DndObserverEventType.RemoveDraggables)) {
      this._emitter.emit(DndObserverEventType.RemoveDraggables, { draggables: removedDraggables });
    }
  }

  addDroppables(droppables: Droppable[] | Set<Droppable>) {
    if (this.isDestroyed) return;

    const addedDroppables = new Set<Droppable>();

    for (const droppable of droppables) {
      // Make sure the droppable is not registered.
      if (this.droppables.has(droppable.id)) continue;

      // Add the droppable to the validated set of droppables.
      addedDroppables.add(droppable);

      // Add the droppable to the droppable map.
      (this.droppables as Map<DroppableId, Droppable>).set(droppable.id, droppable);

      // Bind the destroy event listener.
      droppable.on(
        DroppableEventType.Destroy,
        () => {
          this.removeDroppables([droppable]);
        },
        this._listenerId,
      );

      // Add the droppable to the targets of all currently dragged draggables,
      // where the droppable is a valid target.
      this._drags.forEach(({ _targets }, draggable) => {
        if (_targets && this._isMatch(draggable, droppable)) {
          _targets.set(droppable.id, droppable);
          this.detectCollisions(draggable);
        }
      });
    }

    // Emit "addDroppables" event.
    if (addedDroppables.size && this._emitter.listenerCount(DndObserverEventType.AddDroppables)) {
      this._emitter.emit(DndObserverEventType.AddDroppables, { droppables: addedDroppables });
    }
  }

  removeDroppables(droppables: Droppable[] | Set<Droppable>) {
    if (this.isDestroyed) return;

    const removedDroppables = new Set<Droppable>();

    for (const droppable of droppables) {
      // Make sure the droppable is registered.
      if (!this.droppables.has(droppable.id)) continue;

      // Remove the droppable from the droppables map.
      (this.droppables as Map<DroppableId, Droppable>).delete(droppable.id);

      // Add the droppable to the validated set of droppables.
      removedDroppables.add(droppable);

      // Unbind the destroy event listener.
      droppable.off(DroppableEventType.Destroy, this._listenerId);

      // Remove the droppable from the targets set of all dragged draggables and
      // queue collision detection for them.
      this._drags.forEach(({ _targets }, draggable) => {
        if (_targets && _targets.has(droppable.id)) {
          _targets.delete(droppable.id);
          this.detectCollisions(draggable);
        }
      });
    }

    // Emit "removeDroppables" event.
    if (
      removedDroppables.size &&
      this._emitter.listenerCount(DndObserverEventType.RemoveDroppables)
    ) {
      this._emitter.emit(DndObserverEventType.RemoveDroppables, { droppables: removedDroppables });
    }
  }

  destroy() {
    // Return early if the dnd observer is already destroyed.
    if (this.isDestroyed) return;

    // Throw an error if collisions are being emitted. If we allowed this we
    // could not guarantee the correct order of events. We want the destroy
    // event to be the last event to be emitted when destroying the dnd
    // observer.
    const drags = Array.from(this._drags.values());
    if (drags.some((drag) => drag._cd.phase === CollisionDetectionPhase.Emitting)) {
      throw new Error('Cannot destroy the DndObserver while collisions are being emitted.');
    }

    // Mark the dnd observer as destroyed.
    (this as Writeable<typeof this>).isDestroyed = true;

    // Unbind all draggable event listeners.
    this.draggables.forEach((draggable) => {
      draggable.off(DraggableEventType.PrepareStart, this._listenerId);
      draggable.off(DraggableEventType.Start, this._listenerId);
      draggable.off(DraggableEventType.PrepareMove, this._listenerId);
      draggable.off(DraggableEventType.Move, this._listenerId);
      draggable.off(DraggableEventType.End, this._listenerId);
      draggable.off(DraggableEventType.Destroy, this._listenerId);
    });

    // Unbind all droppable event listeners.
    this.droppables.forEach((droppable) => {
      droppable.off(DroppableEventType.Destroy, this._listenerId);
    });

    // Cancel all active drags.
    const activeDraggables = this._drags.keys();
    for (const draggable of activeDraggables) {
      this._stopDrag(draggable, true);
    }

    // Emit "destroy" event.
    this._emitter.emit(DndObserverEventType.Destroy);

    // Unbind all emitter listeners.
    this._emitter.off();

    // Destroy the collision detector.
    this._collisionDetector.destroy();

    // Clear the draggables and droppables.
    (this.draggables as Map<DraggableId, AnyDraggable>).clear();
    (this.droppables as Map<DroppableId, Droppable>).clear();
  }
}
