# DndContext

The `DndContextProvider` component provides drag and drop context to its children, enabling collision detection between draggables and droppables.

## Component

```tsx
import { DndContextProvider } from 'dragdoll-react';

<DndContextProvider
  onStart={({ draggable }) => console.log('Started', draggable)}
  onEnd={({ draggable, canceled }) => console.log('Ended', draggable, canceled)}
>
  {/* Your draggables and droppables */}
</DndContextProvider>;
```

### Props

- `options?: DndContextOptions<T>` - Options for the underlying `DndContext`.
- `onStart?`, `onMove?`, `onEnter?`, `onLeave?`, `onCollide?`, `onEnd?` - Event callbacks.

See the vanilla [DndContext documentation](https://niklasramo.github.io/dragdoll/dragdoll/dnd-context) for event callback signatures.

### Example

```tsx
import { DndContextProvider, Draggable, Droppable } from 'dragdoll-react';

function App() {
  return (
    <DndContextProvider
      onStart={({ draggable }) => {
        const element = draggable.drag?.items[0].element;
        if (element) {
          element.classList.add('dragging');
        }
      }}
      onCollide={({ contacts }) => {
        document.querySelectorAll('.droppable').forEach((zone) => {
          zone.classList.remove('draggable-over');
        });
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-over');
        }
      }}
      onEnd={({ draggable, contacts }) => {
        const element = draggable.drag?.items[0].element;
        if (element) {
          element.classList.remove('dragging');
        }
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-dropped');
        }
      }}
    >
      <Draggable id="item-1" pointerSensor>
        <button>Drag me</button>
      </Draggable>
      <Droppable id="drop-1">
        {({ ref }) => (
          <div ref={ref} className="droppable">
            Drop here
          </div>
        )}
      </Droppable>
    </DndContextProvider>
  );
}
```

## Hooks

### useDndContext

Access the underlying `DndContext` instance:

```tsx
import { useDndContext } from 'dragdoll-react';

function MyComponent() {
  const { context } = useDndContext();
  // Use context methods directly
  return null;
}
```

### useDndContextEvents

Subscribe to context events:

```tsx
import { useDndContextEvents } from 'dragdoll-react';

function MyComponent() {
  useDndContextEvents({
    start: ({ draggable }) => console.log('Started', draggable),
    end: ({ draggable, canceled }) => console.log('Ended', draggable, canceled),
  });
  return null;
}
```
