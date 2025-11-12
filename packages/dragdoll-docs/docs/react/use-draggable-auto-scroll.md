# useDraggableAutoScroll

A React hook that adds auto-scroll functionality to a [`Draggable`](/draggable) instance using the [auto-scroll plugin](/draggable-auto-scroll-plugin).

## Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { usePointerSensor, useDraggable, useDraggableAutoScroll } from 'dragdoll-react';

function DraggableBox() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [pointerSensor, setPointerSensorElementRef] = usePointerSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const autoScrollSettings = useMemo(
    () => ({
      targets: [{ element: window, priority: 0 }],
      speed: 500,
    }),
    [],
  );

  // You simply wrap the `useDraggable` hook with the `useDraggableAutoScroll`
  // hook, as easy as that. This way the returned draggable instance will have
  // the correct types (extended by the autoscroll plugin).
  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor], draggableSettings),
    autoScrollSettings,
  );

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
      Drag me
    </div>
  );
}
```

## Signature

```ts
function useDraggableAutoScroll<S extends Sensor[] = Sensor[], P extends DraggablePluginMap = {}>(
  draggable: Draggable<S, P> | null,
  options?: DraggableAutoScrollOptions<S>,
): Draggable<S, P & { autoscroll: AutoScrollPlugin }> | null;
```

## Parameters

### draggable

```ts
type draggable = Draggable<S, P> | null;
```

The [`Draggable`](/draggable) instance to add auto-scroll functionality to. Can be `null` if not yet initialized.

- Required.

### settings

```ts
type settings = DraggableAutoScrollOptions<S>;
```

Configuration options for auto-scrolling. See the auto-scroll plugin [settings](/draggable-auto-scroll-plugin#settings) for all the available options.

As per React's declarative nature, these settings are always merged with the default settings and then provided to the [`DraggableAutoScroll`](/draggable-auto-scroll-plugin) instance. This way there will be no cumulative effect of settings changes over time meaning that the old settings will be completely overridden by the new settings.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = Draggable<S, P & { autoscroll: AutoScrollPlugin }> | null;
```

Returns the [`Draggable`](/draggable) instance with the auto-scroll plugin attached (which also extends the `Draggable` instance's types).

Returns `null` if the `draggable` parameter is `null`.
