import { a as Rect } from "./types-BaIRuLz3.js";
import { a as SensorEventListenerId } from "./sensor-B14KhysP.js";
import { c as DraggableId, t as AnyDraggable } from "./draggable-C2gZFZ9L.js";
import { i as DroppableId, t as Droppable } from "./droppable-VRCq0tBK.js";
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
//#region src/dnd-context/dnd-context.d.ts
declare enum CollisionDetectionPhase {
  Idle = 0,
  Computing = 1,
  Computed = 2,
  Emitting = 3,
}
interface DndContextInternalDragData<T extends CollisionData = CollisionData> {
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
declare const DndContextEventType: {
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
type DndContextEventType = (typeof DndContextEventType)[keyof typeof DndContextEventType];
interface DndContextEventCallbacks<T extends CollisionData = CollisionData> {
  [DndContextEventType.Start]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
  }) => void;
  [DndContextEventType.Move]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
  }) => void;
  [DndContextEventType.Enter]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    addedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Leave]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    removedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Collide]: (data: {
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    addedContacts: ReadonlySet<Droppable>;
    removedContacts: ReadonlySet<Droppable>;
    persistedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.End]: (data: {
    canceled: boolean;
    draggable: AnyDraggable;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.AddDraggables]: (data: {
    draggables: ReadonlySet<AnyDraggable>;
  }) => void;
  [DndContextEventType.RemoveDraggables]: (data: {
    draggables: ReadonlySet<AnyDraggable>;
  }) => void;
  [DndContextEventType.AddDroppables]: (data: {
    droppables: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.RemoveDroppables]: (data: {
    droppables: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Destroy]: () => void;
}
type DndContextDragData = Readonly<{
  isEnded: boolean;
  data: {
    [key: string]: any;
  };
}>;
interface DndContextOptions<T extends CollisionData = CollisionData> {
  collisionDetector?: (dndContext: DndContext<T>) => CollisionDetector<T>;
}
declare class DndContext<T extends CollisionData = CollisionData> {
  readonly draggables: ReadonlyMap<DraggableId, AnyDraggable>;
  readonly droppables: ReadonlyMap<DroppableId, Droppable>;
  readonly isDestroyed: boolean;
  protected _drags: Map<AnyDraggable, DndContextInternalDragData<T>>;
  protected _listenerId: symbol;
  protected _collisionDetector: CollisionDetector<T>;
  protected _emitter: Emitter<{ [K in keyof DndContextEventCallbacks<T>]: DndContextEventCallbacks<T>[K] }>;
  constructor(options?: DndContextOptions<T>);
  get drags(): ReadonlyMap<AnyDraggable, DndContextDragData>;
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
  on<K extends keyof DndContextEventCallbacks<T>>(type: K, listener: DndContextEventCallbacks<T>[K], listenerId?: SensorEventListenerId): SensorEventListenerId;
  off<K extends keyof DndContextEventCallbacks<T>>(type: K, listenerId: SensorEventListenerId): void;
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
//#region src/dnd-context/collision-detector.d.ts
interface CollisionData {
  droppableId: DroppableId;
  droppableRect: Rect;
  draggableRect: Rect;
  intersectionRect: Rect;
  intersectionScore: number;
}
declare class CollisionDetector<T extends CollisionData = CollisionData> {
  protected _listenerId: symbol;
  protected _dndContext: DndContext<T>;
  protected _cdArenaPool: ObjectArena<T>[];
  protected _cdArenaMap: Map<AnyDraggable, ObjectArena<T>>;
  constructor(dndContext: DndContext<T>);
  protected _checkCollision(draggable: AnyDraggable, droppable: Droppable, collisionData: T): T | null;
  protected _sortCollisions(_draggable: AnyDraggable, collisions: T[]): T[];
  protected _createCollisionData(): T;
  protected _getCollisionDataArena(draggable: AnyDraggable): ObjectArena<T>;
  protected _removeCollisionDataArena(draggable: AnyDraggable): void;
  detectCollisions(draggable: AnyDraggable, targets: Map<DroppableId, Droppable>, collisions: T[]): void;
  destroy(): void;
}
//#endregion
export { DndContextEventCallbacks as a, ObjectArena as c, DndContextDragData as i, CollisionDetector as n, DndContextEventType as o, DndContext as r, DndContextOptions as s, CollisionData as t };
//# sourceMappingURL=collision-detector-B8HMC9fJ.d.ts.map