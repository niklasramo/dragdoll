# useDndObserverContext

A Solid hook that retrieves the [`DndObserver`](/dnd-observer) accessor from the closest [`DndObserverContext`](/solid/dnd-observer-context).

## Usage

```tsx
/** @jsxImportSource solid-js */
import { Show } from 'solid-js';
import { render } from 'solid-js/web';
import { DndObserverContext, useDndObserver, useDndObserverContext } from 'dragdoll-solid';

function SomeComponent() {
  const observer = useDndObserverContext();

  return (
    <Show when={observer()} fallback={<div>No dnd observer in context</div>}>
      <div>Dnd observer ready!</div>
    </Show>
  );
}

function App() {
  const observer = useDndObserver();

  return (
    <DndObserverContext.Provider value={observer}>
      <SomeComponent />
    </DndObserverContext.Provider>
  );
}

render(() => <App />, document.getElementById('root')!);
```

## Signature

```ts
function useDndObserverContext<
  T extends CollisionData = CollisionData,
>(): Accessor<DndObserver<T> | null>;
```

## Return Value

```ts
type returnValue = Accessor<DndObserver<T> | null>;
```

Returns an accessor to the [`DndObserver`](/dnd-observer) instance from context. The accessor resolves to `null` if no observer is provided in context. Access with `observer()`.

## Notes

- Returns whatever the provider stores -- typically the accessor from `useDndObserver`.
- If you have multiple observers, create nested providers to scope hooks to the desired instance.
