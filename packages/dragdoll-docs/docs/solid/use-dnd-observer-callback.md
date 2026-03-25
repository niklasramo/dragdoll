# useDndObserverCallback

A Solid hook for attaching an event listener to a [`DndObserver`](/dnd-observer) instance.

The closest [`DndObserverContext`](/solid/dnd-observer-context) will be used automatically to find the observer instance to attach the listener to. If no observer is found in context, the observer instance can be passed explicitly as the third argument.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  DndObserverContext,
  useDndObserver,
  useDndObserverCallback,
  useDndObserverContext,
} from 'dragdoll-solid';
import { DndObserverEventType } from 'dragdoll';

function App() {
  const observer = useDndObserver();

  // The closest dnd context from DndObserverContext will be used automatically.
  // However, if there is no dnd observer found from the closest
  // DndObserverContext, you can pass the observer instance explicitly as the
  // third argument (as is done in this example).
  useDndObserverCallback(
    DndObserverEventType.Enter,
    ({ draggable, droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    observer,
  );

  // You don't have to wrap the callback in a memo or accessor, it's handled
  // internally in a stable and performant way.
  useDndObserverCallback(
    DndObserverEventType.Leave,
    ({ draggable, droppable }) => {
      console.log('Left:', droppable.data.name);
    },
    observer,
  );

  return (
    <DndObserverContext.Provider value={observer}>
      <FooComponent />
      {/* Your other components */}
    </DndObserverContext.Provider>
  );
}

function FooComponent() {
  // The closest dnd context from DndObserverContext will be used automatically.
  useDndObserverCallback(DndObserverEventType.Start, ({ draggable }) => {
    console.log('Started:', draggable.data.name);
  });
  useDndObserverCallback(DndObserverEventType.End, ({ draggable }) => {
    console.log('Ended:', draggable.data.name);
  });

  return <div>Foo component</div>;
}

render(() => <App />, document.getElementById('root')!);
```

## Signature

```ts
function useDndObserverCallback<
  T extends CollisionData = CollisionData,
  K extends keyof DndObserverEventCallbacks<T> = keyof DndObserverEventCallbacks<T>,
>(
  eventType: K,
  callback?: MaybeAccessor<DndObserverEventCallbacks<T>[K] | undefined>,
  dndObserver?: MaybeAccessor<DndObserver<T> | null>,
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
type callback = MaybeAccessor<DndObserverEventCallbacks<T>[K] | undefined>;
```

The callback function to call when the event occurs. If `undefined`, no listener is attached. Can be a plain function or an accessor returning a function.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

### dndObserver

```ts
type dndObserver = MaybeAccessor<DndObserver<T> | null> | undefined;
```

The [`DndObserver`](/dnd-observer) instance to attach the listener to. Can be an accessor (e.g. the return value of `useDndObserver`) or a raw instance. If `undefined`, uses the observer from the closest [`DndObserverContext`](/solid/dnd-observer-context). Can resolve to `null` if not yet initialized. The automatic context lookup will be used only if this is `undefined`.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = void;
```

Returns nothing. The hook manages the subscription lifecycle internally, attaching and detaching the listener as the observer or callback changes.

## Notes

- If the observer accessor resolves to `null`, the callback is skipped until an observer instance becomes available.
- The subscription is automatically cleaned up when the component is disposed.
- SSR-safe: no listeners are attached on the server.
