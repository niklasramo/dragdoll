# Droppable

The `Droppable` class defines drop targets where draggable elements can be dropped. Each droppable must be associated with a DOM element. It also handles (virtual) parent–child relationships between droppables and maintains bounding client rectangle information.

## Example

```ts
import { Droppable } from 'dragdoll';

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
   The target DOM element that represents the drop zone.

2. **options** (optional)  
   An object with the following properties:
   - **accept**:  
     Either an array of drop target identifiers (strings, numbers, symbols) or a
     function that takes a draggable instance and returns a boolean.  
     _Default_: a function that returns `true` (accepts all).
   - **parent**:  
     A parent `Droppable` instance which creates a hierarchical grouping.  
     _Default_: `null`.
   - **data**:  
     An object containing custom data for the droppable.  
     _Default_: an empty object.

## Properties

### element

```ts
type element = HTMLElement | SVGSVGElement;
```

The associated DOM element representing, which's bounding client rectangle is used for collision detection. Read-only.

### parent

```ts
type parent = Droppable | null;
```

The droppable's parent droppable (if set). Read-only.

### children

```ts
type children = ReadonlySet<Droppable>;
```

A set of child droppable instances. Read-only.

### accept

```ts
type accept = DroppableAcceptId[] | ((draggable: Draggable<any>) => boolean);
```

The acceptance criteria for draggable elements. This can be either an array of drop target identifiers or a function that takes a draggable instance and returns a boolean. You can modify this property at any time, but do know that it will only affect the droppable instance after the next collision detection cycle. So modifying this won't instantly emit any `enter/over/leave` events.

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

### setParent

```ts
// Type
type setParent = (parent: Droppable | null) => void;

// Usage
const parentDroppable = new Droppable(parentElement);
droppable.setParent(parentDroppable);

// Remove parent relationship
droppable.setParent(null);
```

Sets the parent of the current droppable. Throws an error if you try to set the
droppable as its own parent or create an invalid cyclic relationship.

### getClientRect

```ts
// Type
type getClientRect = () => Readonly<DOMRect>;

// Usage
const rect = droppable.getClientRect();
console.log(rect.width, rect.height, rect.left, rect.top);
```

Returns the current bounding client rectangle of the droppable as a read-only object.
Useful for collision calculations with draggable elements.

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

Updates the cached client rectangle by reading the current bounding
client rectangle of the element.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
droppable.destroy();
```

Destroys the droppable instance:

- Emits the destroy event (if any listeners are registered).
- Clears the parent/child relationships.
- Marks the droppable as destroyed to prevent further operations.
