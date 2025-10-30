# DndContext

The `DndContext` class tracks collisions between draggables and droppables and dispatches events during the drag and drop lifecycle.

## Example

```ts
import { DndContext } from 'dragdoll/dnd-context';
import { CollisionDetector } from 'dragdoll/dnd-context/collision-detector';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { PointerSensor } from 'dragdoll/sensors/pointer';

// Create a DndContext instance.
const dndContext = new DndContext();

// Create a draggable
const draggableElement = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(draggableElement);
const draggable = new Draggable([pointerSensor], {
  elements: () => [draggableElement],
  dndGroups: ['groupA'],
});

// Create a droppable
const dropZoneElement = document.querySelector('.drop-zone') as HTMLElement;
const droppable = new Droppable(dropZoneElement, {
  accept: ['groupA'],
});

// Add draggables and droppables to the context.
dndContext.addDraggables([draggable]);
dndContext.addDroppables([droppable]);

// Listen to events.
dndContext.on('start', ({ draggable, targets }) => {
  console.log('Drag Started', draggable, targets);
});
dndContext.on('move', ({ draggable, targets }) => {
  console.log('Drag Moved', draggable, targets);
});
dndContext.on('enter', ({ draggable, targets, collisions, contacts, addedContacts }) => {
  console.log('Enter', { draggable, targets, collisions, contacts, addedContacts });
});
dndContext.on('leave', ({ draggable, targets, collisions, contacts, removedContacts }) => {
  console.log('Leave', { draggable, targets, collisions, contacts, removedContacts });
});
dndContext.on(
  'collide',
  ({
    draggable,
    targets,
    collisions,
    contacts,
    addedContacts,
    removedContacts,
    persistedContacts,
  }) => {
    console.log('Collide', {
      draggable,
      targets,
      collisions,
      contacts,
      addedContacts,
      removedContacts,
      persistedContacts,
    });
  },
);
dndContext.on('end', ({ canceled, draggable, targets, collisions, contacts }) => {
  console.log('End', { canceled, draggable, targets, collisions, contacts });
});
```

## Class

```ts
class DndContext<T extends CollisionData = CollisionData> {
  constructor(options: DndContextOptions<T> = {}) {}
}
```

### Type Variables

