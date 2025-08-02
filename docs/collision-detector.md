[DndContext](/dnd-context) →

# CollisionDetector

The `CollisionDetector` class is responsible for determining which droppables are colliding with a draggable during drag operations. It supports hierarchical droppable structures and uses an object pool for performance optimization.

## Example

```ts
import { CollisionDetector, DndContext } from 'dragdoll';

// Create a custom collision detector
const collisionDetector = new CollisionDetector(dndContext, {
  getCollisionData: (draggable, droppable) => {
    // Custom collision logic
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect) return null;

    // Custom scoring logic
    const score = calculateCustomScore(draggableRect, droppableRect);
    if (score <= 0) return null;

    return {
      id: droppable.id,
      x: droppableRect.x,
      y: droppableRect.y,
      width: droppableRect.width,
      height: droppableRect.height,
      score,
    };
  },
  sortCollisions: (draggable, collisions) => {
    // Custom sorting logic
    return collisions.sort((a, b) => b.score - a.score);
  },
});

// Use it with DndContext
const dndContext = new DndContext({ collisionDetector });
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

2. **options** _(optional)_
   - An optional configuration object with the following properties:
     - **`getCollisionData`** _(optional)_
       - A function that calculates collision data for a draggable-droppable pair. Returns `null` if no collision.
       - Default: Uses intersection score based on overlapping area.
     - **`sortCollisions`** _(optional)_
       - A function that sorts collision results to determine priority.
       - Default: Sorts by score (descending), then by area (ascending).

## CollisionData Interface

```ts
interface CollisionData {
  id: Symbol; // The droppable's unique ID
  x: number; // X coordinate of the droppable
  y: number; // Y coordinate of the droppable
  width: number; // Width of the droppable
  height: number; // Height of the droppable
  score: number; // Collision score (higher = better match)
}
```

## Methods

### detectCollisions

```ts
detectCollisions(draggable: Draggable<any>, targets: Set<Droppable>): Map<Droppable, T>
```

Detects collisions between a draggable and a set of droppable targets. Returns a map of droppables to their collision data.

The algorithm:

1. Starts with root-level droppables (those without parents)
2. Finds collisions at the current level
3. If collisions exist, sorts them and moves to the children of the best match
4. Continues until no more collisions are found
5. Returns the deepest matching droppables

### destroy

```ts
destroy(): void
```

Cleans up resources, resets the object pool, and removes event listeners.

## Performance Optimizations

1. **Object Pooling**: The CollisionDetector uses a `FastObjectPool` to reuse collision data objects, reducing garbage collection pressure.

2. **Hierarchical Detection**: Instead of checking all droppables, it traverses the hierarchy level by level, stopping when no collisions are found.

3. **Cached Client Rects**: Droppables cache their bounding rectangles, which are updated only when necessary (on scroll or explicit update).

## Custom Collision Detection

You can extend the `CollisionDetector` class or provide custom functions to implement different collision strategies:

```ts
// Example: Center-point collision detection
const centerPointDetector = new CollisionDetector(dndContext, {
  getCollisionData: (draggable, droppable) => {
    const draggableRect = draggable.getClientRect();
    const droppableRect = droppable.getClientRect();
    if (!draggableRect) return null;

    // Check if draggable center is inside droppable
    const centerX = draggableRect.x + draggableRect.width / 2;
    const centerY = draggableRect.y + draggableRect.height / 2;

    const isInside =
      centerX >= droppableRect.x &&
      centerX <= droppableRect.x + droppableRect.width &&
      centerY >= droppableRect.y &&
      centerY <= droppableRect.y + droppableRect.height;

    if (!isInside) return null;

    return {
      id: droppable.id,
      x: droppableRect.x,
      y: droppableRect.y,
      width: droppableRect.width,
      height: droppableRect.height,
      score: 1, // Binary score for center-point detection
    };
  },
});
```

## TypeScript Support

The `CollisionDetector` supports generic collision data types, allowing you to extend the base `CollisionData` interface:

```ts
interface CustomCollisionData extends CollisionData {
  distance: number;
  angle: number;
}

const customDetector = new CollisionDetector<CustomCollisionData>(dndContext, {
  getCollisionData: (draggable, droppable) => {
    // Return CustomCollisionData with additional fields
    // ...
  },
});
```
