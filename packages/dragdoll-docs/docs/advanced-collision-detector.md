[DndObserver](/dnd-observer) → [CollisionDetector](/collision-detector)

# AdvancedCollisionDetector

The `AdvancedCollisionDetector` extends the base [`CollisionDetector`](/collision-detector) to account for clipping and visibility constraints. It computes visible rectangles for both draggables and droppables using clip-ancestor chains and sorts collisions by intersection score and visible area. It also caches clip masks per drag and invalidates on scroll/resize for performance.

## Example

```ts
import { DndObserver } from 'dragdoll/dnd-observer';
import { AdvancedCollisionDetector } from 'dragdoll/dnd-observer/advanced-collision-detector';

// By default, uses relative visibility logic (relative to the first common clip
// container (FCCC) between the draggable and droppable).
const dnd = new DndObserver({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});
```

```ts
// You can also use absolute visibility (relative to the user/window).
const dnd = new DndObserver({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx, { visibilityLogic: 'absolute' }),
});
```

## Class

```ts
class AdvancedCollisionDetector<
  T extends AdvancedCollisionData = AdvancedCollisionData,
> extends CollisionDetector<T> {
  constructor(
    dndObserver: DndObserver<T>,
    options?: { visibilityLogic: 'relative' | 'absolute' },
  ) {}
}
```

### Type Variables

1. **T**
   - The type of the collision data.
   - Defaults to [`AdvancedCollisionData`](#advancedcollisiondata).

### Constructor Parameters

1. **dndObserver**
   - The [`DndObserver`](/dnd-observer) instance this detector belongs to.
2. **options**
   - An optional configuration object with the following properties:
     - **`visibilityLogic`**
       - Controls how visibility is computed.
       - Possible values:
         - `'relative'`: Computes visibility relative to the first common clip container (FCCC) between the draggable and droppable. Clip chains stop at the FCCC (the FCCC is not included as the final clipping mask).
         - `'absolute'`: Computes absolute visibility of the draggable and droppable relative to the window (user perspective). Clip chains do not stop at the FCCC, they continue all the way to the window which is always included as the final clipping mask.
       - Default: `'relative'`.

## Methods

This class inherits all methods from the [`CollisionDetector`](/collision-detector#methods) class in addition to the methods listed below.

### clearCache

```ts
type clearCache = (draggable?: AnyDraggable) => void;
```

Clears the cache for a specific draggable or all draggables. This is automatically called when any element on the page is scrolled or when window is resized. You should call this if you move affected elements during a drag operation manually.

If you provide a `draggable` argument, only the cache for that draggable will be cleared. Otherwise, all draggables' caches will be cleared.

## Types

### AdvancedCollisionData

```ts
// Import
import type { AdvancedCollisionData } from 'dragdoll/dnd-observer/advanced-collision-detector';

// Interface
interface AdvancedCollisionData extends CollisionData {
  // The draggable's visible rect.
  draggableVisibleRect: { x: number; y: number; width: number; height: number };
  // The droppable's visible rect.
  droppableVisibleRect: { x: number; y: number; width: number; height: number };
}
```
