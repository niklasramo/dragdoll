import { a as Rect } from "./types-BaIRuLz3.js";
import { a as SensorEventListenerId } from "./sensor-C7UNOJhU.js";
import { l as DraggableId, t as AnyDraggable } from "./draggable-DlxtQzUd.js";
import { i as DroppableId, t as Droppable } from "./droppable-Bo_fOdqw.js";
import { Emitter } from "eventti";

//#region src/utils/object-arena.d.ts
declare class ObjectArena<Item extends object, ItemArgs extends unknown[] = []> {
  protected _items: Item[];
  protected _index: number;
  protected _initItem: (item?: Item, ...args: ItemArgs) => Item;
  constructor(initItem: (item?: Item, ...args: ItemArgs) => Item);
  allocate(...args: ItemArgs): Item;
  reset(): void;
  truncate(maxLength?: number): void;
}
//#endregion
//#region src/dnd-observer/dnd-observer.d.ts
declare enum CollisionDetectionPhase {
  Idle = 0,
  Computing = 1,
  Computed = 2,
  Emitting = 3,
}
interface DndObserverInternalDragData<T extends CollisionData = CollisionData> {
  isEnded: boolean;
  data: {
    [key: string]: any;
  };
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
declare const DndObserverEventType: {
  readonly Start: "start";
  readonly Move: "move";
  readonly Enter: "enter";
  readonly Leave: "leave";
  readonly Collide: "collide";
  readonly End: "end";
  readonly AddDraggables: "addDraggables";
  readonly RemoveDraggables: "removeDraggables";
  readonly AddDroppables: "addDroppables";
  readonly RemoveDroppables: "removeDroppables";
  readonly Destroy: "destroy";
};
type DndObserverEventType = (typeof DndObserverEventType)[keyof typeof DndObserverEventType];
interface DndObserverEventCallbacks<T extends CollisionData = CollisionData> {
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
  [DndObserverEventType.AddDraggables]: (data: {
    draggables: ReadonlySet<AnyDraggable>;
  }) => void;
  [DndObserverEventType.RemoveDraggables]: (data: {
    draggables: ReadonlySet<AnyDraggable>;
  }) => void;
  [DndObserverEventType.AddDroppables]: (data: {
    droppables: ReadonlySet<Droppable>;
  }) => void;
  [DndObserverEventType.RemoveDroppables]: (data: {
    droppables: ReadonlySet<Droppable>;
  }) => void;
  [DndObserverEventType.Destroy]: () => void;
}
type DndObserverDragData = Readonly<{
  isEnded: boolean;
  data: {
    [key: string]: any;
  };
}>;
interface DndObserverOptions<T extends CollisionData = CollisionData> {
  collisionDetector?: (dndObserver: DndObserver<T>) => CollisionDetector<T>;
}
declare class DndObserver<T extends CollisionData = CollisionData> {
  readonly draggables: ReadonlyMap<DraggableId, AnyDraggable>;
  readonly droppables: ReadonlyMap<DroppableId, Droppable>;
  readonly isDestroyed: boolean;
  protected _drags: Map<AnyDraggable, DndObserverInternalDragData<T>>;
  protected _listenerId: symbol;
  protected _collisionDetector: CollisionDetector<T>;
  protected _emitter: Emitter<{ [K in keyof DndObserverEventCallbacks<T>]: DndObserverEventCallbacks<T>[K] }>;
  constructor(options?: DndObserverOptions<T>);
  get drags(): ReadonlyMap<AnyDraggable, DndObserverDragData>;
  protected _isMatch(draggable: AnyDraggable, droppable: Droppable): boolean;
  protected _getTargets(draggable: AnyDraggable): Map<DroppableId, Droppable>;
  protected _onDragPrepareStart(draggable: AnyDraggable): void;
  protected _onDragStart(draggable: AnyDraggable): void;
  protected _onDragPrepareMove(draggable: AnyDraggable): void;
  protected _onDragMove(draggable: AnyDraggable): void;
  protected _onDragEnd(draggable: AnyDraggable): void;
  protected _onDragCancel(draggable: AnyDraggable): void;
  protected _onDraggableDestroy(draggable: AnyDraggable): void;
  protected _onScroll: () => void;
  protected _stopDrag(draggable: AnyDraggable, canceled?: boolean): void;
  protected _computeCollisions(draggable: AnyDraggable, force?: boolean): void;
  protected _emitCollisions(draggable: AnyDraggable, force?: boolean): void;
  on<K extends keyof DndObserverEventCallbacks<T>>(type: K, listener: DndObserverEventCallbacks<T>[K], listenerId?: SensorEventListenerId): SensorEventListenerId;
  off<K extends keyof DndObserverEventCallbacks<T>>(type: K, listenerId: SensorEventListenerId): void;
  updateDroppableClientRects(): void;
  clearTargets(draggable?: AnyDraggable): void;
  detectCollisions(draggable?: AnyDraggable): void;
  addDraggables(draggables: AnyDraggable[] | Set<AnyDraggable>): void;
  removeDraggables(draggables: AnyDraggable[] | Set<AnyDraggable>): void;
  addDroppables(droppables: Droppable[] | Set<Droppable>): void;
  removeDroppables(droppables: Droppable[] | Set<Droppable>): void;
  destroy(): void;
}
//#endregion
//#region src/dnd-observer/collision-detector.d.ts
interface CollisionData {
  droppableId: DroppableId;
  droppableRect: Rect;
  draggableRect: Rect;
  intersectionRect: Rect;
  intersectionScore: number;
}
declare class CollisionDetector<T extends CollisionData = CollisionData> {
  protected _listenerId: symbol;
  protected _dndObserver: DndObserver<T>;
  protected _cdArenaPool: ObjectArena<T>[];
  protected _cdArenaMap: Map<AnyDraggable, ObjectArena<T>>;
  constructor(dndObserver: DndObserver<T>);
  protected _checkCollision(draggable: AnyDraggable, droppable: Droppable, collisionData: T): T | null;
  protected _sortCollisions(_draggable: AnyDraggable, collisions: T[]): T[];
  protected _createCollisionData(): T;
  protected _getCollisionDataArena(draggable: AnyDraggable): ObjectArena<T>;
  protected _removeCollisionDataArena(draggable: AnyDraggable): void;
  detectCollisions(draggable: AnyDraggable, targets: Map<DroppableId, Droppable>, collisions: T[]): void;
  destroy(): void;
}
//#endregion
export { DndObserverEventCallbacks as a, ObjectArena as c, DndObserverDragData as i, CollisionDetector as n, DndObserverEventType as o, DndObserver as r, DndObserverOptions as s, CollisionData as t };
//# sourceMappingURL=collision-detector-1HO4w8El.d.ts.map