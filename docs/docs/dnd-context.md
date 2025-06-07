# DndContext

The `DndContext` class orchestrates interactions between draggables and droppables.
It registers draggable and droppable instances, handles collision detection,
and dispatches events during the drag and drop lifecycle.

## Example

```ts
import { DndContext, Draggable, Droppable } from 'dragdoll';
import { PointerSensor } from 'dragdoll';

const dndContext = new DndContext();

// Create a draggable
const draggableElement = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(draggableElement);
const draggable = new Draggable([pointerSensor], {
  elements: () => [draggableElement],
  group: 'groupA',
});

// Create a droppable
const dropZone = document.querySelector('.drop-zone') as HTMLElement;
const droppable = new Droppable(dropZone, {
  accept: ['groupA'],
});

// Register elements with the context
dndContext.addDraggable(draggable);
dndContext.addDroppable(droppable);

// Listen to drag events
dndContext.on('start', ({ draggable, targets }) => {
  console.log('Drag started', draggable, targets);
});

dndContext.on('drop', ({ draggable, collisions }) => {
  console.log('Dropped on', collisions);
});
```

## Constructor

```ts
class DndContext {
  constructor(options?: {
    collisionDetection?: (draggable: Draggable<any>, droppables: Set<Droppable>) => Set<Droppable>;
  }) {}
}
```

### Parameters

1. **options**
   - An optional options object with the following properties:
     - **`collisionDetection`**
       - A custom collision detection function used to determine which droppables are colliding with a draggable element.

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

### removeDroppable

```ts
// Type
type removeDroppable = (droppable: Droppable) => void;

// Usage
dndContext.removeDroppable(droppable);
```

Deregisters a droppable from the context. This removes it from the internal registry, unbinds its destroy event, and updates affected draggables by removing the droppable from their targets.

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

Destroys the DndContext by emitting the `destroy` event, unbinding all event listeners, and clearing all internal data structures.

## Events

### start

```ts
type start = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when a draggable starts dragging. The callback receives the draggable instance and an array of potential droppable targets.

### move

```ts
type move = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when a draggable moves during dragging.

### enter

```ts
type enter = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  addedCollisions: Droppable[];
}) => void;
```

Emitted when a draggable first collides with one or more droppables. The `addedCollisions` array contains only the droppables that newly entered collision state.

### leave

```ts
type leave = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  removedCollisions: Droppable[];
}) => void;
```

Emitted when a draggable stops colliding with one or more droppables. The `removedCollisions` array contains only the droppables that newly exited collision state.

### over

```ts
type over = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
  persistedCollisions: Droppable[];
}) => void;
```

Emitted for persisting collisions—when a draggable continues colliding with droppables. The `persistedCollisions` array contains only the droppables that remain in collision from the previous collision detection.

### drop

```ts
type drop = (data: {
  draggable: Draggable<any>;
  targets: Droppable[];
  collisions: Droppable[];
}) => void;
```

Emitted when a draggable is dropped while colliding with one or more droppables.

### end

```ts
type end = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when the drag ends, regardless of whether a drop occurred.

### cancel

```ts
type cancel = (data: { draggable: Draggable<any>; targets: Droppable[] }) => void;
```

Emitted when a drag is cancelled (e.g., by pressing Escape).

### addDraggable

```ts
type addDraggable = (data: { draggable: Draggable<any> }) => void;
```

Emitted when a draggable is registered with the context.

### removeDraggable

```ts
type removeDraggable = (data: { draggable: Draggable<any> }) => void;
```

Emitted when a draggable is deregistered from the context.

### addDroppable

```ts
type addDroppable = (data: { droppable: Droppable }) => void;
```

Emitted when a droppable is registered with the context.

### removeDroppable

```ts
type removeDroppable = (data: { droppable: Droppable }) => void;
```

Emitted when a droppable is deregistered from the context.

### destroy

```ts
type destroy = () => void;
```

Emitted when the DndContext is destroyed.
