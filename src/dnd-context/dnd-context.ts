import { Emitter, EventListenerId } from 'eventti';

import { Draggable, DraggableEventType } from '../draggable/draggable.js';

import { Droppable, DroppableEventType } from '../droppable/droppable.js';

import { SensorEventType } from '../sensors/sensor.js';

import { getIntersectionScore } from '../utils/get-intersection-score.js';

import { Rect } from '../types.js';

let _id = 0;

export interface Collision {
  droppable: Droppable;
  rect: Rect;
}

export const DndContextEventType = {
  Start: 'start',
  Move: 'move',
  Enter: 'enter',
  Leave: 'leave',
  Over: 'over',
  Drop: 'drop',
  End: 'end',
  Cancel: 'cancel',
  Destroy: 'destroy',
} as const;

export type DndContextEventType = (typeof DndContextEventType)[keyof typeof DndContextEventType];

export interface DndContextEventCallbacks {
  [DndContextEventType.Start]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
  }) => void;
  [DndContextEventType.Move]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
  }) => void;
  [DndContextEventType.Enter]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
    collisions: Droppable[];
    addedCollisions: Droppable[];
  }) => void;
  [DndContextEventType.Leave]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
    collisions: Droppable[];
    removedCollisions: Droppable[];
  }) => void;
  [DndContextEventType.Over]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
    collisions: Droppable[];
    persistedCollisions: Droppable[];
  }) => void;
  [DndContextEventType.Drop]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
    collisions: Droppable[];
  }) => void;
  [DndContextEventType.End]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
  }) => void;
  [DndContextEventType.Cancel]: (data: {
    id: number;
    draggable: Draggable<any>;
    targets: Droppable[];
  }) => void;
  [DndContextEventType.Destroy]: () => void;
}

export interface DndContextOptions {
  collisionDetection?: DndContextCollisionDetection;
}

export type DndContextCollisionDetection = (
  draggable: Draggable<any>,
  droppables: Set<Droppable>,
) => Set<Droppable>;

export const defaultDndContextOptions: Required<DndContextOptions> = {
  collisionDetection: (draggable, droppables) => {
    const draggableClientRect = draggable.getClientRect();

    // If we can't get the draggable's client rect, we can't detect collisions.
    if (!draggableClientRect) {
      return new Set<Droppable>();
    }

    // Find all droppables that are colliding with the draggable.
    const collisions: { droppable: Droppable; intersectionScore: number }[] = [];
    for (const droppable of droppables) {
      const droppableClientRect = droppable.getClientRect();
      const intersectionScore = getIntersectionScore(draggableClientRect, droppableClientRect);
      if (intersectionScore > 0) {
        collisions.push({ droppable, intersectionScore });
      }
    }

    // Sort collisions by intersection score from highest to lowest. In case of
    // a tie, the original order should be kept.
    collisions.sort((a, b) => b.intersectionScore - a.intersectionScore);

    // Return the droppables that are colliding with the draggable in the
    // order of their intersection score.
    return new Set<Droppable>(collisions.map((c) => c.droppable));
  },
};

export class DndContext {
  // Used for all event listeners.
  protected _listenerId: Symbol;

  // Keep track of all added draggables and droppables.
  protected _draggables: Set<Draggable<any>>;
  protected _droppables: Set<Droppable>;

  // Used to store the drag data for each active (dragged) draggable.
  protected _dragData: Map<
    Draggable<any>,
    { id: number; targets: Set<Droppable> | null; collisions: Set<Droppable> }
  >;

  // The current collision detection function.
  protected _collisionDetection: DndContextCollisionDetection;

  // Flag to detect if we are checking collisions.
  protected _isCheckingCollisions: boolean;

  // The internal event emitter.
  protected _emitter: Emitter<{
    [K in keyof DndContextEventCallbacks]: DndContextEventCallbacks[K];
  }>;

  constructor(options: DndContextOptions = {}) {
    const { collisionDetection = defaultDndContextOptions.collisionDetection } = options;

    this._listenerId = Symbol();
    this._draggables = new Set();
    this._droppables = new Set();
    this._dragData = new Map();
    this._collisionDetection = collisionDetection;
    this._isCheckingCollisions = false;
    this._emitter = new Emitter();
  }

  _isTarget(draggable: Draggable<any>, droppable: Droppable) {
    return typeof droppable.accept === 'function'
      ? droppable.accept(draggable)
      : droppable.accept.includes(draggable.settings.group as any);
  }

  _getTargets(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable)!;

    if (dragData.targets) return dragData.targets;

