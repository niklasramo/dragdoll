# DndObserverContext

Solid context that shares a `DndObserver` accessor with descendant components. `useDraggable`,
`useDroppable`, and `useDndObserverContext` all consume this context by default.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableDrag,
  usePointerSensor,
} from 'dragdoll-solid';

function DraggableCard() {
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
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      tabIndex={0}
    >
      Drag me
    </div>
  );
}

function App() {
  const observer = useDndObserver();

  return (
    <DndObserverContext.Provider value={observer}>
      <DraggableCard />
    </DndObserverContext.Provider>
  );
}

render(() => <App />, document.getElementById('root')!);
```

## Notes

- The provider expects an accessor (the value returned by `useDndObserver`), not the observer
  instance itself.
- You can supply `null` or skip the provider entirely if you plan to pass observers directly via
  the hooks' optional `dndObserver` overrides.
