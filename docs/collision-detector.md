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
      mergeCollisionData?: (target: T, source: T) => T;
      createCollisionData?: (source: T) => T;
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
     - **`mergeCollisionData`**
       - A function that should _efficiently_ merge collision data into an existing pooled object for performance. You only need to provide a custom function here if you need to extend the `CollisionData` interface.
       - Default: Fast in-place copying for base `CollisionData` properties.
     - **`createCollisionData`**
       - A function that _efficiently_ creates a new collision data object, which will be stored in the object pool. You only need to provide a custom function here if you need to extend the `CollisionData` interface.
       - Default: Fast creation for base `CollisionData`.
     - **`sortCollisions`**
       - A function that sorts collision results to determine relevance/priority.
       - Default: Sorts by score (descending), then by area (ascending).

## Methods

### detectCollisions

```ts
detectCollisions(draggable: Draggable<any>, targets: Set<Droppable>, collisionMap: Map<Droppable, T>): void
```

Detects collisions between a draggable and a set of droppable targets. Fills the provided collision map with droppables and their collision data for performance optimization.

The algorithm:

1. Clears the provided collision map.
2. Iterates through all target droppables.
3. Finds collisions between the draggable and each droppable.
4. Sorts the collisions by relevance/priority.
5. Fills the collision map with droppables and their collision data.

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

const TEMP_COLLISION_DATA: CustomCollisionData = {
  droppableId: Symbol(),
  droppableRect: { width: 0, height: 0, x: 0, y: 0 },
  draggableRect: { width: 0, height: 0, x: 0, y: 0 },
  intersectionRect: { width: 0, height: 0, x: 0, y: 0 },
  intersectionScore: 0,
  foo: '',
  bar: 0,
} as const;

const dndContext = new DndContext<CustomCollisionData>({
  collisionDetector: {
    getCollisionData: (draggable, droppable) => {
      // Use the default collision detection logic to get base data.
      // Note that we pass the temporary collision data object to the
      // default method so the results will be written to it.
      const data = CollisionDetectorDefaultOptions.getCollisionData(
        draggable,
        droppable,
        TEMP_COLLISION_DATA,
      );

      // If data is null, it means there is no collision.
      if (!data) return null;

      // Sync the custom properties to the temporary collision data object.
      data.foo = 'custom';
      data.bar = Math.random();

      return data;
    },
    sortCollisions: (draggable, collisions) => {
      return collisions.sort((a, b) => b.bar - a.bar);
    },
    mergeCollisionData: (target, source) => {
      CollisionDetectorDefaultOptions.mergeCollisionData(target, source);
      target.foo = source.foo;
      target.bar = source.bar;
      return target;
    },
    createCollisionData: (source) => {
      const data = CollisionDetectorDefaultOptions.createCollisionData(source);
      data.foo = source.foo;
      data.bar = source.bar;
      return data;
    },
  },
});
```

This way all the events that are emitted by the `DndContext` will have the `CustomCollisionData` type as expected.