    const targets = new Set<Droppable>();
    for (const droppable of this._droppables) {
      if (this._isTarget(draggable, droppable)) {
        targets.add(droppable);
      }
    }

    dragData.targets = targets;

    return targets;
  }

  _onDragStart(draggable: Draggable<any>) {
    // Make sure the draggable is registered.
    if (!this._draggables.has(draggable)) return;

    // Make sure the draggable is not being dragged, yet.
    if (this._dragData.get(draggable)) return;

    // Find all droppables that are colliding with the draggable.
    const targets = this._getTargets(draggable);
    const collisions = this._collisionDetection(draggable, targets);

    // Create the drag data.
    const dragData = { id: _id++, targets, collisions };
    this._dragData.set(draggable, dragData);

    // Emit start event.
    if (this._emitter.listenerCount(DndContextEventType.Start)) {
      this._emitter.emit(DndContextEventType.Start, {
        id: dragData.id,
        draggable,
        targets: Array.from(targets),
      });
    }

    // If there are any collisions, update the collision state and emit enter
    // events.
    if (collisions.size && this._emitter.listenerCount(DndContextEventType.Enter)) {
      this._emitter.emit(DndContextEventType.Enter, {
        id: dragData.id,
        draggable,
        targets: Array.from(targets),
        collisions: Array.from(collisions),
        addedCollisions: Array.from(collisions),
      });
    }
  }

  _onDragMove(draggable: Draggable<any>) {
    // Make sure the draggable is being dragged.
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    // Emit move event.
    if (this._emitter.listenerCount(DndContextEventType.Move)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndContextEventType.Move, {
        id: dragData.id,
        draggable,
        targets: Array.from(targets),
      });
    }

    // Run collision detection.
    this.detectCollisions(draggable);
  }

  _onDragEnd(draggable: Draggable<any>) {
    // Make sure the draggable is being dragged.
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    const targets = this._getTargets(draggable);
    const currentCollisions = dragData.collisions;

    // Emit drop events for all current collisions.
    if (
      currentCollisions &&
      currentCollisions.size > 0 &&
      this._emitter.listenerCount(DndContextEventType.Drop)
    ) {
      this._emitter.emit(DndContextEventType.Drop, {
        id: dragData.id,
        draggable,
        targets: Array.from(targets),
        collisions: Array.from(currentCollisions),
      });
    }

    // Emit end event.
    if (this._emitter.listenerCount(DndContextEventType.End)) {
      this._emitter.emit(DndContextEventType.End, {
        id: dragData.id,
        draggable,
        targets: Array.from(targets),
      });
    }

    // Remove the drag data.
    this._dragData.delete(draggable);
  }

  _onDragCancel(draggable: Draggable<any>) {
    // Make sure the draggable is being dragged.
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    // Emit cancel event.
    if (this._emitter.listenerCount(DndContextEventType.Cancel)) {
      const targets = this._getTargets(draggable);
      this._emitter.emit(DndContextEventType.Cancel, {
        id: dragData.id,
        draggable,
        targets: Array.from(targets),
      });
    }

    // Remove the drag data.
    this._dragData.delete(draggable);
  }

  _onDragDestroy(draggable: Draggable<any>) {
    this.removeDraggable(draggable);
  }

  on<T extends keyof DndContextEventCallbacks>(
    type: T,
    listener: DndContextEventCallbacks[T],
    listenerId?: EventListenerId,
  ): EventListenerId {
    return this._emitter.on(type, listener, listenerId);
  }

  off<T extends keyof DndContextEventCallbacks>(type: T, listenerId: EventListenerId): void {
    this._emitter.off(type, listenerId);
  }

  clearTargets(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable);
    if (dragData) dragData.targets = null;
  }

  detectCollisions(draggable: Draggable<any>) {
    const dragData = this._dragData.get(draggable);
    if (!dragData) return;

    if (this._isCheckingCollisions) {
      throw new Error('Cannot detect collisions while already checking collisions.');
    }

    this._isCheckingCollisions = true;

    const targets = this._getTargets(draggable);
    const currentCollisions = dragData.collisions;
    const nextCollisions = this._collisionDetection(draggable, targets);

    // Update collision state.
    dragData.collisions = nextCollisions;

    // Emit leave events.
    if (this._emitter.listenerCount(DndContextEventType.Leave)) {
      const removedCollisions: Set<Droppable> = currentCollisions
        ? currentCollisions.difference(nextCollisions)
        : new Set();

      if (removedCollisions.size > 0) {
        this._emitter.emit(DndContextEventType.Leave, {
          id: dragData.id,
          draggable,
          targets: Array.from(targets),
          collisions: Array.from(nextCollisions),
          removedCollisions: Array.from(removedCollisions),
        });
      }
    }

    // Emit enter events.
    if (this._emitter.listenerCount(DndContextEventType.Enter)) {
      const addedCollisions = currentCollisions
        ? nextCollisions.difference(currentCollisions)
        : nextCollisions;

      if (addedCollisions.size > 0) {
        this._emitter.emit(DndContextEventType.Enter, {
          id: dragData.id,
          draggable,
          targets: Array.from(targets),
          collisions: Array.from(nextCollisions),
          addedCollisions: Array.from(addedCollisions),
        });
      }
    }

    // Emit over events.
    if (this._emitter.listenerCount(DndContextEventType.Over)) {
      const persistedCollisions: Set<Droppable> = currentCollisions
        ? nextCollisions.intersection(currentCollisions)
        : new Set();

      if (persistedCollisions.size > 0) {
        this._emitter.emit(DndContextEventType.Over, {
          id: dragData.id,
          draggable,
          targets: Array.from(targets),
          collisions: Array.from(nextCollisions),
          persistedCollisions: Array.from(persistedCollisions),
        });
      }
    }

    this._isCheckingCollisions = false;
  }

  addDraggable(draggable: Draggable<any>) {
    if (this._draggables.has(draggable)) return;

    this._draggables.add(draggable);

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

    // If the draggable is already being dragged, start the drag process
    // manually.
    if (draggable.drag && !draggable.drag.isEnded) {
      this._onDragStart(draggable);
    }
  }

  removeDraggable(draggable: Draggable<any>) {
    // Make sure the draggable is registered.
    if (!this._draggables.has(draggable)) return;

    // Unbind the event listeners.
    draggable.off(DraggableEventType.Start, this._listenerId);
    draggable.off(DraggableEventType.Move, this._listenerId);
    draggable.off(DraggableEventType.End, this._listenerId);
    draggable.off(DraggableEventType.Destroy, this._listenerId);

    // If this draggable is being dragged, emit leave and cancel events.
    const dragData = this._dragData.get(draggable);
    if (dragData) {
      if (dragData.collisions.size && this._emitter.listenerCount(DndContextEventType.Leave)) {
        this._emitter.emit(DndContextEventType.Leave, {
          id: dragData.id,
          draggable,
          targets: Array.from(this._getTargets(draggable)),
          collisions: [],
          removedCollisions: Array.from(dragData.collisions),
        });
      }

      if (this._emitter.listenerCount(DndContextEventType.Cancel)) {
        this._emitter.emit(DndContextEventType.Cancel, {
          id: dragData.id,
          draggable,
          targets: Array.from(this._getTargets(draggable)),
        });
      }
    }

    // Remove drag data.
    this._dragData.delete(draggable);

    // Remove draggable.
    this._draggables.delete(draggable);
  }

  addDroppable(droppable: Droppable) {
    if (this._droppables.has(droppable)) return;

    // Add the droppable to the set of droppables.
    this._droppables.add(droppable);

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
      if (targets && this._isTarget(draggable, droppable)) {
        targets.add(droppable);
      }
    });

    // NB: We intentionally do not run collision detection here. It might not
    // be wanted/necessary behavior for some applications, so users can call
    // `detectCollisions` manually after adding the droppables if they want to.
  }

  removeDroppable(droppable: Droppable) {
    if (!this._droppables.has(droppable)) return;

    // Remove the droppable from the set of droppables.
    this._droppables.delete(droppable);

    // Unbind the destroy event listener.
    droppable.off(DroppableEventType.Destroy, this._listenerId);

    // Remove the droppable from the targets map.
    this._dragData.forEach(({ targets }) => {
      targets?.delete(droppable);
    });

    // Remove the droppable from the collisions map and emit leave events for
    // all draggables that are colliding with it.
    if (this._emitter.listenerCount(DndContextEventType.Leave)) {
      this._dragData.forEach(({ collisions, id }, draggable) => {
        if (collisions.has(droppable)) {
          collisions.delete(droppable);
          this._emitter.emit(DndContextEventType.Leave, {
            id,
            draggable,
            targets: Array.from(this._getTargets(draggable)),
            collisions: Array.from(collisions),
            removedCollisions: [droppable],
          });
        }
      });
    }
  }

  destroy() {
    this._emitter.emit(DndContextEventType.Destroy);
    this._emitter.off();
  }
}
