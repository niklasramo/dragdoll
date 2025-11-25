# useDroppable

Creates a [`Droppable`](/droppable) and keeps it synchronized with Solid signals plus the current
`DndObserver` context.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import { useDroppable } from 'dragdoll-solid';

function DropZone() {
  const data = {
    overIds: new Set<number>(),
    droppedIds: new Set<number>(),
  };

  const [, setDroppableElementRef] = useDroppable(() => ({
    data,
  }));

  return <div ref={setDroppableElementRef} class="droppable" />;
}

render(() => <DropZone />, document.getElementById('root')!);
```

## Signature

```ts
function useDroppable(
  settings?: MaybeAccessor<UseDroppableSettings | undefined>,
): readonly [Accessor<Droppable | null>, (node: HTMLElement | SVGSVGElement | null) => void];
```

## Notable options

- `accept` — Predicate deciding whether a drag may interact with this droppable.
- `data` — Custom metadata stored on the droppable (handy for observer callbacks).
- `element` — Provide your own element instead of the returned ref callback.
- `dndObserver` — Override the observer pulled from context.

## Notes

- Each droppable is automatically registered with the effective `DndObserver`.
- Updating `accept` or `data` mutates the existing droppable instead of re-creating it.
- Changing the `id` or `element` triggers a recreation.
