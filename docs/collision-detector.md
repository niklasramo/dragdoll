[DndContext](/dnd-context) →

# CollisionDetector

The `CollisionDetector` class is responsible for determining which droppables are colliding with a draggable during drag operations.

## Example

```ts
import { CollisionDetector, DndContext } from 'dragdoll';

interface CustomCollisionData extends CollisionData {
  foo: string;
  bar: number;
}

// Extend CollisionDetector and override the necessary protected hooks.
class CustomCollisionDetector extends CollisionDetector<CustomCollisionData> {
  protected override _checkCollision(draggable, droppable, data) {
    // Custom collision logic...
    // Return the data object if there's a collision, null otherwise.
    return super._checkCollision(draggable, droppable, data);
  }

  protected override _sortCollisions(_draggable, collisions) {
    // Optional: customize sorting
    return super._sortCollisions(_draggable, collisions);
  }

  protected override _createCollisionData() {
    // Optional: if you extend the CollisionData interface, you need to override
    // this method and return the extended data object. The values of this
    // object can be whatever as they will be overwritten by the collision
    // logic.
    return {
      ...super._createCollisionData(),
      foo: '',
      bar: 0,
    };
  }
}

// Provide a factory that returns your detector instance.
const dndContext = new DndContext({
  collisionDetector: (ctx) => new MyCollisionDetector(ctx),
});
```

## Constructor

```ts
class CollisionDetector<T extends CollisionData = CollisionData> {
  constructor(dndContext: DndContext) {}
}
```

### Parameters

1. **dndContext**

- The `DndContext` instance this collision detector belongs to.

## Extensibility hooks (override in subclasses)

- `_checkCollision(draggable, droppable, data): T | null`
  - Compute collision and return `data` or `null`. Default uses intersection.
- `_sortCollisions(draggable, collisions): T[]`
  - Sort by score descending, then droppable size. Return the array to use.
- `_createCollisionData(): T`
  - Create a pooled data object. Override to extend `CollisionData`.

## Methods

### detectCollisions

```ts
detectCollisions(
  draggable: Draggable<any>,
  targets: Map<DroppableId, Droppable>,
  collisions: T[],
): void
```

Detects collisions between a draggable and a map of droppable targets. Populates the provided `collisions` array in-place with `CollisionData` objects. Each draggable is assigned a pool of `CollisionData` objects to reuse between detections. That pool of collision data objects is automatically freed up for reuse when the draggable stops dragging (`DndContext` calls the `removeCollisionDataPool` method at the end of the drag operation).

The algorithm:

1. Clears the provided `collisions` array.
2. Iterates through all target droppables (from the `targets` Map).
3. For each droppable, uses the pooled `collisionData` object; if a collision is found, pushes it.
4. Sorts the collisions by relevance/priority.
5. Resets the object pool pointer for reuse in the next cycle.

### destroy

```ts
destroy(): void
```

Cleans up resources, resets the object pool, and removes event listeners. Note that you don't need to call this method manually after it's connected to the `DndContext` instance as it will be called automatically when the `DndContext` instance is destroyed.

## CollisionData Interface

```ts
interface CollisionData {
  // The droppable's unique ID (droppable.id)
  droppableId: Symbol;
  // The droppable's client rect (droppable.getClientRect())
  droppableRect: Rect;
  // The draggable's client rect (draggable.getClientRect())
  draggableRect: Rect;
  // The intersection rect between draggable and droppable
  intersectionRect: Rect;
  // Collision score (higher = better match)
  intersectionScore: number;
}
```

You can also import the interface from the `dragdoll` package:

```ts
import { CollisionData } from 'dragdoll';
```
