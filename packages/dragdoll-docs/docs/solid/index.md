# DragDoll Solid

DragDoll now ships with a lightweight SolidJS wrapper that mirrors the API offered by `dragdoll-react`.
It exposes hook-style helpers (`usePointerSensor`, `useDraggable`, `useDroppable`, …) that wrap the
core classes and keep them in sync with Solid's fine-grained reactivity.

- Package: `dragdoll-solid`
- Peer dependencies: `dragdoll`, `solid-js`
- Runtime: zero additional abstractions—each hook simply manages the imperative DragDoll instances
  and hands the objects back as Solid accessors.

```bash
npm install dragdoll dragdoll-solid solid-js
```

```tsx
/** @jsxImportSource solid-js */
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import {
  usePointerSensor,
  useKeyboardMotionSensor,
  useDraggable,
  useDraggableDrag,
} from 'dragdoll-solid';

function Card() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();
  const draggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
  }));
  const drag = useDraggableDrag(draggable);

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
      Drag me
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

## Next steps

- [Getting Started](/solid/getting-started) – Installation details and project wiring.
- [Examples](/solid/examples) – Live demos built with Solid + DragDoll.
