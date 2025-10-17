# Droppable

The `Droppable` class defines drop targets where draggable elements can be dropped. Each droppable must be associated with a DOM element and maintains a cached client rectangle for collision detection.

## Example

```ts
import { Droppable } from 'dragdoll/droppable';

const dropZone = document.querySelector('.drop-zone') as HTMLElement;
const droppable = new Droppable(dropZone, {
  accept: ['groupA'],
  data: { info: 'Custom drop zone info' },
});

// Listen to the destroy event to perform cleanup
droppable.on('destroy', () => {
  console.log('Droppable destroyed');
});

// Later, when you want to remove the droppable
droppable.destroy();
```

## Constructor

```ts
new Droppable(element: HTMLElement | SVGSVGElement, options?: DroppableOptions);
```

### Parameters

1. **element**
   - The target DOM element that represents the drop zone.

2. **options**
   - An optional options object with the following properties:
     - **`id`**
       - The unique identifier for this droppable. A string, number, or symbol.
       - Default: a unique symbol.
     - **`accept`**
       - Either an array of identifiers (`DroppableAcceptId[]`) or a predicate `(draggable) => boolean`.
       - Array mode: accepts draggables whose `draggable.settings.group` is included in the array. `null` groups never match arrays.
       - Function mode: decide acceptance in code; you may read `draggable.settings.group` or ignore it entirely.
       - Default: `() => true` (accepts all draggables).
     - **`data`**
       - An object containing custom data for the droppable.
       - Default: an empty object.

## Properties

### id

```ts
type id = string | number | symbol;
```

The unique identifier for this droppable. Defaults to a unique symbol. Read-only.

### element

```ts
type element = HTMLElement | SVGSVGElement;
```

The associated DOM element whose bounding client rectangle is used for collision detection. Read-only.

### accept

```ts
type accept = DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
```

Controls which draggables can collide with this droppable when used in a [DndContext](/dnd-context).

- Array mode: accepts a draggable when it's [`group`](/draggable#group) is included in the array.
- Function mode: called during collision detection for every candidate. Return `true` to accept, `false` to reject. You can incorporate the draggable's [`group`](/draggable#group) here or come up with any other acceptance criteria.

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
// Type
type on = (type: 'destroy', listener: () => void, listenerId?: ListenerId) => ListenerId;

type ListenerId = null | string | number | symbol | Function | Object;

// Usage
droppable.on('destroy', (e) => {
  console.log('destroy', e);
});
```

Adds an event listener to the Droppable instance.

The listener function receives no arguments.

The last optional argument is the listener id, which is normally created automatically, but can be provided here manually too.

The method returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

```ts
// Type
type off = (
  type: 'destroy',
  listenerId: null | string | number | symbol | Function | Object,
) => void;

// Usage
const id = droppable.on('destroy', () => console.log('destroy'));
droppable.off('destroy', id);
```

Removes a listener (based on listener id) from an event. The first argument is the event type and the second argument is the listener id.

### getClientRect

```ts
// Type
type getClientRect = () => Readonly<Rect>;

// Usage
const rect = droppable.getClientRect();
console.log(rect.width, rect.height, rect.left, rect.top);
```

Returns the cached bounding client rectangle of the droppable as a read-only object. This rect is updated when `updateClientRect()` is called (e.g., by `DndContext` at drag start or on scroll).

### updateClientRect

```ts
// Type
type updateClientRect = (rect?: Rect) => void;

// Usage (read from the DOM)
droppable.updateClientRect();

// Usage (provide a custom bounding client rectangle)
droppable.updateClientRect({
  x: 100,
  y: 100,
  width: 200,
  height: 200,
});
```

Updates the cached client rectangle by reading the current bounding client rectangle of the element, or by using a provided `Rect`.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
droppable.destroy();
```

Destroys the droppable instance:

- Emits the `destroy` event (if any listeners are registered).
- Marks the droppable as destroyed to prevent further operations.
