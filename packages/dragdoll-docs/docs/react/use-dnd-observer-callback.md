# useDndObserverCallback

A React hook for attaching event listeners to a [DndObserver](/dnd-observer) instance.

## Usage

```tsx
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';
import { DndObserverEventType } from 'dragdoll';

function MyComponent() {
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    DndObserverEventType.Enter,
    ({ draggable, droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Leave,
    ({ draggable, droppable }) => {
      console.log('Left:', droppable.data.name);
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      {/* Your components */}
    </DndObserverContext.Provider>
  );
}
```

## Signature

```ts
function useDndObserverCallback<
  T extends CollisionData = CollisionData,
  K extends keyof DndObserverEventCallbacks<T> = keyof DndObserverEventCallbacks<T>,
>(
  eventType: K,
  callback?: DndObserverEventCallbacks<T>[K],
  dndObserver?: DndObserver<T> | null,
): void;
```

## Parameters

### eventType

The event type to listen for. See [DndObserver events](/dnd-observer.html#events) for the available event names and payloads.

### callback

- Type: `DndObserverEventCallbacks<T>[K] | undefined`
- Optional

The callback function to call when the event occurs. If `undefined`, no listener is attached.

### dndObserver

- Type: `DndObserver<T> | null | undefined`
- Optional

The [DndObserver](https://niklasramo.github.io/dragdoll/dnd-observer) instance to attach the listener to. If `undefined`, uses the observer from [DndObserverContext](/react/dnd-observer-context). Can be `null` if not yet initialized.

## Return Value

This hook doesn't return anything.

## Examples

### Basic Event Listening

```tsx
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    'enter',
    ({ droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Multiple Events

```tsx
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    'start',
    ({ draggable }) => {
      console.log('Drag started');
    },
    dndObserver,
  );

  useDndObserverCallback(
    'move',
    ({ draggable }) => {
      console.log('Draggable moved');
    },
    dndObserver,
  );

  useDndObserverCallback(
    'enter',
    ({ droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    dndObserver,
  );

  useDndObserverCallback(
    'leave',
    ({ droppable }) => {
      console.log('Left:', droppable.data.name);
    },
    dndObserver,
  );

  useDndObserverCallback(
    'end',
    ({ droppable }) => {
      if (droppable) {
        console.log('Dropped on:', droppable.data.name);
      }
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Using Context Observer

```tsx
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function EventLogger() {
  // Uses observer from DndObserverContext
  useDndObserverCallback('enter', ({ droppable }) => {
    console.log('Entered:', droppable.data.name);
  });

  useDndObserverCallback('leave', ({ droppable }) => {
    console.log('Left:', droppable.data.name);
  });

  return null;
}

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <EventLogger />
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### With State Updates

```tsx
import { useState } from 'react';
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function App() {
  const [currentDroppable, setCurrentDroppable] = useState<string | null>(null);
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    'enter',
    ({ droppable }) => {
      setCurrentDroppable(droppable.data.name);
    },
    dndObserver,
  );

  useDndObserverCallback(
    'leave',
    () => {
      setCurrentDroppable(null);
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div>{currentDroppable && <p>Over: {currentDroppable}</p>}</div>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Using Event Type Constants

```tsx
import { DndObserverEventType } from 'dragdoll';
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    DndObserverEventType.Enter,
    ({ droppable }) => {
      console.log('Entered');
    },
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.Leave,
    ({ droppable }) => {
      console.log('Left');
    },
    dndObserver,
  );

  useDndObserverCallback(
    DndObserverEventType.End,
    ({ droppable }) => {
      console.log('Ended');
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Collision Data Access

```tsx
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    'collide',
    ({ draggable, droppable, collision }) => {
      console.log('Collision score:', collision.score);
      console.log('Collision rect:', collision.rect);
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Conditional Logic

```tsx
import { useState } from 'react';
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';

function App() {
  const [isAccepting, setIsAccepting] = useState(true);
  const dndObserver = useDndObserver();

  useDndObserverCallback(
    'enter',
    ({ droppable }) => {
      if (isAccepting) {
        console.log('Accepted:', droppable.data.name);
      }
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <button onClick={() => setIsAccepting(!isAccepting)}>
        Toggle Accept: {isAccepting ? 'ON' : 'OFF'}
      </button>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

## Notes

- The listener is automatically cleaned up when the component unmounts or when dependencies change
- If `dndObserver` is `null` or `undefined`, no listener is attached
- If `callback` is `undefined`, no listener is attached
- The callback is automatically removed and re-added when it changes
- Each call to this hook adds a separate listener
- If no observer is provided, the hook uses the observer from [DndObserverContext](/react/dnd-observer-context)

## Comparison with useDndObserver Callbacks

You can also pass callbacks via the [useDndObserver](/react/use-dnd-observer) options:

```tsx
// Using useDndObserverCallback
useDndObserverCallback(
  'enter',
  ({ droppable }) => {
    console.log('Entered', droppable.data.name);
  },
  dndObserver,
);

// Using useDndObserver callbacks
useDndObserver({
  onEnter: ({ droppable }) => {
    console.log('Entered', droppable.data.name);
  },
});
```

The main differences:

- `useDndObserverCallback` is more flexible for dynamic listeners
- `useDndObserver` callbacks are set during observer creation
- `useDndObserverCallback` allows adding listeners from child components
- Both approaches can be used together

## Types

For detailed type information, see the [DndObserver events](/dnd-observer.html#events) in the vanilla docs.
