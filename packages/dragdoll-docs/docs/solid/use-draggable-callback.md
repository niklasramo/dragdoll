# useDraggableCallback

A Solid hook for attaching event listeners to a [`Draggable`](/draggable) instance. You can check all the available event types in the `Draggable` [events](/draggable#events) section.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { useDraggable, useDraggableCallback, usePointerSensor } from 'dragdoll-solid';
import { DraggableEventType } from 'dragdoll';

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  // Callbacks do not need special handling — the hook stores a reference
  // to the latest callback internally.
  useDraggableCallback(draggable, DraggableEventType.Start, (drag, draggable) => {
    console.log('Drag started', drag, draggable);
  });
  useDraggableCallback(draggable, DraggableEventType.Move, (drag, draggable) => {
    console.log('Drag moved', drag, draggable);
  });
  useDraggableCallback(draggable, DraggableEventType.End, (drag, draggable) => {
    console.log('Drag ended', drag, draggable);
  });

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
function useDraggableCallback<
  S extends Sensor = Sensor,
  K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>,
>(
  draggable: MaybeAccessor<Draggable<S> | null>,
  eventType: K,
  callback: MaybeAccessor<DraggableEventCallback<S, K> | undefined>,
): void;
```

## Parameters

### draggable

```ts
type draggable = MaybeAccessor<Draggable<S> | null>;
```

The [`Draggable`](/draggable) instance to attach the listener to. Can be `null` if not yet initialized. Accepts a plain value or an accessor function.

- Required.

### eventType

```ts
type eventType = keyof DraggableEventCallbacks<S>;
```

The event type to listen for. See [Draggable events](/draggable.html#events) for the available event names.

- Required.

### callback

```ts
type callback = MaybeAccessor<DraggableEventCallback<S, K> | undefined>;
```

The callback function to call when the event occurs. If `undefined`, no listener is attached. Accepts a plain value or an accessor function that returns the callback.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = void;
```

This hook does not return a value.

## Types

### MaybeAccessor

```ts
// Import
import type { MaybeAccessor } from 'dragdoll-solid';

// Type
type MaybeAccessor<T> = T | Accessor<T>;
```

### DraggableEventCallback

```ts
// Import
import type { DraggableEventCallback } from 'dragdoll';

// Type — see Draggable events for the full callback signatures.
type DraggableEventCallback<
  S extends Sensor = Sensor,
  K extends keyof DraggableEventCallbacks<S> = keyof DraggableEventCallbacks<S>,
> = DraggableEventCallbacks<S>[K];
```

## Notes

- The hook automatically unsubscribes when the component unmounts or when dependencies change.
- The `callback` parameter accepts a `MaybeAccessor`, so you can pass either a plain function or an accessor that returns a function. This lets you derive handlers from signals or stores.
- If the resolved `draggable` is `null`, the callback is ignored until the instance exists.
- Settings can be passed as plain objects or accessor functions — no memoization is needed.
