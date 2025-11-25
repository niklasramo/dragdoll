# usePointerSensor

A Solid hook that creates a [`PointerSensor`](/pointer-sensor) for mouse, touch, and pen input.
It mirrors the core sensor API but exposes Solid-friendly accessors.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import { useDraggable, usePointerSensor, useDraggableDrag } from 'dragdoll-solid';

function Card() {
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
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      tabIndex={0}
    >
      Drag me
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

## Signature

```ts
function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings?: MaybeAccessor<Partial<PointerSensorSettings> | undefined>,
  element?: MaybeAccessor<Element | Window | null>,
): readonly [Accessor<PointerSensor<E> | null>, (node: Element | null) => void];
```

`MaybeAccessor<T>` accepts either the literal value or a Solid accessor returning `T`.

## Parameters

### settings

```ts
type settings = MaybeAccessor<Partial<PointerSensorSettings> | undefined>;
```

Sensor configuration forwarded directly to the core [`PointerSensor`](/pointer-sensor).
You can pass a plain object or an accessor that returns one.

- Optional
- Default: `{}`.

### element

```ts
type element = MaybeAccessor<Element | Window | null>;
```

Explicit element (or accessor) to bind the sensor to. When omitted you should use the
returned ref callback to attach the sensor declaratively.

- Optional
- Default: `undefined`.

## Return Value

```ts
type returnValue = readonly [Accessor<PointerSensor<E> | null>, (node: Element | null) => void];
```

1. **pointerSensor**
   - An accessor that resolves to the `PointerSensor` instance when mounted (or `null` during setup).
2. **setPointerSensorRef**
   - Ref callback for wiring the sensor to an element controlled by Solid.

## Notes

- The sensor instance is destroyed automatically when the component unmounts.
- Updating `settings` (or the accessor backing it) reconfigures the sensor in place.
- Changing the element recreates the sensor to keep event targets in sync.
- Sensors stay `null` until the ref callback receives an element.
