# DndContext

The `DndContext` class tracks collisions between draggables and droppables and dispatches events during the drag and drop lifecycle.

## Example

```ts
import { DndContext, Draggable, Droppable, CollisionDetector } from 'dragdoll';
import { PointerSensor } from 'dragdoll';

// Create a DndContext instance.
const dndContext = new DndContext();

// Create a draggable
const draggableElement = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(draggableElement);
const draggable = new Draggable([pointerSensor], {
  elements: () => [draggableElement],
  group: 'groupA',
});

// Create a droppable
const dropZoneElement = document.querySelector('.drop-zone') as HTMLElement;
const droppable = new Droppable(dropZoneElement, {
  accept: ['groupA'],
});

// Add draggables and droppables to the context.
dndContext.addDraggable(draggable);
dndContext.addDroppable(droppable);

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
dndContext.on('end', ({ isCancelled, draggable, targets, collisions, contacts }) => {
  console.log('End', { isCancelled, draggable, targets, collisions, contacts });
});
```

## Constructor

```ts
class DndContext {
  constructor(options?: DndContextOptions) {}
}
```

### Parameters

1. **options**
   - An optional configuration object with the following properties:
     - **`collisionDetector`**
       - Either a collision detector options object or a factory function that creates a custom `CollisionDetector` instance.
       - If an options object is provided, it will be used to configure the default `CollisionDetector`.
       - If a factory function is provided, it receives the `DndContext` instance as an argument and should return a `CollisionDetector`.
       - If not provided, a default `CollisionDetector` will be created.
       - See the [CollisionDetector](/collision-detector) documentation for more details.

## Properties

### draggables

```ts
readonly draggables: ReadonlySet<Draggable<any>>;
```

A read-only set containing all registered draggable instances.

### droppables

```ts
readonly droppables: ReadonlyMap<Symbol, Droppable>;
```

A read-only map containing all registered droppable instances, keyed by their unique symbol IDs.

### drags

```ts
readonly drags: ReadonlyMap<
  Draggable<any>,
  Readonly<{ isEnded: boolean; data: { [key: string]: any } }>
>;
```

A read-only map of all currently dragged draggables and their public dnd context state. The key is the draggable instance and the value is the _readonly_ drag data object. The drag data object is read-only so you can't mutate it, but you can mutate the nested `data` object and store per-drag state while keeping the reference stable.

```ts
// Get all draggables that are currently being dragged.
const draggedDraggables = dndContext.drags.keys();

// Get the drag data object for a specific draggable.
const dragData = dndContext.drags.get(draggable);
```

## Methods

### on

```ts
// Type
type on = <T extends keyof DndContextEventCallbacks>(
  type: T,
  listener: DndContextEventCallbacks[T],
  listenerId?: EventListenerId,
) => EventListenerId;

// Usage
const id = dndContext.on('drop', ({ draggable, collisions }) => {
  console.log('Dropped on', collisions);
});
```

Adds an event listener to the DndContext for the specified event type.

The method returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

```ts
// Type
type off = <T extends keyof DndContextEventCallbacks>(type: T, listenerId: EventListenerId) => void;

// Usage
dndContext.off('drop', id);
```

Removes an event listener from the DndContext based on its listener id.

### addDraggable

```ts
// Type
type addDraggable = (draggable: Draggable<any>) => void;

// Usage
dndContext.addDraggable(draggable);
```

Registers a draggable instance with the context. This adds the draggable to the internal registry, binds to its events, and emits the `addDraggable` event.

If the draggable is being dragged when it is added to the context, dnd context will try to start the drag process for the draggable automatically so that it can start emitting dnd context's events.

### removeDraggable

```ts
// Type
type removeDraggable = (draggable: Draggable<any>) => void;

// Usage
dndContext.removeDraggable(draggable);
```

Deregisters a draggable instance from the context. This removes all bound event listeners, cleans up drag data, and emits the appropriate events.

### addDroppable

```ts
// Type
type addDroppable = (droppable: Droppable) => void;

// Usage
dndContext.addDroppable(droppable);
```

Registers a droppable with the context. This adds it to the internal registry, binds its destroy event, and updates any active draggables with the new droppable as a potential target.

If any active draggable now matches the newly added droppable, a collision check is _queued_ automatically.

### removeDroppable

```ts
// Type
type removeDroppable = (droppable: Droppable) => void;

// Usage
dndContext.removeDroppable(droppable);
```

Deregisters a droppable from the context. This removes it from the internal registry, unbinds its destroy event, and updates affected draggables by removing the droppable from their targets.

If any active draggable had an ongoing collision with the removed droppable, a collision check is queued automatically, which may emit `leave` events on the next tick.

### updateDroppableClientRects

```ts
// Type
type updateDroppableClientRects = () => void;

// Usage
dndContext.updateDroppableClientRects();
```

Updates the cached client rectangles for all registered droppables. This is automatically called on scroll events and when drag starts, but can be manually triggered if needed.

### detectCollisions

```ts
// Type
type detectCollisions = (draggable?: Draggable<any>) => void;

// Usage: specific draggable
dndContext.detectCollisions(draggable);

// Usage: all active drags
dndContext.detectCollisions();
```

Queues collision detection for either a specific draggable, or for all currently active draggables when called without an argument. This compares current and new collisions and emits the appropriate events (`enter`, `leave`, `collide`).

// Removed: getDragData
// Use the `drags` map instead: dndContext.drags.get(draggable)

### clearTargets

