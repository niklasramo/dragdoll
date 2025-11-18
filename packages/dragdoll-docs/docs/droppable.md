# Droppable

The `Droppable` class defines a drop target where draggable elements can be dropped. Each droppable must be associated with a DOM element.

Note that `Droppable` does not do anything by itself. You have to add it to a [`DndObserver`](/dnd-observer) instance and match it with some [`Draggable`](/draggable) instances. The `DndObserver` will then emit events when the draggable enters, leaves, or collides with the droppable.

## Example

```ts
import { Droppable } from 'dragdoll/droppable';

const dropZone = document.querySelector('.drop-zone') as HTMLElement;
const droppable = new Droppable(dropZone, {
  accept: new Set(['groupA']),
  data: { info: 'Custom drop zone info' },
});

// Listen to the destroy event to perform cleanup
droppable.on('destroy', () => {
  console.log('Droppable destroyed');
});

// Later, when you want to remove the droppable
droppable.destroy();
```

## Class

```ts
class Droppable {
  constructor(element: HTMLElement | SVGSVGElement, options: DroppableOptions = {}) {}
}
```

### Constructor Parameters

1. **element**
   - The target DOM element that represents the drop zone.
2. **options**
   - An optional options object following the [`DroppableOptions`](#droppableoptions) interface.
   - Check out the [Options](#options) section for more information.
   - Default: `{}`.

## Options

Here you can find more information about the options you can provide to the constructor. The typings here follow the [`DroppableOptions`](#droppableoptions) interface.

### id

```ts
type id = DroppableId;
```

The `id` is a unique identifier for the droppable that is assigned as the droppable's [`id`](#id-1) property. It can only be provided once via the constructor options and _should not_ be changed after instantiation. Reason being that the [`DndObserver`](/dnd-observer) will use the id to store data related to the droppable.

Default is a unique symbol.

### accept

```ts
type accept = Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
```

Check out the [`accept`](#accept-1) property docs for more information.

### data

```ts
type data = { [key: string]: any };
```

Check out the [`data`](#data-1) property docs for more information.

## Properties

### id

```ts
type id = DroppableId;
```

The unique identifier for this droppable. Default is a unique symbol. Read-only.

### element

```ts
type element = HTMLElement | SVGSVGElement;
```

The associated DOM element whose bounding client rectangle is used for collision detection. Read-only.

### accept

```ts
type accept = Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
```

Controls which draggables can collide with this droppable when used in a [`DndObserver`](/dnd-observer).

- Set mode: accepts a draggable when its [`dndGroups`](/draggable#dndgroups) set contains any of the identifiers in this set.
- Function mode: called during collision detection for every candidate. Return `true` to accept, `false` to reject. You can incorporate the draggable's [`dndGroups`](/draggable#dndgroups) here or come up with any other acceptance criteria.

> [!IMPORTANT]
> In most real-world use cases you don't want the Draggable and Droppable colliding with each other if the Droppable's [`element`](#element) is contained within any of the Draggable's dragged elements. This is why [DndObserver](/dnd-observer) will automatically discard such matches and you don't have to worry about it yourself. In the rare case that you do want this behavior, you can override this behavior by overriding the [DndObserver's](/dnd-observer) protected `_isMatch` method.

Default is `() => true` (accepts all draggables).

### data

```ts
type data = { [key: string]: any };
```

Custom data associated with this droppable. This data is persisted until manually overridden. You can directly modify the object at any time.

### isDestroyed

```ts
type isDestroyed = boolean;
```

Boolean flag indicating whether this instance has been destroyed. Read-only.

## Methods

### on

```ts
type on = <T extends keyof DroppableEventCallbacks>(
  type: T,
  listener: DroppableEventCallbacks[T],
  listenerId?: SensorEventListenerId,
) => SensorEventListenerId;
```

Adds a listener to a droppable event. Returns a [listener id](/sensor#sensoreventlistenerid), which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

Please check the [Events](#events) section for more information about the events and their payloads.

**Example**

```ts
droppable.on('destroy', (e) => {
  console.log('destroy', e);
});
```

### off

```ts
type off = <T extends keyof DroppableEventCallbacks>(
  type: T,
  listenerId: SensorEventListenerId,
) => void;
```

Removes a listener (based on [listener id](/sensor#sensoreventlistenerid)) from a droppable event.

**Example**

```ts
const id = droppable.on('destroy', () => console.log('destroy'));
droppable.off('destroy', id);
```

### getClientRect

```ts
type getClientRect = () => Readonly<Rect>;
```

Returns the cached bounding client rectangle of the droppable as a read-only object. This rect is updated when `updateClientRect()` is called (e.g., by `DndObserver` at drag start or on scroll).

**Example**

```ts
const rect = droppable.getClientRect();
console.log(rect.x, rect.y, rect.width, rect.height);
```

### updateClientRect

```ts
type updateClientRect = (rect?: Rect) => void;
```

Updates the cached client rectangle by reading the current bounding client rectangle of the element, or by using a provided `Rect`.

**Example**

```ts
// Read from the DOM.
droppable.updateClientRect();

// Provide a custom bounding client rectangle.
droppable.updateClientRect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
});
```

### destroy

```ts
type destroy = () => void;
```

Destroys the droppable instance:

- Emits the `destroy` event (if any listeners are registered).
- Marks the droppable as destroyed to prevent further operations.

**Example**

```ts
droppable.destroy();
```

## Events

### destroy

Emitted when the droppable is destroyed. There is no payload for this event.

## Types

### DroppableId

```ts
// Import
import type { DroppableId } from 'dragdoll/droppable';

// Type
type DroppableId = symbol | string | number;
```

### DroppableEventType

```ts
// Import
import type { DroppableEventType } from 'dragdoll/droppable';

// Type
type DroppableEventType = 'destroy';
```

### DroppableEventCallbacks

```ts
// Import
import type { DroppableEventCallbacks } from 'dragdoll/droppable';

// Interface
interface DroppableEventCallbacks {
  destroy: () => void;
}
```

### DroppableOptions

```ts
// Import
import type { DroppableOptions } from 'dragdoll/droppable';

// Interface
interface DroppableOptions {
  id?: DroppableId;
  accept?: Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
  data?: { [key: string]: any };
}
```
