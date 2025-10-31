# Droppable

Create drop targets with the `<Droppable>` component or `useDroppable` hook.

## Component

```tsx
import { Droppable } from 'dragdoll-react';

<Droppable id="drop-zone" accept={['groupA']}>
  <div>Drop here</div>
</Droppable>;
```

### Props

- `id?: DroppableId` - Unique identifier for the droppable.
- `accept?: DroppableOptions['accept']` - Groups or function to accept.
- `data?: DroppableOptions['data']` - Custom data attached to the droppable.
- `children`: React element or render function `(props: { ref }) => ReactNode`.

### Example

```tsx
import { DndContextProvider, Draggable, Droppable } from 'dragdoll-react';

function App() {
  return (
    <DndContextProvider
      onCollide={({ contacts }) => {
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-over');
        }
      }}
    >
      <Draggable id="item-1" pointerSensor>
        <button>Drag me</button>
      </Draggable>

      <Droppable id="drop-1" accept={['groupA']}>
        {({ ref }) => (
          <div ref={ref} className="drop-zone">
            Drop here
          </div>
        )}
      </Droppable>
    </DndContextProvider>
  );
}
```

## Hook

```tsx
import { useDroppable } from 'dragdoll-react';

const { droppable, ref } = useDroppable({
  element: elementRef.current,
  id: 'drop-zone',
  accept: ['groupA'],
});
```

### Parameters

- `element`: `HTMLElement | SVGSVGElement | null` - The element to use as drop target.
- `id`, `accept`, `data`: Same as component props.

### Returns

- `droppable`: The underlying `Droppable` instance or `null`.
- `ref`: Ref callback to attach to your element.

### Example

```tsx
import { DndContextProvider, useDroppable } from 'dragdoll-react';
import { useCallback, useRef } from 'react';

function DropZone() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { droppable, ref } = useDroppable({
    element: elementRef.current,
    id: 'drop-zone',
    accept: ['groupA'],
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return <div ref={handleRef}>Drop here</div>;
}
```
