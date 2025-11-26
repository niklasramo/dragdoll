# useDraggableDrag

A React hook that returns the current drag state of a [`Draggable`](/draggable) instance. You can use this hook to re-render a component when the drag starts and ends, and optionally on every move event.

## Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { usePointerSensor, useDraggable, useDraggableDrag } from 'dragdoll-react';

function DraggableBox() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [pointerSensor, setPointerSensorElementRef] = usePointerSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const draggable = useDraggable([pointerSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorElementRef(node);
    },
    [setPointerSensorElementRef],
  );

  return (
    <div
      ref={setRefs}
      style={{ position: 'relative', width: '100px', height: '100px', backgroundColor: 'red' }}
    >
      {drag ? 'Dragging...' : 'Drag me'}
    </div>
  );
}
```

## Signature

```ts
function useDraggableDrag<S extends Sensor = Sensor>(
  draggable: Draggable<S> | null,
  trackMove: boolean = false,
): DraggableDrag<S> | null;
```

## Parameters

### draggable

```ts
type draggable = Draggable<S> | null;
```

The [`Draggable`](/draggable) instance to get the drag state from. Can be `null` if not yet initialized.

- Required.

### trackMove

```ts
type trackMove = boolean;
```

Whether to track the move event. When enabled, the component will re-render on every move event.

- Optional.
- Default is `false`.

## Return Value

Returns the current [DraggableDrag](/draggable-drag) instance or `null` if:

- The draggable is `null`
- There is no active drag
