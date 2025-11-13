# DndObserverContext

```ts
type DndObserverContext = Context<DndObserver<any> | null>;
```

A React context for sharing a [`DndObserver`](/dnd-observer) instance to descendant components.

[`useDraggable`](/react/use-draggable) and [`useDroppable`](/react/use-droppable) hooks will automatically use the observer from the closest `DndObserverContext` if no explicit observer is provided.

You can access the observer from this context in any descendant component using the [`useDndObserverContext`](/react/use-dnd-observer-context) hook.

The context value defaults to `null` if no observer is provided.

## Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import {
  usePointerSensor,
  useKeyboardSensor,
  useDraggable,
  useDroppable,
  useDndObserver,
  DndObserverContext,
} from 'dragdoll-react';

function App() {
  // Create a new DndObserver instance, and add some event listeners if you
  // wish.
  const dndObserver = useDndObserver({
    onEnter: ({ draggable, droppable }) => {
      console.log('Draggable entered droppable', { draggable, droppable });
    },
    onLeave: ({ draggable, droppable }) => {
      console.log('Draggable left droppable', { draggable, droppable });
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div style={{ position: 'relative' }}>
        <DraggableBox />
        <DropZone />
      </div>
    </DndObserverContext.Provider>
  );
}

function DraggableBox() {
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        width: '100px',
        height: '100px',
        backgroundColor: 'red',
        color: 'white',
      }}
    >
      Drag me
    </div>
  );
}

function DropZone() {
  const [droppable, setDroppableElementRef] = useDroppable();

  return (
    <div
      ref={setDroppableElementRef}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '200px',
        height: '200px',
        color: 'black',
        border: '2px dashed black',
      }}
    >
      Drop here
    </div>
  );
}
```
