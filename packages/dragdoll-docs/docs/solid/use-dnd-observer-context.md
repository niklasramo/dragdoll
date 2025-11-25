# useDndObserverContext

Reads the `DndObserverContext` and returns the accessor stored in the provider. Handy when you need
direct access to the observer (e.g. to add collision listeners manually).

## Usage

```tsx
/** @jsxImportSource solid-js */
import { createEffect } from 'solid-js';
import { render } from 'solid-js/web';
import {
  DndObserverContext,
  useDndObserver,
  useDndObserverContext,
  usePointerSensor,
  useDraggable,
} from 'dragdoll-solid';

function DebugPanel() {
  const observer = useDndObserverContext();

  createEffect(() => {
    const instance = observer();
    if (!instance) return;
    const id = instance.on('start', ({ draggable }) => {
      console.log('Debug panel saw drag start', draggable.id);
    });
    return () => instance.off('start', id);
  });

  return null;
}

function App() {
  const observer = useDndObserver();
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => [],
  }));

  return (
    <DndObserverContext.Provider value={observer}>
      <DebugPanel />
      {/* draggable markup */}
    </DndObserverContext.Provider>
  );
}

render(() => <App />, document.getElementById('root')!);
```

## Notes

- Returns whatever the provider stores—typically the accessor from `useDndObserver`.
- If you have multiple observers, create nested providers to scope hooks to the desired instance.
