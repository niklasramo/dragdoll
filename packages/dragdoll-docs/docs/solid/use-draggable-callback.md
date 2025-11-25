# useDraggableCallback

Registers a callback for a specific [`DraggableEventType`](/draggable#events) without manually
subscribing to the emitter. Useful when you only need a side effect (logging, analytics, etc.)
instead of the full `useDraggableDrag` state.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  useDraggable,
  useDraggableCallback,
  usePointerSensor,
  useKeyboardSensor,
} from 'dragdoll-solid';
import { DraggableEventType } from 'dragdoll/draggable';

function Card() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardSensor();
  const draggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  useDraggableCallback(draggable, DraggableEventType.Start, ({ sensor }) => {
    console.log('Drag started with', sensor?.constructor.name);
  });

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
        setKeyboardSensorRef(node);
      }}
      class="card draggable"
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
function useDraggableCallback<S extends Sensor[] = Sensor[]>(
  draggable: Accessor<Draggable<S> | null>,
  type: DraggableEventType,
  callback: MaybeAccessor<DraggableEventCallback<S> | undefined>,
): void;
```

## Notes

- The hook automatically unsubscribes when the component unmounts or when dependencies change.
- The callback accepts a `MaybeAccessor`, allowing you to derive handlers from signals/stores.
- If `draggable()` is `null`, the callback is ignored until the instance exists.
