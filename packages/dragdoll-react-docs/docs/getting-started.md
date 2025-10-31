# Getting Started

## Installation

```bash
npm install dragdoll dragdoll-react react react-dom
```

**Requirements**: React 19.2+ and React DOM 19.2+

## Basic Usage

### With Components

The simplest way to use DragDoll React is with the `<Draggable>` component:

```tsx
import { DndContextProvider, Draggable } from 'dragdoll-react';

function App() {
  return (
    <DndContextProvider>
      <Draggable pointerSensor keyboardSensor>
        <button>Drag me!</button>
      </Draggable>
    </DndContextProvider>
  );
}
```

### With Hooks

For more control, use hooks directly:

```tsx
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { useRef } from 'react';

function DraggableCard() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { ref } = useDraggable({
    element: elementRef.current,
    pointerSensor: true,
  });

  return (
    <div
      ref={(node) => {
        elementRef.current = node;
        ref(node);
      }}
    >
      Drag me!
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <DraggableCard />
    </DndContextProvider>
  );
}
```

## Next Steps

- Learn about [Draggable](/draggable) components and hooks.
- Explore [DndContext](/dnd-context) for drag and drop functionality.
- Check out [Droppable](/droppable) for drop targets.
- See [Examples](/examples) for complete implementations.
