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
  constructor(element: HTMLElement | SVGSVGElement | null, options: DroppableOptions = {}) {}
}
```

### Constructor Parameters

1. **element**
   - The target DOM element that represents the drop zone. Can be `null` if you want to set it later or use a custom `computeClientRect` function.
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

### computeClientRect

```ts
type computeClientRect = (droppable: Droppable) => Rect;
```

A function that should return the current bounding client rectangle of the droppable. This rectangle is used for collision detection.

The returned rectangle should have the following properties:

- `x`: The x-coordinate of the rectangle's left edge
- `y`: The y-coordinate of the rectangle's top edge
- `width`: The width of the rectangle
- `height`: The height of the rectangle

**When to customize:** You might want to customize this function when:

- The droppable's `element` is `null` and you need to provide a custom rectangle
- You want to use a custom bounding area (e.g., smaller or larger than the actual element)
- You're implementing custom collision detection logic
- You need to account for transforms or scaling that affect the visual bounds

**Example:**

```ts
const droppable = new Droppable(null, {
  computeClientRect: (droppable) => {
    // Return a custom rectangle when element is null
    return { x: 100, y: 100, width: 200, height: 200 };
  },
});

// Or use a custom rectangle even when element exists
const droppable = new Droppable(element, {
  computeClientRect: (droppable) => {
    const rect = droppable.element?.getBoundingClientRect();
    if (!rect) return droppable.getClientRect();
    // Return a slightly larger rectangle for easier dropping
    return {
      x: rect.x - 10,
      y: rect.y - 10,
      width: rect.width + 20,
      height: rect.height + 20,
    };
  },
});
```

**Default behavior:** By default, this returns `element.getBoundingClientRect()` if `element` is not `null`, otherwise returns the cached client rect from `getClientRect()`.

## Properties

### id

```ts
type id = DroppableId;
```

The unique identifier for this droppable. Default is a unique symbol. Read-only.

### element

```ts
type element = HTMLElement | SVGSVGElement | null;
```

The associated DOM element whose bounding client rectangle is used for collision detection. Can be `null` if you're using a custom `computeClientRect` function. Read-only.

### accept

```ts
type accept = Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
```

Controls which draggables can collide with this droppable when used in a [`DndObserver`](/dnd-observer).

- Set mode: accepts a draggable when its [`dndGroups`](/draggable#dndgroups) set contains any of the identifiers in this set.
- Function mode: called during collision detection for every candidate. Return `true` to accept, `false` to reject. You can incorporate the draggable's [`dndGroups`](/draggable#dndgroups) here or come up with any other acceptance criteria.

Default is `() => true` (accepts all draggables).

### data

```ts
type data = { [key: string]: any };
```

Custom data associated with this droppable. This data is persisted until manually overridden. You can directly modify the object at any time.

### computeClientRect

```ts
type computeClientRect = (droppable: Droppable) => Rect;
```

A function that should return the current bounding client rectangle of the droppable. This rectangle is used for collision detection. Check out the [`computeClientRect`](#computeclientrect-1) option docs for more information.

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
type updateClientRect = () => void;
```

Updates the cached client rectangle by calling the `computeClientRect` function. This is typically called automatically by `DndObserver` at drag start or on scroll, but can be manually triggered if needed.

**Example**

```ts
// Update the cached client rectangle.
droppable.updateClientRect();
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
  computeClientRect?: (droppable: Droppable) => Rect;
}
```

### DroppableDefaultSettings

```ts
// Import
import { DroppableDefaultSettings } from 'dragdoll/droppable';

// Object
const DroppableDefaultSettings = {
  accept: () => true,
  computeClientRect: (droppable: Droppable) =>
    droppable.element?.getBoundingClientRect() || droppable.getClientRect(),
};
```

The default settings object used by `Droppable` when options are not provided.
