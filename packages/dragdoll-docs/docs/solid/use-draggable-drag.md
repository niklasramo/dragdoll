# useDraggableDrag

A Solid hook that returns the current drag state of a [`Draggable`](/draggable) instance. You can use this hook to reactively update a component when the drag starts and ends, and optionally on every move event.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useDraggable, useDraggableDrag } from 'dragdoll-solid';

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
  }));
  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
      }}
      style={{ position: 'relative', width: '100px', height: '100px', 'background-color': 'red' }}
    >
      {drag() ? 'Dragging...' : 'Drag me'}
    </div>
  );
}
```

## Signature

```ts
function useDraggableDrag<S extends Sensor = Sensor>(
  draggable: MaybeAccessor<Draggable<S> | null>,
  trackMove?: boolean,
): Accessor<DraggableDrag<S> | null>;
```

## Parameters

### draggable

```ts
type draggable = MaybeAccessor<Draggable<S> | null>;
```

The [`Draggable`](/draggable) instance to get the drag state from. Can be `null` if not yet initialized. Accepts a plain value or an accessor function.

- Required.

### trackMove

```ts
type trackMove = boolean;
```

Whether to track the move event. When enabled, the returned accessor will update on every move event, giving you access to live coordinates during a drag.

- Optional.
- Default is `false`.

## Return Value

```ts
type returnValue = Accessor<DraggableDrag<S> | null>;
```

Returns an accessor that resolves to the current [DraggableDrag](/draggable-drag) instance or `null` if:

- The draggable is `null`
- There is no active drag

Access the value by calling the accessor: `drag()`.

## Types

### MaybeAccessor

```ts
// Import
import type { MaybeAccessor } from 'dragdoll-solid';

// Type
type MaybeAccessor<T> = T | Accessor<T>;
```

### DraggableDrag

```ts
// Import
import type { DraggableDrag } from 'dragdoll';

// See the DraggableDrag documentation for the full interface.
```

## Notes

- The hook automatically listens to `start`, `move`, and `end` events and disposes all listeners on cleanup.
- `trackMove` defaults to `false`. Enable it when you need per-frame updates during a drag (e.g. displaying live coordinates).
- The return value is an `Accessor` -- read it by calling `drag()`, not `drag`.
- If the resolved `draggable` is `null`, the returned accessor will always resolve to `null` until the instance exists.
- Settings can be passed as plain objects or accessor functions -- no memoization is needed.
