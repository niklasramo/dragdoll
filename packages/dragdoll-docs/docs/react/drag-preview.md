# DragPreview

A React component that portals content into drag preview proxy elements. When a [`Draggable`](/draggable) has `dragPreview: true` enabled, this component renders your content directly into the proxy element that moves during the drag, completely bypassing React's virtual DOM reparenting limits.

## Usage

### Render function (recommended)

Use a render function to access drag metadata and render dynamic content per proxy element. This is especially useful for multi-element drags.

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { usePointerSensor, useDraggable, DragPreview } from 'dragdoll-react';

function DraggableBox() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      dragPreview: true,
    }),
    [],
  );
  const draggable = useDraggable([pointerSensor], draggableSettings);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorRef(node);
    },
    [setPointerSensorRef],
  );

  return (
    <>
      <div ref={setRefs} style={{ width: 100, height: 100, background: 'red' }}>
        Drag me
      </div>
      <DragPreview draggable={draggable}>
        {({ sourceElement, exiting }) => (
          <div style={{ padding: 10, background: exiting ? 'gray' : 'blue', color: 'white' }}>
            Dragging: {sourceElement.textContent}
          </div>
        )}
      </DragPreview>
    </>
  );
}
```

### Static children

If you don't need access to drag metadata, you can pass static children. The same content is rendered into every proxy element.

```tsx
<DragPreview draggable={draggable}>
  <div style={{ padding: 10, background: 'blue', color: 'white' }}>
    I am rendering inside the proxy!
  </div>
</DragPreview>
```

## Props

### draggable

```ts
type draggable = AnyDraggable | null;
```

The [`Draggable`](/draggable) instance to track. Pass the instance returned by [`useDraggable`](/react/use-draggable). The component renders nothing when `null` or when the draggable has no active drag preview.

- Required.

### children

```ts
type children = ((props: DragPreviewRenderProps) => React.ReactNode) | React.ReactNode;
```

The content to render inside each proxy element. If a function is provided, it is called once per proxy element with a [`DragPreviewRenderProps`](#dragpreviewrenderprops) object, allowing you to render dynamic content based on drag state.

- Optional.

## Types

### DragPreviewProps

```ts
// Import
import type { DragPreviewProps } from 'dragdoll-react';

// Interface
interface DragPreviewProps {
  draggable: AnyDraggable | null;
  children?: ((props: DragPreviewRenderProps) => React.ReactNode) | React.ReactNode;
}
```

### DragPreviewRenderProps

```ts
// Import
import type { DragPreviewRenderProps } from 'dragdoll-react';

// Interface
interface DragPreviewRenderProps {
  draggable: AnyDraggable;
  item: DraggableDragItem | null;
  index: number;
  sourceElement: HTMLElement | SVGSVGElement;
  exiting: boolean;
  done: () => void;
}
```

#### draggable

The active [`Draggable`](/draggable) instance.

#### item

The [`DraggableDragItem`](/draggable-drag-item) for this proxy element. Contains position data, client rect, and per-item drag state. `null` if the drag has ended (during exit animation).

#### index

The index of this proxy element in the items array. Useful for multi-element drags to differentiate between items.

#### sourceElement

The original DOM element that this proxy represents. This is the element returned by the [`elements`](/react/use-draggable#elements) setting that stays in place while its proxy moves.

#### exiting

`true` when the drag has ended but the proxy is still alive for exit animation (requires [`dragPreviewExitTimeout`](/react/use-draggable#dragpreviewexittimeout)). Use this to trigger CSS transitions or animations.

#### done

Call this when your exit animation finishes to remove the proxy element. Only meaningful when `exiting` is `true`. If not called within the configured timeout, cleanup happens automatically as a safety fallback.
