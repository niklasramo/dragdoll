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
dndContext.on('enter', ({ draggable, targets, collisions, addedCollisions, collisionData }) => {
  console.log('Draggable Entered', draggable, targets, collisions, addedCollisions, collisionData);
});
dndContext.on('leave', ({ draggable, targets, collisions, removedCollisions, collisionData }) => {
  console.log('Draggable Left', draggable, targets, collisions, removedCollisions, collisionData);
});
dndContext.on('over', ({ draggable, targets, collisions, persistedCollisions, collisionData }) => {
  console.log('Draggable Over', draggable, targets, collisions, persistedCollisions, collisionData);
});
dndContext.on('drop', ({ draggable, targets, collisions, collisionData }) => {
  console.log('Draggable Dropped', draggable, targets, collisions, collisionData);
});
dndContext.on('end', ({ draggable, targets }) => {
  console.log('Drag Ended', draggable, targets);
});
dndContext.on('cancel', ({ draggable, targets }) => {
  console.log('Drag Cancelled', draggable, targets);
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

If the draggable is already being dragged, it initiates appropriate processing.

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

Note: Collision detection is not automatically run when adding droppables. Call `detectCollisions` manually if needed.

### removeDroppable

```ts
// Type
type removeDroppable = (droppable: Droppable) => void;

// Usage
dndContext.removeDroppable(droppable);
```

Deregisters a droppable from the context. This removes it from the internal registry, unbinds its destroy event, and updates affected draggables by removing the droppable from their targets.

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
type detectCollisions = (draggable: Draggable<any>) => void;

// Usage
dndContext.detectCollisions(draggable);
```

Manually triggers collision detection for a draggable. This compares current and new collisions and emits the appropriate events (`enter`, `leave`, `over`).

### getData

```ts
// Type
type getData = (draggable: Draggable<any>) => { [key: string]: any } | null;

// Usage
const dragData = dndContext.getData(draggable);
```

Returns any stored drag data for the specified draggable. Returns `null` if no drag data exists.

### clearTargets

```ts
// Type
type clearTargets = (draggable: Draggable<any>) => void;

// Usage
dndContext.clearTargets(draggable);
```

Clears cached target information for the specified draggable, forcing re-evaluation on the next move.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
dndContext.destroy();
```

Destroys the DndContext by emitting the `destroy` event, unbinding all event listeners, clearing all internal data structures, and destroying the collision detector.

## Events

### start

```ts
type start = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when a draggable starts dragging.

**Event Data:**

- `draggable` - The draggable instance that started dragging.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).

### move

```ts
type move = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when a draggable moves during dragging.

**Event Data:**

- `draggable` - The draggable instance that is moving.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).

### enter

```ts
type enter = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  addedCollisions: Droppable[];
  collisionData: Map<Droppable, CollisionData>;
}) => void;
```

Emitted when a draggable first collides with one or more droppables.

**Event Data:**

- `draggable` - The draggable instance that entered collision with droppables.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).
- `collisions` - Array of all droppable instances currently colliding with the draggable (includes `addedCollisions`).
- `addedCollisions` - Array of droppable instances that newly entered collision state in this detection cycle.
- `collisionData` - Map containing detailed [collision information](/collision-detector#collisiondata-interface) for each colliding droppable.

### leave

```ts
type leave = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  removedCollisions: Droppable[];
  collisionData: Map<Droppable, CollisionData>;
}) => void;
```

Emitted when a draggable stops colliding with one or more droppables.

**Event Data:**

- `draggable` - The draggable instance that left collision with droppables.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).
- `collisions` - Array of all droppable instances currently colliding with the draggable (excludes `removedCollisions`).
- `removedCollisions` - Array of droppable instances that newly exited collision state in this detection cycle.
- `collisionData` - Map containing detailed [collision information](/collision-detector#collisiondata-interface) for each colliding droppable.

### over

```ts
type over = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  persistedCollisions: Droppable[];
  collisionData: Map<Droppable, CollisionData>;
}) => void;
```

Emitted for persisting collisions. In other words, this will not be emitted on the initial collision, only the consecutive ones.

**Event Data:**

- `draggable` - The draggable instance that is over droppables.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).
- `collisions` - Array of all droppable instances currently colliding with the draggable (includes `persistedCollisions`).
- `persistedCollisions` - Array of droppable instances that remain in collision from the previous collision detection check (excludes newly entered collisions).
- `collisionData` - Map containing detailed [collision information](/collision-detector#collisiondata-interface) for each colliding droppable.

### drop

```ts
type drop = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  collisionData: Map<Droppable, CollisionData>;
}) => void;
```

Emitted when a draggable is dropped while colliding with one or more droppables.

**Event Data:**

- `draggable` - The draggable instance that was dropped.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).
- `collisions` - Array of droppable instances that were colliding with the draggable at the time of drop.
- `collisionData` - Map containing detailed [collision information](/collision-detector#collisiondata-interface) for each colliding droppable.

### end

```ts
type end = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when the drag ends, regardless of whether a drop occurred.

**Event Data:**

- `draggable` - The draggable instance that ended dragging.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).

### cancel

```ts
type cancel = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when a drag is cancelled (e.g., by pressing Escape).

**Event Data:**

- `draggable` - The draggable instance that was cancelled.
- `targets` - Array of all droppable instances that accept this draggable (based on the droppable's `accept` criteria and the draggable's `group`).

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
