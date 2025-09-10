[DndContext](/dnd-context) →

# CollisionDetector

The `CollisionDetector` class is responsible for determining which droppables are colliding with a draggable during drag operations.

## Example

```ts
import { CollisionDetector, DndContext } from 'dragdoll';

// Passing the collision detector options directly to the `DndContext`
// constructor.
const dndContextBasic = new DndContext({
  collisionDetector: {
    checkCollision: (draggable, droppable, collisionData) => {
      // Custom collision logic...
      // Return the collisionData object if there's a collision, null otherwise
      return collisionData;
    },
    sortCollisions: (draggable, collisions) => {
      // Custom sorting logic...
    },
  },
});

// Using a creator function.
const dndContextAdvanced = new DndContext({
  collisionDetector: (dndContext) =>
    new CollisionDetector(dndContext, {
      checkCollision: (draggable, droppable, collisionData) => {
        // Custom collision logic...
        // Return the collisionData object if there's a collision, null otherwise
        return collisionData;
      },
      sortCollisions: (draggable, collisions) => {
        // Custom sorting logic...
      },
    }),
});
```

## Constructor

```ts
class CollisionDetector<T extends CollisionData = CollisionData> {
  constructor(
    dndContext: DndContext,
    options?: {
      checkCollision?: (
        draggable: Draggable<any>,
        droppable: Droppable,
        collisionData: T,
      ) => T | null;
      createCollisionData?: () => T;
      sortCollisions?: (draggable: Draggable<any>, collisions: T[]) => T[];
    },
  ) {}
}
```

### Parameters

1. **dndContext**

- The `DndContext` instance this collision detector belongs to.

2. **options**
   - An optional configuration object with the following properties:
     - **`checkCollision`**
       - A function that checks for collision between a draggable and droppable, using a pre-allocated collision data object. Return the collision data object if there's a collision, `null` otherwise. The collision data object conforms to the [`CollisionData`](#collisiondata-interface) interface.
       - Default: Uses intersection score based on overlapping area.
     - **`createCollisionData`**
       - A function that creates a new collision data object, which will be stored in the object pool. You only need to provide a custom function here if you need to extend the `CollisionData` interface.
       - Default: Creates a new `CollisionData` object.
     - **`sortCollisions`**
       - A function that sorts collision results to determine relevance/priority.
       - Default: Sorts by score (descending), then by droppable size (ascending).

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

## Custom collision data

In some more advanced use cases, you might want to extend the `CollisionData` interface to include more data. For example, if you want to use a different scoring algorithm.

```ts
import {
  CollisionDetector,
  DndContext,
  CollisionData,
  CollisionDetectorDefaultOptions,
} from 'dragdoll';

interface CustomCollisionData extends CollisionData {
  foo: string;
  bar: number;
}

const dndContext = new DndContext<CustomCollisionData>({
  collisionDetector: {
    checkCollision: (draggable, droppable, collisionData) => {
      // Use the default collision detection logic to check for collision
      const result = CollisionDetectorDefaultOptions.checkCollision(
        draggable,
        droppable,
        collisionData,
      );

      // If result is null, it means there is no collision.
      if (!result) return null;

      // Add custom properties to the collision data object.
      result.foo = 'custom';
      result.bar = Math.random();

      return result;
    },
    sortCollisions: (draggable, collisions) => {
      return collisions.sort((a, b) => b.bar - a.bar);
    },
    createCollisionData: () => {
      const data = CollisionDetectorDefaultOptions.createCollisionData() as CustomCollisionData;
      data.foo = '';
      data.bar = 0;
      return data;
    },
  },
});
```

This way all the events that are emitted by the `DndContext` will have the `CustomCollisionData` type as expected.