```ts
// Type
type clearTargets = (draggable?: Draggable<any>) => void;

// Usage: specific draggable
dndContext.clearTargets(draggable);

// Usage: all active draggables
dndContext.clearTargets();
```

Clears cached target information for the specified draggable (or all active draggables when called without an argument), forcing re-evaluation on the next detection. Call this if the draggable's group changes or if any droppable's `accept` criteria changes during a drag. Targets are computed on drag start and cached for performance.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
dndContext.destroy();
```

Destroys the DndContext by emitting the `destroy` event, unbinding all event listeners, clearing all internal data structures, and destroying the collision detector.

## Events

To keep memory allocations to a minimum most of the event data objects are reused/pooled between events. Treat all event data objects as read-only and assume that they are mutated between events.

In practice this means that you should not store the event data objects in your own variables for later use, but rather use them directly in your event or store the specific primitive values that you need. You can also clone the event data objects if you need to store them for later use.

### start

```ts
type start = (data: { draggable: Draggable<any>; targets: ReadonlyMap<Symbol, Droppable> }) => void;
```

Emitted when a draggable starts dragging.

**Event Data:**

- `draggable` - The draggable instance that started dragging.
- `targets` - Map (read-only) of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`). Keyed by `droppable.id`.

### move

```ts
type move = (data: { draggable: Draggable<any>; targets: ReadonlyMap<Symbol, Droppable> }) => void;
```

Emitted when a draggable moves during dragging.

**Event Data:**

- `draggable` - The draggable instance that is moving.
- `targets` - Map (read-only) of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`). Keyed by `droppable.id`.

### enter

```ts
type enter = (data: {
  draggable: Draggable<any>;
  targets: ReadonlyMap<Symbol, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
  addedContacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted when a draggable first collides with one or more droppables.

**Event Data:**

- `draggable` - The draggable instance that entered collision with droppables.
- `targets` - Map (read-only) of all droppable instances that accept this draggable.
- `collisions` - Array (read-only) of collision data for all current collisions (includes the newly added ones). Each collision contains `droppableId`.
- `contacts` - Set (read-only) of droppable instances currently in collision.
- `addedContacts` - Set (read-only) of droppable instances that newly entered collision in this cycle.

### leave

```ts
type leave = (data: {
  draggable: Draggable<any>;
  targets: ReadonlyMap<Symbol, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
  removedContacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted when a draggable stops colliding with one or more droppables.

**Event Data:**

- `draggable` - The draggable instance that left collision with droppables.
- `targets` - Map (read-only) of all droppable instances that accept this draggable.
- `collisions` - Array (read-only) of collision data for current collisions (excludes removed ones). Each collision contains `droppableId`.
- `contacts` - Set (read-only) of droppable instances currently in collision.
- `removedContacts` - Set (read-only) of droppables that exited collision in this cycle.

### collide

```ts
type collide = (data: {
  draggable: Draggable<any>;
  targets: ReadonlyMap<Symbol, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
  addedContacts: ReadonlySet<Droppable>;
  removedContacts: ReadonlySet<Droppable>;
  persistedContacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted each collision cycle if there are any current collisions or removed collisions. Use this event to process all contact changes transactionally in one hook.

**Event Data:**

- `draggable` - The draggable instance for this cycle.
- `targets` - Map (read-only) of all droppable instances that accept this draggable.
- `collisions` - Array (read-only) of collision data for current collisions.
- `contacts` - Set (read-only) of droppable instances currently in collision.
- `addedContacts` - Set (read-only) of droppables newly entered this cycle.
- `removedContacts` - Set (read-only) of droppables left this cycle.
- `persistedContacts` - Set (read-only) of droppables that remained in collision from the previous cycle.

### end

```ts
type end = (data: {
  isCancelled: boolean;
  draggable: Draggable<any>;
  targets: ReadonlyMap<Symbol, Droppable>;
  collisions: ReadonlyArray<CollisionData>;
  contacts: ReadonlySet<Droppable>;
}) => void;
```

Emitted when the drag ends, regardless of whether there are active collisions. If `isCancelled` is `true`, the drag ended due to cancellation. When ending during an ongoing collision emission, the `end` event is still emitted synchronously; cleanup is deferred to a microtask to keep event data intact for the current cycle.

**Event Data:**

- `isCancelled` - Whether the drag ended due to cancellation.
- `draggable` - The draggable instance that ended dragging.
- `targets` - Map (read-only) of all droppable instances that accept this draggable.
- `collisions` - Array (read-only) of collision data captured at the time of end.
- `contacts` - Set (read-only) of droppable instances currently in collision at the time of end.

### addDraggable

```ts
type addDraggable = (data: { draggable: Draggable<any> }) => void;
```

Emitted when a draggable is registered with the context.

**Event Data:**

- `draggable` - The draggable instance that was added to the context.

### removeDraggable

```ts
type removeDraggable = (data: { draggable: Draggable<any> }) => void;
```

Emitted when a draggable is deregistered from the context.

**Event Data:**

- `draggable` - The draggable instance that was removed from the context.

### addDroppable

```ts
type addDroppable = (data: { droppable: Droppable }) => void;
```

Emitted when a droppable is registered with the context.

**Event Data:**

- `droppable` - The droppable instance that was added to the context.

### removeDroppable

```ts
type removeDroppable = (data: { droppable: Droppable }) => void;
```

Emitted when a droppable is deregistered from the context.

**Event Data:**

- `droppable` - The droppable instance that was removed from the context.

### destroy

```ts
type destroy = () => void;
```

Emitted when the DndContext is destroyed.
