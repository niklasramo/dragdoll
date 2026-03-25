# useDraggableAutoScroll

A Solid hook that adds auto-scroll functionality to a [`Draggable`](/draggable) instance using the [auto-scroll plugin](/draggable-auto-scroll-plugin).

## Usage

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useDraggable, useDraggableAutoScroll } from 'dragdoll-solid';

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor], () => ({
      elements: () => (element ? [element] : []),
    })),
    () => ({
      targets: [{ element: window, priority: 0 }],
      speed: 500,
    }),
  );

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
      }}
      style={{ position: 'relative', width: '100px', height: '100px', 'background-color': 'red' }}
    >
      Drag me
    </div>
  );
}
```

## Signature

```ts
function useDraggableAutoScroll<S extends Sensor = Sensor, P extends DraggablePluginMap = {}>(
  draggable: MaybeAccessor<Draggable<S, P> | null>,
  settings?: MaybeAccessor<UseDraggableAutoScrollSettings<S> | undefined>,
): Accessor<ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null>;
```

## Parameters

### draggable

```ts
type draggable = MaybeAccessor<Draggable<S, P> | null>;
```

The [`Draggable`](/draggable) instance to add auto-scroll functionality to. Can be `null` if not yet initialized. Accepts a plain value or an accessor function.

- Required.

### settings

```ts
type settings = MaybeAccessor<UseDraggableAutoScrollSettings<S> | undefined>;
```

Configuration options for auto-scrolling. See the auto-scroll plugin [settings](/draggable-auto-scroll-plugin#settings) for all the available options. Accepts a plain object or an accessor function that returns the settings object.

Settings are always merged with the default settings and then provided to the [`DraggableAutoScroll`](/draggable-auto-scroll-plugin) instance. This way there will be no cumulative effect of settings changes over time, meaning that the old settings will be completely overridden by the new settings.

Settings can be passed as plain objects or accessor functions -- no memoization is needed. The hook performs a deep equality check internally and only updates the plugin when settings have actually changed.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = Accessor<ReturnType<ReturnType<typeof autoScrollPlugin<S, P>>> | null>;
```

Returns an accessor that resolves to the [`Draggable`](/draggable) instance with the auto-scroll plugin attached (which also extends the `Draggable` instance's types).

Returns `null` if the resolved `draggable` is `null`.

Access the value by calling the accessor: `draggable()`.

## Types

### UseDraggableAutoScrollSettings

```ts
// Import
import type { UseDraggableAutoScrollSettings } from 'dragdoll-solid';

// Type
type UseDraggableAutoScrollSettings<S extends Sensor = Sensor> = DraggableAutoScrollOptions<S>;
```

### MaybeAccessor

```ts
// Import
import type { MaybeAccessor } from 'dragdoll-solid';

// Type
type MaybeAccessor<T> = T | Accessor<T>;
```

## Notes

- The hook automatically installs the auto-scroll plugin once the draggable instance exists.
- Plugin settings are diffed with deep equality; real changes call `plugin.updateSettings`.
- The returned accessor resolves to the same draggable instance (with extended types) so you can keep chaining helpers like `useDraggableDrag`.
- If the resolved `draggable` is `null`, the returned accessor will resolve to `null` until the instance exists.
- Settings can be passed as plain objects or accessor functions -- no memoization is needed.
