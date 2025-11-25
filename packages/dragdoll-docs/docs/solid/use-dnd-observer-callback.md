# useDndObserverCallback

Registers a callback for a specific [`DndObserverEventType`](/dnd-observer#events) without manually
calling `observer.on`. Works with observers obtained from context or ones you pass explicitly.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  DndObserverContext,
  useDndObserver,
  useDndObserverCallback,
  useDraggable,
  usePointerSensor,
} from 'dragdoll-solid';
import { DndObserverEventType } from 'dragdoll/dnd-observer';

function Inspector() {
  const observer = useDndObserverContext();
  useDndObserverCallback(
    DndObserverEventType.Collide,
    ({ draggable, contacts }) => {
      console.log(draggable.id, 'best match', contacts.values().next().value?.id);
    },
    observer,
  );
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
      <Inspector />
      {/* rest of your UI */}
    </DndObserverContext.Provider>
  );
}

render(() => <App />, document.getElementById('root')!);
```

## Signature

```ts
function useDndObserverCallback<
  K extends keyof DndObserverEventCallbacks = keyof DndObserverEventCallbacks,
>(
  eventType: K,
  callback: MaybeAccessor<DndObserverEventCallbacks[K] | undefined>,
  observer: MaybeAccessor<DndObserver | null>,
): void;
```

## Notes

- Accepts either an accessor pointing to the observer (e.g. from context) or an inline instance.
- Returns nothing; it simply manages subscription lifecycles for you.
- If the observer accessor resolves to `null`, the callback is skipped until one exists.
