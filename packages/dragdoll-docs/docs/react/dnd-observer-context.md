# DndObserverContext

A React context for sharing a [DndObserver](/dnd-observer) instance across components.

## Usage

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

## Description

`DndObserverContext` is a React context that allows you to share a [DndObserver](/dnd-observer) instance across multiple components without prop drilling. Components using [useDraggable](/react/use-draggable) and [useDroppable](/react/use-droppable) will automatically use the observer from this context if no explicit observer is provided.

## Examples

### Basic Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import {
  DndObserverContext,
  usePointerSensor,
  useDraggable,
  useDroppable,
  useDndObserver,
} from 'dragdoll-react';

function DraggableItem() {
  // Automatically uses observer from context
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [sensor, setSensorRef] = usePointerSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const draggable = useDraggable([sensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setSensorRef(node);
    },
    [setSensorRef],
  );

  return (
    <div ref={setRefs} className="item">
      Drag me
    </div>
  );
}

function DropZone() {
  // Automatically uses observer from context
  const [droppable, setRef] = useDroppable({
    data: { name: 'Zone 1' },
  });

  return (
    <div ref={setRef} style={{ border: '2px dashed gray' }}>
      Drop here
    </div>
  );
}

function App() {
  const dndObserver = useDndObserver({
    onEnter: ({ draggable, droppable }) => {
      console.log('Entered', droppable.data.name);
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Multiple Contexts

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const observer1 = useDndObserver();
  const observer2 = useDndObserver();

  return (
    <>
      <DndObserverContext.Provider value={observer1}>
        <div className="group-1">
          <DraggableItem />
          <DropZone />
        </div>
      </DndObserverContext.Provider>

      <DndObserverContext.Provider value={observer2}>
        <div className="group-2">
          <DraggableItem />
          <DropZone />
        </div>
      </DndObserverContext.Provider>
    </>
  );
}
```

### Nested Contexts

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const globalObserver = useDndObserver();
  const localObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={globalObserver}>
      <DraggableItem /> {/* Uses globalObserver */}
      <DndObserverContext.Provider value={localObserver}>
        <DraggableItem /> {/* Uses localObserver */}
      </DndObserverContext.Provider>
    </DndObserverContext.Provider>
  );
}
```

### Opt Out of Context

```tsx
import { DndObserverContext, useDndObserver, usePointerSensor, useDraggable } from 'dragdoll-react';

function DraggableItem() {
  const [sensor, sensorRef] = usePointerSensor();
  // Explicitly opt out of context observer
  const draggable = useDraggable([sensor], {
    elements: () => [document.querySelector('.item')],
    dndObserver: null,
  });

  return (
    <div ref={sensorRef}>
      <div className="item">Not using context observer</div>
    </div>
  );
}

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem /> {/* Opts out of observer */}
    </DndObserverContext.Provider>
  );
}
```

### With Custom Observer

```tsx
import { DndObserverContext, useDndObserver, usePointerSensor, useDraggable } from 'dragdoll-react';

function DraggableItem() {
  const customObserver = useDndObserver();
  const [sensor, sensorRef] = usePointerSensor();
  // Use custom observer instead of context observer
  const draggable = useDraggable([sensor], {
    elements: () => [document.querySelector('.item')],
    dndObserver: customObserver,
  });

  return (
    <div ref={sensorRef}>
      <div className="item">Using custom observer</div>
    </div>
  );
}

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem /> {/* Uses custom observer instead */}
    </DndObserverContext.Provider>
  );
}
```

## Notes

- The context value defaults to `null`
- Components will use the context observer if no explicit observer is provided
- You can opt out of the context observer by passing `dndObserver: null` to hooks
- You can override the context observer by passing a different observer to hooks
- The observer is automatically cleaned up when the component providing it unmounts

## Related

- [useDndObserver](/react/use-dnd-observer) - Hook to create a DndObserver instance
- [useDndObserverContext](/react/use-dnd-observer-context) - Hook to access the context value
- [useDraggable](/react/use-draggable) - Hook that can use the context observer
- [useDroppable](/react/use-droppable) - Hook that can use the context observer

## Types

For detailed type information, see the [DndObserver types](/dnd-observer.html#types) in the vanilla docs.
