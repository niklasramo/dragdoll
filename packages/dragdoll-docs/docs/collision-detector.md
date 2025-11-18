[DndObserver](/dnd-observer) →

# CollisionDetector

The `CollisionDetector` class is the base class for all collision detectors. By its own it does simple collision detection based on the intersection of the draggable and droppable client rects. It does not account for the actual visibility of the draggable and droppable relative to each other (e.g., when a droppable is clipped inside a scrollable container and the draggable is outside it).

For more advanced collision detection, you can extend the `CollisionDetector` class and build your own logic on top of it. We also provide an [`AdvancedCollisionDetector`](/advanced-collision-detector) that extends the base and adds support for clipping and visibility constraints out of the box.

## Example

```ts
import { CollisionDetector } from 'dragdoll/dnd-observer/collision-detector';
import { DndObserver } from 'dragdoll/dnd-observer';

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
const dndObserver = new DndObserver({
  collisionDetector: (ctx) => new CustomCollisionDetector(ctx),
});
```

## Class

```ts
class CollisionDetector<T extends CollisionData = CollisionData> {
  constructor(dndObserver: DndObserver<T>) {}
}
```

### Type Variables

1. **T**
   - The type of the collision data.
   - Defaults to [`CollisionData`](#collisiondata).

### Constructor Parameters

1. **dndObserver**
   - The [`DndObserver`](/dnd-observer) instance this collision detector belongs to.

## Methods

### detectCollisions

```ts
type detectCollisions = (
  draggable: AnyDraggable,
  targets: Map<DroppableId, Droppable>,
  collisions: T[],
) => void;
```

Detects collisions between a draggable and a map of droppable targets. Populates the provided `collisions` array in-place with `CollisionData` objects. Each draggable is assigned an _arena_ of `CollisionData` objects to reuse between detections. That arena of collision data objects is automatically freed up for reuse when the draggable stops dragging (`DndObserver` calls the `_removeCollisionDataArena` method at the end of the drag operation).

### destroy

```ts
type destroy = () => void;
```

Cleans up resources, deallocates collision data arenas and removes event listeners. Note that you don't need to call this method manually after it's connected to the `DndObserver` instance as it will be called automatically when the `DndObserver` instance is destroyed.

## Protected methods

These methods are meant to be overridden by subclasses. You can use them to control the collision detection process.

### \_checkCollision

```ts
type _checkCollision = (draggable: AnyDraggable, droppable: Droppable, data: T) => T | null;
```

Checks if a collision exists between a draggable and a droppable. Should return the provided `data` object if a collision is found with the updated values and `null` if no collision is found.

### \_sortCollisions

```ts
type _sortCollisions = (draggable: AnyDraggable, collisions: T[]) => T[];
```

Sorts the collisions from the most relevant to the least relevant. Should return the sorted array. The default implementation sorts by intersection score descending, then by droppable size descending.

### \_createCollisionData

```ts
type _createCollisionData = () => T;
```

Creates a new collision data object. Should return a new `CollisionData` object. The final values for the object will be computed by the `_checkCollision` method.

### \_getCollisionDataArena

```ts
type _getCollisionDataArena = (draggable: AnyDraggable) => ObjectArena<T>;
```

Allocates the collision data arena for a draggable. The arena is used to store the collision data objects for the draggable.

### \_removeCollisionDataArena

```ts
type _removeCollisionDataArena = (draggable: AnyDraggable) => void;
```

Removes the collision data arena for a draggable. The arena is used to store the collision data objects for the draggable.

## Extensibility hooks

The CollisionDetector class provides the following extensibility hooks for subclasses to override.

- `_checkCollision(draggable, droppable, data): T | null`
  - Compute collision and return `data` or `null`. Default uses intersection.
- `_sortCollisions(draggable, collisions): T[]`
  - Sort by score descending, then droppable size (ascending) as a tiebreaker.
- `_createCollisionData(): T`
  - Create a pooled data object. Override to extend [`CollisionData`](#collisiondata-interface).

## Types

### CollisionData

```ts
// Import
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';

// Interface
interface CollisionData {
  // The droppable's unique ID (droppable.id)
  droppableId: DroppableId;
  // The droppable's client rect (droppable.getClientRect())
  droppableRect: { x: number; y: number; width: number; height: number };
  // The draggable's client rect (draggable.getClientRect())
  draggableRect: { x: number; y: number; width: number; height: number };
  // The intersection rect between draggable and droppable
  intersectionRect: { x: number; y: number; width: number; height: number };
  // Collision score (higher = better match)
  intersectionScore: number;
}
```
