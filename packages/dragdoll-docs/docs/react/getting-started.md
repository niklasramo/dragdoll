# Getting Started

`dragdoll-react` is distributed as ES modules via subpath exports. Each module has its own entry point so you can import only what you need. That being said, _everything_ is also exported via the root `dragdoll-react` module to provide a bit better developer experience.

## Installation

```bash
npm install dragdoll-react
```

With peer dependencies:

```bash
npm install dragdoll-react dragdoll eventti tikki mezr react react-dom
```

## Peer Dependencies

- [`dragdoll`](https://github.com/niklasramo/dragdoll) (~0.12.0)
  - Core library for drag and drop functionality.
- [`eventti`](https://github.com/niklasramo/eventti) (^4.0.3)
  - Used for emitting all the events.
- [`tikki`](https://github.com/niklasramo/tikki) (^3.0.2)
  - Used for batching DOM operations when necessary (reads and writes).
- [`mezr`](https://github.com/niklasramo/mezr) (^v1.1.0)
  - Used for calculating tricky DOM bits.
- [`react`](https://github.com/facebook/react) (>=18.0.0)
- [`react-dom`](https://github.com/facebook/react) (>=18.0.0)

## Basic Usage

Here's a simple example of making a draggable element:

```tsx
import { useRef, useCallback, useMemo } from 'react';
import { usePointerSensor, useDraggable } from 'dragdoll-react';

function DraggableRedBox() {
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

  return (
    <div
      ref={setRefs}
      style={{
        position: 'relative',
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
      }}
    />
  );
}
```
