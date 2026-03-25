# useSensorCallback

A Solid hook for attaching an event listener to a [`Sensor`](/sensor) instance. You can check all the available event types in the [`Sensor`](/sensor) docs.

Note that all sensor hooks ([`usePointerSensor`](/solid/use-pointer-sensor), [`useKeyboardSensor`](/solid/use-keyboard-sensor), [`useKeyboardMotionSensor`](/solid/use-keyboard-motion-sensor)) also accept `on*` callback props directly in their settings, which use this hook internally. For most cases, inline callbacks are more convenient. Use `useSensorCallback` directly when you need to listen to a sensor from a different component than the one that created it.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useSensorCallback } from 'dragdoll-solid';

function DraggableItem() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  // No need to wrap callbacks in createMemo or similar — the hook
  // stores the latest callback internally and uses a stable proxy listener.
  useSensorCallback(pointerSensor, 'start', (e) => {
    console.log('Sensor started at', e.x, e.y);
  });
  useSensorCallback(pointerSensor, 'move', (e) => {
    console.log('Sensor moved to', e.x, e.y);
  });
  useSensorCallback(pointerSensor, 'end', (e) => {
    console.log('Sensor ended at', e.x, e.y);
  });

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
      }}
    >
      Drag me
    </div>
  );
}
```

## Signature

```ts
function useSensorCallback<E extends SensorEvents = SensorEvents, K extends keyof E = keyof E>(
  sensor: MaybeAccessor<Sensor<E> | null>,
  eventType: K,
  callback?: MaybeAccessor<((eventData: E[K]) => void) | undefined>,
): void;
```

## Parameters

### sensor

```ts
type sensor = MaybeAccessor<Sensor<E> | null>;
```

The sensor instance to attach the listener to. Accepts either an accessor (e.g. the first element of the tuple returned by `usePointerSensor`) or a raw `Sensor` instance. Can be `null` if not yet initialized.

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
type callback = MaybeAccessor<((eventData: E[K]) => void) | undefined>;
```

The callback function to call when the event occurs. Accepts either a plain function or an accessor returning one (via `MaybeAccessor`). If `undefined`, no listener is attached.

> [!IMPORTANT]
> The callback does not have to be memoized. Internally, the hook stores the latest callback value via `createEffect` and binds a stable proxy listener to the sensor event. This means you can pass a new function reference every time without causing re-subscriptions.

- Optional.
- Default is `undefined`.
