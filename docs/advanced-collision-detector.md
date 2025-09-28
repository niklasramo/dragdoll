[DndContext](/dnd-context) → [CollisionDetector](/collision-detector)

# AdvancedCollisionDetector

The `AdvancedCollisionDetector` extends the base [`CollisionDetector`](/collision-detector) to account for clipping and visibility constraints. It computes visible rectangles for both draggables and droppables using clip-ancestor chains and sorts collisions by intersection score and visible area. It also caches clip masks per drag and invalidates on scroll/resize for performance.

## Example

```ts
import { DndContext, AdvancedCollisionDetector } from 'dragdoll';

// By default, uses relative visibility logic (relative to the first common clip
// container (FCCC) between the draggable and droppable).
const dnd = new DndContext({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});
```

```ts
// You can also use absolute visibility (relative to the user/window).
const dnd = new DndContext({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx, { visibilityLogic: 'absolute' }),
});
```

## Constructor

```ts
class AdvancedCollisionDetector<
  T extends AdvancedCollisionData = AdvancedCollisionData,
> extends CollisionDetector<T> {
  constructor(dndContext: DndContext<T>, options?: { visibilityLogic: 'relative' | 'absolute' }) {}
}
```

### Parameters

- `dndContext`: The `DndContext` instance this detector belongs to.
- `options.visibilityLogic` (optional): Controls how visibility is computed.
  - `relative` (default): Computes visibility relative to the first common clip container (FCCC) between the draggable and droppable. Clip chains stop at the FCCC (the FCCC is not included as the final clipping mask).
  - `absolute`: Computes absolute visibility of the draggable and droppable relative to the window (user perspective). Clip chains do not stop at the FCCC, they continue all the way to the window which is always included as the final clipping mask.

## Methods

### clearCache

```ts
clearCache(
  draggable?: Draggable<any>,
): void
```

Clears the cache for a specific draggable or all draggables. This is automatically called when any element on the page is scrolled or when window is resized. You should call this if you move affected elements during a drag operation manually.

If you provide a `draggable` argument, only the cache for that draggable will be cleared. Otherwise, all draggables' caches will be cleared.

## AdvancedCollisionData Interface

```ts
interface AdvancedCollisionData extends CollisionData {
  draggableVisibleRect: Rect;
  droppableVisibleRect: Rect;
}
```
