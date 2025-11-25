# Getting Started (Solid)

The Solid wrapper re-exports ergonomic hooks that internally manage the core DragDoll classes.
Every hook returns Solid accessors so they slot naturally into signals, memos, or resources.

## 1. Install dependencies

```bash
npm install dragdoll dragdoll-solid solid-js
```

## 2. Configure TypeScript/JSX (optional)

If your project relies on a global `tsconfig`, make sure the Solid runtime is enabled:

```jsonc
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "solid-js",
  },
}
```

Alternatively, add `/** @jsxImportSource solid-js */` at the top of individual example files (the
docs examples use this approach so the `rolldown` bundler knows which runtime to target).

## 3. Wire sensors and draggables

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

function Demo() {
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

render(() => <Demo />, document.getElementById('root')!);
```

The Solid hooks behave just like their React counterparts:

- Sensors return `[Accessor<Sensor | null>, (node) => void]`.
- `useDraggable`, `useDroppable`, and `useDndObserver` return accessors so you can subscribe in
  memos or other hooks.
- `useDraggableDrag(draggable)` accepts an optional `trackMove` flag to force updates on `move`
  events (matching `dragdoll-react`).

## 4. Explore examples

The [Solid examples](/solid/examples) section contains runnable demos that mirror the React gallery,
making it easy to compare usage between frameworks.
