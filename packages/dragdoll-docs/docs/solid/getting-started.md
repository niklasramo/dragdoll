# Getting Started

`dragdoll-solid` is distributed as ES modules via subpath exports. Each module has its own entry point so you can import only what you need. That being said, _everything_ is also exported via the root `dragdoll-solid` module to provide a bit better developer experience.

## Installation

```bash
npm install dragdoll-solid
```

With peer dependencies:

```bash
npm install dragdoll-solid dragdoll eventti tikki mezr solid-js
```

## Peer Dependencies

- [`dragdoll`](https://github.com/niklasramo/dragdoll) (^1.0.0)
  - Core library for drag and drop functionality. Brings its own peer dependencies ([`eventti`](https://github.com/niklasramo/eventti), [`tikki`](https://github.com/niklasramo/tikki), [`mezr`](https://github.com/niklasramo/mezr)) that you will also need to install.
- [`solid-js`](https://github.com/solidjs/solid) (^1.9.0)

## TypeScript / JSX Configuration

If your project relies on a global `tsconfig`, make sure the Solid runtime is enabled:

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxImportSource": "solid-js",
  },
}
```

Alternatively, add `/** @jsxImportSource solid-js */` at the top of individual files.

## Basic Usage

Here's a simple example of making a draggable element:

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  usePointerSensor,
  useKeyboardMotionSensor,
  useDraggable,
  useDraggableDrag,
} from 'dragdoll-solid';

function DraggableRedBox() {
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
      class={`draggable ${drag() ? 'dragging' : ''}`}
      style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        'background-color': 'red',
      }}
      tabIndex={0}
    >
      Drag me
    </div>
  );
}

render(() => <DraggableRedBox />, document.getElementById('root')!);
```

## Solid-Specific Notes

- **No memoization needed.** Solid components run once, so settings objects and callbacks are plain values — no `useMemo` or `useCallback` required.
- **Ref pattern.** Use `let element: HTMLDivElement | null = null` and set it in a `ref` callback: `ref={(node) => { element = node; setPointerSensorRef(node); }}`.
- **Accessor returns.** Hooks return `Accessor<T | null>` — access the value with `sensor()`, `draggable()`, etc.
- **SSR-safe.** All hooks return safe fallback values on the server (`() => null` or `[() => null, () => {}]`).
