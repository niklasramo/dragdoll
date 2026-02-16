# useSensorCallback

A React hook for attaching an event listener to a [`Sensor`](/sensor) instance. You can check all the available event types in the [`Sensor`](/sensor) docs.

Note that all sensor hooks ([`usePointerSensor`](/react/use-pointer-sensor), [`useKeyboardSensor`](/react/use-keyboard-sensor), [`useKeyboardMotionSensor`](/react/use-keyboard-motion-sensor)) also accept `on*` callback props directly in their settings, which use this hook internally. For most cases, inline callbacks are more convenient. Use `useSensorCallback` directly when you need to listen to a sensor from a different component than the one that created it.

## Usage

```tsx
import { usePointerSensor, useSensorCallback } from 'dragdoll-react';

function DraggableItem() {
  const [pointerSensor, setPointerSensorElementRef] = usePointerSensor();

  // Note that you don't have to memoize the callback, it's handled internally
  // in a stable and performant way.
  useSensorCallback(pointerSensor, 'start', (e) => {
    console.log('Sensor started at', e.x, e.y);
  });
  useSensorCallback(pointerSensor, 'move', (e) => {
    console.log('Sensor moved to', e.x, e.y);
  });
  useSensorCallback(pointerSensor, 'end', (e) => {
    console.log('Sensor ended at', e.x, e.y);
  });

  return <div ref={setPointerSensorElementRef}>Drag me</div>;
}
```

## Signature

```ts
function useSensorCallback<E extends SensorEvents = SensorEvents, K extends keyof E = keyof E>(
  sensor: Sensor<E> | null,
  eventType: K,
  callback?: (eventData: E[K]) => void,
): void;
```

## Parameters

### sensor

```ts
type sensor = Sensor<E> | null;
```

The sensor instance to attach the listener to. Can be `null` if not yet initialized.

- Required.

### eventType

```ts
type eventType = keyof E;
```

The event type to listen for. The available event types depend on the sensor type:

- **All sensors**: `'start'`, `'move'`, `'cancel'`, `'end'`, `'destroy'`
- **Motion sensors** (e.g. `KeyboardMotionSensor`): also `'tick'`

- Required.

### callback

```ts
type callback = ((eventData: E[K]) => void) | undefined;
```

The callback function to call when the event occurs. If `undefined`, no listener is attached.

> [!IMPORTANT]
> The callback does not have to be memoized, you can pass a new function every time. Internally, the hook will store the latest callback in a ref and bind a proxy callback to the event listener, which in turn will call the latest callback.

- Optional.
- Default is `undefined`.
