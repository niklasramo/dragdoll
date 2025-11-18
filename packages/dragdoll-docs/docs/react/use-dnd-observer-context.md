# useDndObserverContext

A React hook that retrieves the [`DndObserver`](/dnd-observer) instance from the closest [`DndObserverContext`](/react/dnd-observer-context).

## Usage

```tsx
import { useDndObserverContext } from 'dragdoll-react';

function SomeComponent() {
  const dndObserver = useDndObserverContext();

  if (!dndObserver) {
    return <div>No dnd observer in context</div>;
  }

  return <div>Dnd observer ready!</div>;
}
```

## Signature

```ts
function useDndObserverContext<T extends CollisionData = CollisionData>(): DndObserver<T> | null;
```

## Return Value

```ts
type returnValue = DndObserver<T> | null;
```

Returns the [`DndObserver`](/dnd-observer) instance from context, or `null` if no observer is provided in context.
