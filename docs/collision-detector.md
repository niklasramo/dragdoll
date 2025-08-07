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
    getCollisionData: (draggable, droppable) => {
      // Custom collision logic...
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
      getCollisionData: (draggable, droppable) => {
        // Custom collision logic...
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
      getCollisionData?: (draggable: Draggable<any>, droppable: Droppable) => T | null;
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
     - **`getCollisionData`**
       - A function that calculates collision data for a draggable-droppable pair. Return `null` if no collision, otherwise return a collision data object, which conforms to the [`CollisionData`](#collisiondata-interface) interface.
       - Default: Uses intersection score based on overlapping area.
     - **`sortCollisions`**
       - A function that sorts collision results to determine relevance/priority.
       - Default: Sorts by score (descending), then by area (ascending).

## Methods

### detectCollisions

```ts
detectCollisions(draggable: Draggable<any>, targets: Set<Droppable>): Map<Droppable, T>
```

Detects collisions between a draggable and a set of droppable targets. Returns a map of droppables to their collision data.

The algorithm:

1. Starts with root-level droppables (those without parents).
2. Finds collisions at the current level.
3. If collisions exist, sorts them and moves to the children of the best match.
4. Continues until no more collisions are found.
5. Returns the deepest matching droppables.

### destroy

```ts
destroy(): void
```

Cleans up resources, resets the object pool, and removes event listeners. Note that you don't need to call this method manually after it's connected to the `DndContext` instance as it will be called automatically when the `DndContext` instance is destroyed.

## CollisionData Interface

```ts
interface CollisionData {
  id: Symbol; // The droppable's unique ID (droppable.id)
  x: number; // X coordinate of the droppable (droppable.getClientRect().x)
  y: number; // Y coordinate of the droppable (droppable.getClientRect().y)
  width: number; // Width of the droppable (droppable.getClientRect().width)
  height: number; // Height of the droppable (droppable.getClientRect().height)
  score: number; // Collision score (higher = better match)
}
```

You can also import the interface from the `dragdoll` package:

```ts
import { CollisionData } from 'dragdoll';
```

## Custom collision data

In some more advanced use cases, you might want to extend the `CollisionData` interface to include more data. For example, if you want to use a different scoring algorithm.

```ts
import { CollisionDetector, DndContext, CollisionData } from 'dragdoll';

interface CustomCollisionData extends CollisionData {
  foo: string;
  bar: number;
}

const dndContext = new DndContext<CustomCollisionData>({
  collisionDetector: {
    getCollisionData: (draggable, droppable) => {
      // Custom collision logic that should return `null` (for no collision)
      // or a collision data object that conforms to the CustomCollisionData
      // interface.
    },
    sortCollisions: (draggable, collisions) => {
      // Custom sorting logic that should return the sorted collisions.
    },
  },
});
```

This way all the events that are emitted by the `DndContext` will have the `CustomCollisionData` type as expected.
