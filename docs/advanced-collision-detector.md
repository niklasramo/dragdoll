[DndContext](/dnd-context) → [CollisionDetector](/collision-detector)

# AdvancedCollisionDetector

The `AdvancedCollisionDetector` extends the base [`CollisionDetector`](/collision-detector) to account for clipping and visibility constraints. It computes visible rectangles for both draggables and droppables using clip-ancestor chains and sorts collisions by intersection score and visible area. It also caches clip masks per drag and invalidates on scroll/resize for performance.

## Example

```ts
import { DndContext, AdvancedCollisionDetector } from 'dragdoll';

const dnd = new DndContext({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});
```

## Constructor

```ts
class AdvancedCollisionDetector<
  T extends AdvancedCollisionData = AdvancedCollisionData,
> extends CollisionDetector<T> {
  constructor(dndContext: DndContext<T>) {}
}
```

### Parameters

- `dndContext`: The `DndContext` instance this detector belongs to.

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
