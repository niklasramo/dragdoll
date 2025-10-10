import { Rect } from "./types-Cmt4yuYh.js";
import { Draggable, DraggableId } from "./draggable-DJlxblxx.js";
import { Droppable, DroppableId } from "./droppable-BRN8AuxH.js";
import { Emitter, EventListenerId } from "eventti";

//#region src/utils/fast-object-pool.d.ts
declare class FastObjectPool<Item extends NonNullable<any>, ItemArgs extends any[]> {
  protected _items: Item[];
  protected _index: number;
  protected _getItem: (item?: Item, ...args: ItemArgs) => Item;
  constructor(getItem: (item?: Item, ...args: ItemArgs) => Item);
  get(...args: ItemArgs): Item;
  resetPointer(): void;
  resetItems(maxLength?: number): void;
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
  protected _listenerId: Symbol;
  protected _dndContext: DndContext<T>;
  protected _collisionDataPoolCache: FastObjectPool<T, []>[];
  protected _collisionDataPoolMap: Map<Draggable<any>, FastObjectPool<T, []>>;
  constructor(dndContext: DndContext<T>);
  protected _checkCollision(draggable: Draggable<any>, droppable: Droppable, collisionData: T): T | null;
  protected _sortCollisions(_draggable: Draggable<any>, collisions: T[]): T[];
  protected _createCollisionData(): T;
  getCollisionDataPool(draggable: Draggable<any>): FastObjectPool<T, []>;
  removeCollisionDataPool(draggable: Draggable<any>): void;
  detectCollisions(draggable: Draggable<any>, targets: Map<DroppableId, Droppable>, collisions: T[]): void;
  destroy(): void;
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
    tickerId: Symbol;
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
    draggable: Draggable<any>;
    targets: ReadonlyMap<DroppableId, Droppable>;
  }) => void;
  [DndContextEventType.Move]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlyMap<DroppableId, Droppable>;
  }) => void;
  [DndContextEventType.Enter]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    addedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Leave]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    removedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.Collide]: (data: {
    draggable: Draggable<any>;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
    addedContacts: ReadonlySet<Droppable>;
    removedContacts: ReadonlySet<Droppable>;
    persistedContacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.End]: (data: {
    canceled: boolean;
    draggable: Draggable<any>;
    targets: ReadonlyMap<DroppableId, Droppable>;
    collisions: ReadonlyArray<T>;
    contacts: ReadonlySet<Droppable>;
  }) => void;
  [DndContextEventType.AddDraggables]: (data: {
    draggables: ReadonlySet<Draggable<any>>;
  }) => void;
  [DndContextEventType.RemoveDraggables]: (data: {
    draggables: ReadonlySet<Draggable<any>>;
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
  readonly draggables: ReadonlyMap<DraggableId, Draggable<any>>;
  readonly droppables: ReadonlyMap<DroppableId, Droppable>;
  readonly isDestroyed: boolean;
  protected _drags: Map<Draggable<any>, DndContextInternalDragData<T>>;
  protected _listenerId: Symbol;
  protected _collisionDetector: CollisionDetector<T>;
  protected _emitter: Emitter<{ [K in keyof DndContextEventCallbacks<T>]: DndContextEventCallbacks<T>[K] }>;
  constructor(options?: DndContextOptions<T>);
  get drags(): ReadonlyMap<Draggable<any>, DndContextDragData>;
  protected _isMatch(draggable: Draggable<any>, droppable: Droppable): boolean;
  protected _getTargets(draggable: Draggable<any>): Map<DroppableId, Droppable>;
  protected _onDragPrepareStart(draggable: Draggable<any>): void;
  protected _onDragStart(draggable: Draggable<any>): void;
  protected _onDragPrepareMove(draggable: Draggable<any>): void;
  protected _onDragMove(draggable: Draggable<any>): void;
  protected _onDragEnd(draggable: Draggable<any>): void;
  protected _onDragCancel(draggable: Draggable<any>): void;
  protected _onDraggableDestroy(draggable: Draggable<any>): void;
  protected _onScroll: () => void;
  protected _stopDrag(draggable: Draggable<any>, canceled?: boolean): boolean;
  protected _finalizeStopDrag(draggable: Draggable<any>): void;
  protected _computeCollisions(draggable: Draggable<any>, force?: boolean): void;
  protected _emitCollisions(draggable: Draggable<any>, force?: boolean): void;
  on<K extends keyof DndContextEventCallbacks<T>>(type: K, listener: DndContextEventCallbacks<T>[K], listenerId?: EventListenerId): EventListenerId;
  off<K extends keyof DndContextEventCallbacks<T>>(type: K, listenerId: EventListenerId): void;
  updateDroppableClientRects(): void;
  clearTargets(draggable?: Draggable<any>): void;
  detectCollisions(draggable?: Draggable<any>): void;
  addDraggables(draggables: Draggable<any>[] | Set<Draggable<any>>): void;
  removeDraggables(draggables: Draggable<any>[] | Set<Draggable<any>>): void;
  addDroppables(droppables: Droppable[] | Set<Droppable>): void;
  removeDroppables(droppables: Droppable[] | Set<Droppable>): void;
  destroy(): void;
}
//#endregion
export { CollisionData, CollisionDetector, DndContext, DndContextDragData, DndContextEventCallbacks, DndContextEventType, DndContextOptions, FastObjectPool };
//# sourceMappingURL=dnd-context-BQm7H-JV.d.ts.map