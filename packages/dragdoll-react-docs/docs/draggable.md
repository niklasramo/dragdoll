# Draggable

Make React elements draggable with the `<Draggable>` component or `useDraggable` hook.

## Component

```tsx
import { Draggable } from 'dragdoll-react';

<Draggable pointerSensor keyboardSensor>
  <button>Drag me!</button>
</Draggable>;
```

### Props

All vanilla [`DraggableSettings`](https://niklasramo.github.io/dragdoll/dragdoll/draggable#settings) are supported, except:

- `elements`: Automatically handled when using the component.
- `onPrepareStart`, `onStart`, `onPrepareMove`, `onMove`, `onEnd`, `onDestroy`: Use the callback props directly.

#### Sensors

Configure sensors using props:

- `pointerSensor?: boolean | Partial<PointerSensorSettings>`
- `keyboardSensor?: boolean | Partial<KeyboardSensorSettings>`
- `keyboardMotionSensor?: boolean | Partial<KeyboardMotionSensorSettings>`
- `sensors?: Sensor[]` - Custom sensors array

#### Children

The component accepts:

- A single React element (recommended)
- A render function: `(props: { ref }) => ReactNode`

Example:

```tsx
<Draggable>{({ ref }) => <div ref={ref}>Drag me</div>}</Draggable>
```

### Example

```tsx
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { useRef } from 'react';

function Cards() {
  const zIndexRef = useRef(0);

  return (
    <DndContextProvider>
      {['🪩', '🎯', '🎲'].map((icon, i) => (
        <Draggable
          key={icon}
          pointerSensor
          keyboardSensor
          onStart={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.add('dragging');
              item.element.style.zIndex = `${++zIndexRef.current}`;
            });
          }}
          onEnd={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.remove('dragging');
            });
          }}
        >
          <button>{icon}</button>
        </Draggable>
      ))}
    </DndContextProvider>
  );
}
```

## Hook

```tsx
import { useDraggable } from 'dragdoll-react';

const { draggable, ref } = useDraggable({
  element: elementRef.current,
  pointerSensor: true,
  // ... other options
});
```

### Parameters

- `element`: `HTMLElement | SVGSVGElement | null` - The element to make draggable.
- All other [`DraggableSettings`](https://niklasramo.github.io/dragdoll/dragdoll/draggable#settings) options are supported.

### Returns

- `draggable`: The underlying `Draggable` instance or `null` if not yet created.
- `ref`: A ref callback function to attach to your element.

### Example

```tsx
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { useCallback, useRef } from 'react';

function DraggableCard() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { draggable, ref } = useDraggable({
    element: elementRef.current,
    pointerSensor: true,
    keyboardSensor: true,
    onStart: (drag) => {
      drag.items[0].element.classList.add('dragging');
    },
    onEnd: (drag) => {
      drag.items[0].element.classList.remove('dragging');
    },
  });

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return <div ref={handleRef}>Drag me!</div>;
}
```
