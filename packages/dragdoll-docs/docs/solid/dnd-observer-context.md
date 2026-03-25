# DndObserverContext

```ts
type DndObserverContext = Context<Accessor<DndObserver<any> | null>>;
```

A Solid context for sharing a [`DndObserver`](/dnd-observer) accessor with descendant components.

[`useDraggable`](/solid/use-draggable) and [`useDroppable`](/solid/use-droppable) hooks will automatically use the observer from the closest `DndObserverContext` if no explicit observer is provided.

You can access the observer from this context in any descendant component using the [`useDndObserverContext`](/solid/use-dnd-observer-context) hook.

The context value defaults to an accessor returning `null` if no observer is provided.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  usePointerSensor,
  useDraggable,
  useDraggableDrag,
  useDroppable,
  useDndObserver,
  DndObserverContext,
} from 'dragdoll-solid';

function App() {
  // Create a new DndObserver instance, and add some event listeners if you
  // wish.
  const observer = useDndObserver({
    onEnter: ({ draggable, droppable }) => {
      console.log('Draggable entered droppable', { draggable, droppable });
    },
    onLeave: ({ draggable, droppable }) => {
      console.log('Draggable left droppable', { draggable, droppable });
    },
  });

  return (
    <DndObserverContext.Provider value={observer}>
      <div style={{ position: 'relative' }}>
        <DraggableBox />
        <DropZone />
      </div>
    </DndObserverContext.Provider>
  );
}

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
      }}
      style={{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
        position: 'relative',
        width: '100px',
        height: '100px',
        'background-color': 'red',
        color: 'white',
      }}
    >
      Drag me
    </div>
  );
}

function DropZone() {
  const [, setDroppableElementRef] = useDroppable();

  return (
    <div
      ref={setDroppableElementRef}
      style={{
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
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

render(() => <App />, document.getElementById('root')!);
```

## Notes

- The provider expects an accessor (the value returned by `useDndObserver`), not the observer instance itself.
- You can supply an accessor returning `null` or skip the provider entirely if you plan to pass observers directly via the hooks' optional `dndObserver` overrides.
