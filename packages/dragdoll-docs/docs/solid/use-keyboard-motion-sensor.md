# useKeyboardMotionSensor

A Solid hook that creates a [`KeyboardMotionSensor`](/keyboard-motion-sensor) instance for handling keyboard-based motion events with continuous movement.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { useKeyboardMotionSensor, usePointerSensor, useDraggable } from 'dragdoll-solid';

function DraggableItem() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardMotionSensor, setKeyboardMotionSensorRef] = useKeyboardMotionSensor({
    computeSpeed: () => 120,
  });
  const draggable = useDraggable([pointerSensor, keyboardMotionSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
        setKeyboardMotionSensorRef(node);
      }}
      tabIndex={0}
      style={{ position: 'relative' }}
    >
      Drag me
    </div>
  );
}
```

## Signature

```ts
function useKeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents>(
  settings?: MaybeAccessor<Partial<KeyboardMotionSensorSettings<E>> | undefined>,
  element?: MaybeAccessor<Element | null>,
): readonly [Accessor<KeyboardMotionSensor<E> | null>, (node: Element | null) => void];
```

## Parameters

### settings

```ts
type settings = MaybeAccessor<Partial<KeyboardMotionSensorSettings<E>> | undefined>;
```

Configuration settings for the keyboard motion sensor. See core [KeyboardMotionSensor settings](/keyboard-motion-sensor#settings) for all available settings. You can pass a plain object or an accessor function that returns one.

Since Solid components run their setup code only once, there is no need to memoize settings. If you need reactive settings, pass an accessor function (e.g. `() => ({ ...mySignalSettings() })`).

To listen for sensor events (`start`, `move`, `cancel`, `end`, `destroy`, `tick`), use the [`useSensorCallback`](/solid/use-sensor-callback) hook:

```tsx
const [keyboardMotionSensor, setKeyboardMotionSensorRef] = useKeyboardMotionSensor();

useSensorCallback(keyboardMotionSensor, 'start', (e) => {
  console.log('Sensor started');
});
useSensorCallback(keyboardMotionSensor, 'move', (e) => {
  console.log('Sensor moved');
});
useSensorCallback(keyboardMotionSensor, 'cancel', (e) => {
  console.log('Sensor cancelled');
});
useSensorCallback(keyboardMotionSensor, 'end', (e) => {
  console.log('Sensor ended');
});
useSensorCallback(keyboardMotionSensor, 'destroy', () => {
  console.log('Sensor destroyed');
});
useSensorCallback(keyboardMotionSensor, 'tick', (e) => {
  console.log('Sensor tick');
});
```

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default: `{}`.

### element

```ts
type element = MaybeAccessor<Element | null>;
```

The element to attach the sensor to. If you want to attach the sensor to an element that is not managed by Solid, you can provide the element (or an accessor returning it) as the second parameter to the hook. In other cases it's recommended to always use the ref callback which is returned from the hook as the second value in the array.

- Optional.
- Default: `undefined`.

## Return Value

```ts
type returnValue = readonly [
  Accessor<KeyboardMotionSensor<E> | null>,
  (node: Element | null) => void,
];
```

Returns a read-only array with two elements:

1. **keyboardMotionSensor**
   - An accessor that resolves to the [`KeyboardMotionSensor`](/keyboard-motion-sensor) instance, or `null` if not yet initialized. Access the value by calling it: `keyboardMotionSensor()`.

2. **setKeyboardMotionSensorRef**
   - A ref callback to attach the sensor to an element. This is the recommended way to attach the sensor to an element. You can alternatively provide an explicit element as the second parameter to the hook.

## Notes

- The sensor instance is automatically destroyed when the component unmounts (via `onCleanup`).
- Settings can be updated dynamically via an accessor and will be applied to the sensor.
- If the element changes, the sensor is recreated with the new element.
- The sensor will be `null` initially until an element is attached.
- Make sure the element is focusable (e.g., with `tabIndex={0}`).

## Types

### MaybeAccessor

```ts
// Import
import type { MaybeAccessor } from 'dragdoll-solid';

// Type
type MaybeAccessor<T> = T | Accessor<T>;
```

`MaybeAccessor<T>` accepts either the literal value or a Solid accessor returning `T`. This allows you to pass a plain object for static settings or an accessor function for reactive settings.
