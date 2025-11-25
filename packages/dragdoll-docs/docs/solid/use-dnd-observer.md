# useDndObserver

Constructs a [`DndObserver`](/dnd-observer) inside Solid's lifecycle and exposes it via an accessor.
The observer can then be provided through `DndObserverContext` so draggables/droppables register
automatically.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDroppable,
  usePointerSensor,
} from 'dragdoll-solid';

function App() {
  const observer = useDndObserver({
    onCollide: ({ draggable, contacts }) => {
      console.log(
        draggable.id,
        'collided with',
        [...contacts].map((d) => d.id),
      );
    },
  });

  return (
    <DndObserverContext.Provider value={observer}>
      {/* ...draggables & droppables... */}
    </DndObserverContext.Provider>
  );
}

render(() => <App />, document.getElementById('root')!);
```

## Signature

```ts
function useDndObserver<T extends CollisionData = CollisionData>(
  settings?: MaybeAccessor<UseDndObserverSettings<T> | undefined>,
): Accessor<DndObserver<T> | null>;
```

`UseDndObserverSettings` mirrors the constructor options and event callbacks from the core class.

## Notes

- Creating a new `collisionDetector` accessor recreates the whole observer.
- Callbacks can be supplied directly or via accessors for reactive composition.
- Destroying the component automatically tears down the observer instance.
