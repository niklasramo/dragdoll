# useDraggableDrag

Convenience hook that subscribes to the active [`DraggableDrag`](/draggable-drag) state of a
draggable created with `useDraggable`.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  useDraggable,
  useDraggableDrag,
  usePointerSensor,
  useKeyboardMotionSensor,
} from 'dragdoll-solid';

function Card() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  const drag = useDraggableDrag(draggable, true);

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
        setKeyboardSensorRef(node);
      }}
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      tabIndex={0}
    >
      {drag() ? `${drag()!.items[0].position.x.toFixed(0)}px` : 'Drag me'}
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

Passing `true` as the second argument forces the hook to emit every `move` event (handy when you
need live coordinates for UI).

## Signature

```ts
function useDraggableDrag<S extends Sensor[] = Sensor[]>(
  draggable: Accessor<Draggable<S> | null>,
  trackMove?: boolean,
): Accessor<DraggableDrag<S> | null>;
```

## Notes

- Automatically listens to `start`, `move`, and `end` events and disposes listeners on cleanup.
- `trackMove` defaults to `false`. Enable it when you need per-frame updates during a drag.
