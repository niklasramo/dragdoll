# useDndObserverCallback

A React hook for attaching an event listener to a [`DndObserver`](/dnd-observer) instance.

The closest [`DndObserverContext`](/react/dnd-observer-context) will be used automatically to find the observer instance to attach the listener to. If no observer is found in context, the observer instance can be passed explicitly as the third argument.

## Usage

```tsx
import { DndObserverContext, useDndObserver, useDndObserverCallback } from 'dragdoll-react';
import { DndObserverEventType } from 'dragdoll';

function App() {
  const dndObserver = useDndObserver();

  // The closest dnd context from DndObserverContext will be used automatically.
  // However, if there is no dnd observer found from the closest
  // DndObserverContext, you can pass the observer instance explicitly as the
  // third argument (as is done in this example).
  useDndObserverCallback(
    DndObserverEventType.Enter,
    ({ draggable, droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    dndObserver,
  );

  // You don't have to memoize the callback, it's handled internally in a stable
  // and performant way.
  useDndObserverCallback(
    DndObserverEventType.Leave,
    ({ draggable, droppable }) => {
      console.log('Left:', droppable.data.name);
    },
    dndObserver,
  );

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <FooComponent />
      {/* Your other components */}
    </DndObserverContext.Provider>
  );
}

function FooComponent() {
  // The closest dnd context from DndObserverContext will be used automatically.
  useDndObserverCallback(DndObserverEventType.Start, ({ draggable, droppable }) => {
    console.log('Started:', draggable.data.name);
  });
  useDndObserverCallback(DndObserverEventType.End, ({ draggable, droppable }) => {
    console.log('Ended:', draggable.data.name);
  });

  return <div>Foo component</div>;
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

```ts
type eventType = keyof DndObserverEventCallbacks<T>;
```

The event type to listen for. See `DndObserver` [events](/dnd-observer.html#events) for the available event names and payloads.

- Required.

### callback

```ts
type callback = DndObserverEventCallback<T, K> | undefined;
```

The callback function to call when the event occurs. If `undefined`, no listener is attached.

> [!IMPORTANT]  
> The callback does not have to be memoized, you can pass a new function every time. Internally, the hook will store the latest callback in a ref and bind a proxy callback to the event listener, which in turn will call the latest callback.

- Optional.
- Default is `undefined`.

### dndObserver

```ts
type dndObserver = DndObserver<T> | null | undefined;
```

The [`DndObserver`](/dnd-observer) instance to attach the listener to. If `undefined`, uses the observer from the closest [`DndObserverContext`](/react/dnd-observer-context). Can be `null` if not yet initialized. The automatic context lookup will be used only if this is `undefined`.

- Optional.
- Default is `undefined`.
