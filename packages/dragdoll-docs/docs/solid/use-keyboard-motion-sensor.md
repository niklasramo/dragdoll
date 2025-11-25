# useKeyboardMotionSensor

Adds smooth, velocity-based keyboard controls via [`KeyboardMotionSensor`](/keyboard-motion-sensor).
Instead of fixed deltas, it computes velocity based on pressed keys and elapsed time.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  useKeyboardMotionSensor,
  usePointerSensor,
  useDraggable,
  useDraggableDrag,
} from 'dragdoll-solid';

function Card() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor({
    computeSpeed: () => 120,
  });

  const draggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
  }));
  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLDivElement | null) => {
    element = node;
    setPointerSensorRef(node);
    setKeyboardSensorRef(node);
  };

  return (
    <div ref={setRefs} class={`card draggable ${drag() ? 'dragging' : ''}`} tabIndex={0}>
      Drag me
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

## Signature

```ts
function useKeyboardMotionSensor(
  settings?: MaybeAccessor<Partial<KeyboardMotionSensorSettings> | undefined>,
  element?: MaybeAccessor<Element | null>,
): readonly [Accessor<KeyboardMotionSensor | null>, (node: Element | null) => void];
```

The parameters mirror `useKeyboardSensor` but leverage the motion-specific settings (speed curves,
acceleration, etc.).

## Notes

- Accepts `MaybeAccessor` inputs for reactive settings.
- Automatically destroys the sensor when the component unmounts.
- Recomputes settings in place without recreating the sensor.
