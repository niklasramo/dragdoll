[DndContext](/dnd-context) → [CollisionDetector](/collision-detector)

## AdvancedCollisionDetector

The `AdvancedCollisionDetector` extends the base [`CollisionDetector`](/collision-detector) to
account for clipping and visibility constraints. It computes visible rectangles for both
draggables and droppables using clip-ancestor chains and sorts collisions by intersection score
and visible area. It also caches clip masks per drag and invalidates on scroll/resize for
performance.

### Example

```ts
import { DndContext, AdvancedCollisionDetector } from 'dragdoll';

const dnd = new DndContext({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});
```

### Constructor

```ts
class AdvancedCollisionDetector<
  T extends AdvancedCollisionData = AdvancedCollisionData,
> extends CollisionDetector<T> {
  constructor(dndContext: DndContext<T>) {}
}
```

#### Parameters

- `dndContext`: The `DndContext` instance this detector belongs to.

### AdvancedCollisionData

```ts
interface AdvancedCollisionData extends CollisionData {
  draggableVisibleRect: Rect;
  droppableVisibleRect: Rect;
}
```

### Behavior

- Computes clip ancestor chains for draggable and droppable, finds the first common clip
  container, and derives clip masks (intersection rects) for both sides.
- Intersects client rects with clip masks to get `draggableVisibleRect` and
  `droppableVisibleRect`.
- Computes intersection rect and score using the visible rects.
- Sorts primarily by `intersectionScore` (desc), then by droppable visible area (desc).

### Caching and invalidation

- Per-drag state caches computed clip masks keyed by the first clip container for a droppable.
- Cache is cleared on `window` scroll (capture, passive) and `resize`.
- Public method `clearCache(draggable?)` marks caches dirty for a specific draggable or all.

### Extensibility hooks

You can still subclass `AdvancedCollisionDetector` and override the same protected hooks as the
base detector:

- `_checkCollision(draggable, droppable, data)`
- `_sortCollisions(draggable, collisions)`
- `_createCollisionData()`

### When to use

- Use `AdvancedCollisionDetector` when your draggables/droppables live inside scrollable or clipped
  containers and you want collision rules to respect visibility.
- Use the base `CollisionDetector` for minimal overhead and simpler setups.