1. **T**
   - The type of the collision data.
   - Defaults to [`CollisionData`](/collision-detector#collisiondata).

### Constructor Parameters

1. **options**
   - An optional configuration object with the following properties:
     - **`collisionDetector`**
       - A factory function that receives the `DndContext` instance and returns a `CollisionDetector`.
       - If not provided, a default `CollisionDetector` will be created.
       - See the [CollisionDetector](/collision-detector) docs for subclassing examples.

## Properties

### draggables

```ts
type draggables = ReadonlyMap<DraggableId, AnyDraggable>;
```

A read-only map containing all registered draggable instances, keyed by their unique ID.

### droppables

```ts
type droppables = ReadonlyMap<DroppableId, Droppable>;
```

A read-only map containing all registered droppable instances, keyed by their unique ID.

### drags

```ts
type drags = ReadonlyMap<AnyDraggable, DndContextDragData>;
```

A read-only map of all currently dragged draggables and their public [drag data](#dndcontextdragdata).

**Example**

```ts
// Get all draggables that are currently being dragged.
const draggedDraggables = dndContext.drags.keys();

// Get the drag data object for a specific draggable.
const dragData = dndContext.drags.get(draggable);
```

## Methods

### on

```ts
type on<K extends keyof DndContextEventCallbacks<T>> = (
  type: K,
  listener: DndContextEventCallbacks<T>[K],
  listenerId?: SensorEventListenerId,
) => SensorEventListenerId;
```

Adds an event listener to the DndContext for the specified event type.

The method returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

**Example**

```ts
const id = dndContext.on('end', ({ draggable, collisions }) => {
  console.log('Dropped on', collisions);
});
```

### off

```ts
type off<K extends keyof DndContextEventCallbacks<T>> = (
  type: K,
  listenerId: SensorEventListenerId,
) => void;
```

Removes an event listener from the DndContext based on its listener id.

**Example**

```ts
dndContext.off('end', id);
```

### addDraggables

```ts
type addDraggables = (draggables: AnyDraggable[]>[] | Set<AnyDraggable>) => void;

```

Registers one or more draggable instances with the context. This adds the draggables to the internal registry, binds to their events, and emits the `addDraggables` event.

If any of the draggables are already being dragged, dnd context will start the drag process for them manually.

**Example**

```ts
dndContext.addDraggables([draggable]);
```

### removeDraggables

```ts
type removeDraggables = (draggables: AnyDraggable[]>[] | Set<AnyDraggable>) => void;
```

Deregisters one or more draggable instances from the context. This removes all bound event listeners, cleans up drag data, and emits the appropriate events.

**Example**

```ts
dndContext.removeDraggables([draggable]);
```

### addDroppables

```ts
type addDroppables = (droppables: Droppable[] | Set<Droppable>) => void;
```

Registers one or more droppables with the context. This adds them to the internal registry, binds their destroy event, and updates any active draggables with the new droppables as potential targets.

If any active draggable now matches the newly added droppables, a collision check is _queued_ automatically.

**Example**

```ts
dndContext.addDroppables([droppable]);
```

### removeDroppables

```ts
type removeDroppables = (droppables: Droppable[] | Set<Droppable>) => void;
```

Deregisters one or more droppables from the context. This removes them from the internal registry, unbinds their destroy event, and updates affected draggables by removing the droppables from their targets.

If any active draggable had an ongoing collision with the removed droppables, a collision check is queued automatically, which may emit `leave` events on the next tick.

**Example**

```ts
dndContext.removeDroppables([droppable]);
```

### updateDroppableClientRects

```ts
type updateDroppableClientRects = () => void;
```

Updates the cached client rectangles for all registered droppables. This is automatically called on scroll events and when drag starts, but can be manually triggered if needed.

**Example**

```ts
dndContext.updateDroppableClientRects();
```

### detectCollisions

```ts
type detectCollisions = (draggable?: AnyDraggable) => void;
```

Queues collision detection for either a specific draggable, or for all currently active draggables when called without an argument. This compares current and new collisions and emits the appropriate events (`enter`, `leave`, `collide`).

**Example**

```ts
// Specific draggable.
dndContext.detectCollisions(draggable);

// All active (dragged) draggables.
dndContext.detectCollisions();
```

### clearTargets

```ts
type clearTargets = (draggable?: AnyDraggable) => void;
```

Clears cached target information for the specified draggable (or all active draggables when called without an argument), forcing re-evaluation on the next detection. Call this if the draggable's [dndGroups](/draggable#dndgroups) changes or if any droppable's [`accept`](/droppable#accept) criteria changes during a drag. Targets are computed on drag start and cached for performance.

**Example**

```ts
// Specific draggable.
dndContext.clearTargets(draggable);

// All active (dragged) draggables.
dndContext.clearTargets();
```

### destroy

```ts
type destroy = () => void;
```

Destroys the DndContext by emitting the `destroy` event, unbinding all event listeners, clearing all internal data structures, and destroying the collision detector.

**Example**

```ts
dndContext.destroy();
```

## Events

To keep memory allocations to a minimum most of the event data objects are reused/pooled between events. Treat all event data objects as read-only and assume that they are mutated between events.

In practice this means that you should not store the event data objects in your own variables for later use, but rather use them directly in your event or store the specific primitive values that you need. You can also clone the event data objects if you need to store them for later use.

For a quick reference of all events and their listener function signatures you can glance at the [DndContextEventCallbacks](#dndcontexteventcallbacks) interface. Below you will find a more detailed description of each event.

### start

```ts
type start = (data: {
  draggable: AnyDraggable;
  targets: ReadonlyMap<DroppableId, Droppable>;
}) => void;
```

Emitted when a draggable starts dragging.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggable`**
       - The draggable instance that started dragging.
     - **`targets`**
       - Map (read-only) of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`). Keyed by `droppable.id`.

### move

```ts
type move = (data: {
  draggable: AnyDraggable;
  targets: ReadonlyMap<DroppableId, Droppable>;
}) => void;
```

Emitted when a draggable moves during dragging.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggable`**
       - The draggable instance that is moving.
     - **`targets`**
       - A (read-only) map of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`). Keyed by `droppable.id`.

### enter

```ts
type enter = (data: {
  draggable: AnyDraggable;
  targets: ReadonlyMap<DroppableId, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
  addedContacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted when a draggable first collides with one or more droppables.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggable`**
       - The draggable instance that entered collision with droppables.
     - **`targets`**
       - A (read-only) map of all droppable instances that accept this draggable. Keyed by `droppable.id`.
     - **`collisions`**
       - An array (read-only) of collision data for all current collisions (includes the newly added ones). Each collision contains `droppableId`.
     - **`contacts`**
       - A set (read-only) of droppable instances currently in collision.
     - **`addedContacts`**
       - A set (read-only) of droppable instances that newly entered collision in this cycle.

### leave

```ts
type leave = (data: {
  draggable: AnyDraggable;
  targets: ReadonlyMap<DroppableId, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
  removedContacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted when a draggable stops colliding with one or more droppables.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggable`**
       - The draggable instance that left collision with droppables.
     - **`targets`**
       - A (read-only) map of all droppable instances that accept this draggable. Keyed by `droppable.id`.
     - **`collisions`**
       - An array (read-only) of collision data for current collisions (excludes removed ones). Each collision contains `droppableId`.
     - **`contacts`**
       - A set (read-only) of droppable instances currently in collision.
     - **`removedContacts`**
       - A set (read-only) of droppables that exited collision in this cycle.

### collide

```ts
type collide = (data: {
  draggable: AnyDraggable;
  targets: ReadonlyMap<DroppableId, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
  addedContacts: ReadonlySet<Droppable>;
  removedContacts: ReadonlySet<Droppable>;
  persistedContacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted each collision cycle if there are any current collisions or removed collisions. Use this event to process all contact changes transactionally in one hook.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggable`**
       - The draggable instance for this cycle.
     - **`targets`**
       - A (read-only) map of all droppable instances that accept this draggable. Keyed by `droppable.id`.
     - **`collisions`**
       - An array (read-only) of collision data for current collisions.
     - **`contacts`**
       - A set (read-only) of droppable instances currently in collision.
     - **`addedContacts`**
       - A set (read-only) of droppables newly entered this cycle.
     - **`removedContacts`**
       - A set (read-only) of droppables left this cycle.
     - **`persistedContacts`**
       - A set (read-only) of droppables that remained in collision from the previous cycle.

### end

```ts
type end = (data: {
  canceled: boolean;
  draggable: AnyDraggable;
  targets: ReadonlyMap<DroppableId, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted when the drag ends, regardless of whether there are active collisions. If `canceled` is `true`, the drag ended due to cancellation. The `end` event is emitted after a final collision detection and emission pass. Cleanup happens synchronously. Ending during collision emission is disallowed and throws an error.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`canceled`**
       - Whether the drag ended due to cancellation.
     - **`draggable`**
       - The draggable instance that ended dragging.
     - **`targets`**
       - A (read-only) map of all droppable instances that accept this draggable. Keyed by `droppable.id`.
     - **`collisions`**
       - An array (read-only) of collision data captured at the time of end.
     - **`contacts`**
       - A set (read-only) of droppable instances currently in collision at the time of end.

### addDraggables

```ts
type addDraggables = (data: { draggables: ReadonlySet<AnyDraggable> }) => void;
```

Emitted when one or more draggables are registered with the context.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggables`**
       - A set (read-only) of draggable instances that were added to the context.

### removeDraggables

```ts
type removeDraggables = (data: { draggables: ReadonlySet<AnyDraggable> }) => void;
```

Emitted when one or more draggables are deregistered from the context.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`draggables`**
       - A set (read-only) of draggable instances that were removed from the context.

### addDroppables

```ts
type addDroppables = (data: { droppables: ReadonlySet<Droppable> }) => void;
```

Emitted when one or more droppables are registered with the context.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`droppables`**
       - A set (read-only) of droppable instances that were added to the context.

### removeDroppables

```ts
type removeDroppables = (data: { droppables: ReadonlySet<Droppable> }) => void;
```

Emitted when one or more droppables are deregistered from the context.

**Parameters:**

1. **`data`**
   - An object with the following properties:
     - **`droppables`**
       - A set (read-only) of droppable instances that were removed from the context.

### destroy

```ts
type destroy = () => void;
```

Emitted when the DndContext is destroyed.

## Exports

### DndContextEventType

```ts
// Import
import { DndContextEventType } from 'dragdoll/dnd-context';

// Enum (object literal)
const DndContextEventType = {
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
```

## Types

### DndContextEventType

```ts
// Import
import type { DndContextEventType } from 'dragdoll/dnd-context';

// Type
type DndContextEventType =
  | 'start'
  | 'move'
  | 'end'
  | 'destroy'
  | 'enter'
  | 'leave'
  | 'collide'
  | 'addDraggables'
  | 'removeDraggables'
  | 'addDroppables'
  | 'removeDroppables';
```

### DndContextEventCallbacks

```ts
// Import
import type { DndContextEventCallbacks } from 'dragdoll/dnd-context';

// Interface
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
  [DndContextEventType.AddDraggables]: (data: { draggables: ReadonlySet<AnyDraggable> }) => void;
  [DndContextEventType.RemoveDraggables]: (data: { draggables: ReadonlySet<AnyDraggable> }) => void;
  [DndContextEventType.AddDroppables]: (data: { droppables: ReadonlySet<Droppable> }) => void;
  [DndContextEventType.RemoveDroppables]: (data: { droppables: ReadonlySet<Droppable> }) => void;
  [DndContextEventType.Destroy]: () => void;
}
```

### DndContextDragData

```ts
// Import
import type { DndContextDragData } from 'dragdoll/dnd-context';

// Type
type DndContextDragData = Readonly<{
  isEnded: boolean;
  data: { [key: string]: any };
}>;
```

### DndContextOptions

```ts
// Import
import type { DndContextOptions } from 'dragdoll/dnd-context';

// Interface
interface DndContextOptions<T extends CollisionData = CollisionData> {
  collisionDetector?: (dndContext: DndContext<T>) => CollisionDetector<T>;
}
```
