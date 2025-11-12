# useDraggableCallback

A React hook for attaching event listeners to a [`Draggable`](/draggable) instance. You can check all the available event types in the `Draggable` [events](/draggable#events) section.

## Usage

```tsx
import { useDraggable, useDraggableCallback } from 'dragdoll-react';
import { DraggableEventType } from 'dragdoll';

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
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorElementRef(node);
    },
    [setPointerSensorElementRef],
  );

  // Note that you don't have to memoize the callback, it's handled internally
  // in a stable and performant way.
  useDraggableCallback(draggable, DraggableEventType.Start, (event) => {
    console.log('Drag started', event);
  });
  useDraggableCallback(draggable, DraggableEventType.Move, (event) => {
    console.log('Drag moved', event);
  });
  useDraggableCallback(draggable, DraggableEventType.End, (event) => {
    console.log('Drag ended', event);
  });

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
function useDraggableCallback<
  S extends Sensor[] = Sensor[],
  K extends keyof DraggableEventCallbacks<SensorsEventsType<S>> = keyof DraggableEventCallbacks<
    SensorsEventsType<S>
  >,
>(draggable: Draggable<S> | null, eventType: K, callback?: DraggableEventCallback<S, K>): void;
```

## Parameters

### draggable

```ts
type draggable = Draggable<S> | null;
```

The [`Draggable`](/draggable) instance to attach the listener to. Can be `null` if not yet initialized.

- Required.

### eventType

```ts
type eventType = keyof DraggableEventCallbacks<SensorsEventsType<S>>;
```

The event type to listen for. See [Draggable events](/draggable.html#events) for the available event names.

- Required.

### callback

```ts
type callback = DraggableEventCallback<S, K> | undefined;
```

The callback function to call when the event occurs. If `undefined`, no listener is attached. Optional, but very much recommended.

The callback does not have to be memoized, you can pass a new function every time. Internally, the hook will store the latest callback in a ref and bind a proxy callback to the event listener, which in turn will call the latest callback.

- Optional.
- Default is `undefined`.
