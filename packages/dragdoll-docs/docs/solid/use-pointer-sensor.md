# usePointerSensor

A Solid hook that creates a [`PointerSensor`](/pointer-sensor) instance for handling pointer, touch, and mouse events.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { useDraggable, usePointerSensor } from 'dragdoll-solid';

function DraggableItem() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
      }}
      style={{ position: 'relative' }}
    >
      Drag me
    </div>
  );
}
```

## Signature

```ts
function usePointerSensor<E extends PointerSensorEvents = PointerSensorEvents>(
  settings?: MaybeAccessor<Partial<PointerSensorSettings> | undefined>,
  element?: MaybeAccessor<Element | Window | null>,
): readonly [Accessor<PointerSensor<E> | null>, (node: Element | null) => void];
```

## Parameters

### settings

```ts
type settings = MaybeAccessor<Partial<PointerSensorSettings> | undefined>;
```

Configuration settings for the pointer sensor. See core [PointerSensor settings](/pointer-sensor#settings) for all available settings. You can pass a plain object or an accessor function that returns one.

Since Solid components run their setup code only once, there is no need to memoize settings. If you need reactive settings, pass an accessor function (e.g. `() => ({ ...mySignalSettings() })`).

To listen for sensor events (`start`, `move`, `cancel`, `end`, `destroy`), use the [`useSensorCallback`](/solid/use-sensor-callback) hook:

```tsx
const [pointerSensor, setPointerSensorRef] = usePointerSensor();

useSensorCallback(pointerSensor, 'start', (e) => {
  console.log('Sensor started at', e.x, e.y);
});
useSensorCallback(pointerSensor, 'move', (e) => {
  console.log('Sensor moved to', e.x, e.y);
});
useSensorCallback(pointerSensor, 'cancel', (e) => {
  console.log('Sensor cancelled at', e.x, e.y);
});
useSensorCallback(pointerSensor, 'end', (e) => {
  console.log('Sensor ended at', e.x, e.y);
});
useSensorCallback(pointerSensor, 'destroy', () => {
  console.log('Sensor destroyed');
});
```

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default: `{}`.

### element

```ts
type element = MaybeAccessor<Element | Window | null>;
```

The element to attach the sensor to. If you want to attach the sensor to an element that is not managed by Solid, you can provide the element (or an accessor returning it) as the second parameter to the hook. In other cases it's recommended to always use the ref callback which is returned from the hook as the second value in the array.

- Optional.
- Default: `undefined`.

## Return Value

```ts
type returnValue = readonly [Accessor<PointerSensor<E> | null>, (node: Element | null) => void];
```

Returns a read-only array with two elements:

1. **pointerSensor**
   - An accessor that resolves to the [`PointerSensor`](/pointer-sensor) instance, or `null` if not yet initialized. Access the value by calling it: `pointerSensor()`.

2. **setPointerSensorRef**
   - A ref callback to attach the sensor to an element. This is the recommended way to attach the sensor to an element. You can alternatively provide an explicit element as the second parameter to the hook.

## Notes

- The sensor instance is automatically destroyed when the component unmounts (via `onCleanup`).
- Settings can be updated dynamically via an accessor and will be applied to the sensor.
- If the element changes, the sensor is recreated with the new element.
- The sensor will be `null` initially until an element is attached.

## Types

### MaybeAccessor

```ts
// Import
import type { MaybeAccessor } from 'dragdoll-solid';

// Type
type MaybeAccessor<T> = T | Accessor<T>;
```

`MaybeAccessor<T>` accepts either the literal value or a Solid accessor returning `T`. This allows you to pass a plain object for static settings or an accessor function for reactive settings.
