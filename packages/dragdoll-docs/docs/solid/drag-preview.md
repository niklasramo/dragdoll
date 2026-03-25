# DragPreview

A Solid component that portals content into drag preview proxy elements. When a [`Draggable`](/draggable) has `dragPreview: true` enabled, this component renders your content directly into the proxy element that moves during the drag, using Solid's `<Portal>` to project into non-Solid DOM nodes without breaking reactivity.

## Usage

### Render function (recommended)

Use a render function to access drag metadata and render dynamic content per proxy element. This is especially useful for multi-element drags.

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useDraggable, DragPreview } from 'dragdoll-solid';

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
    dragPreview: true,
  }));

  return (
    <>
      <div
        ref={(node) => {
          element = node;
          setPointerSensorRef(node);
        }}
        style={{ width: '100px', height: '100px', background: 'red' }}
      >
        Drag me
      </div>
      <DragPreview draggable={draggable}>
        {({ sourceElement, exiting }) => (
          <div style={{ padding: '10px', background: exiting ? 'gray' : 'blue', color: 'white' }}>
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
  <div style={{ padding: '10px', background: 'blue', color: 'white' }}>
    I am rendering inside the proxy!
  </div>
</DragPreview>
```

## Props

### draggable

```ts
type draggable = MaybeAccessor<AnyDraggable | null>;
```

The [`Draggable`](/draggable) instance to track. Pass the accessor returned by [`useDraggable`](/solid/use-draggable). Accepts either an accessor or a raw value. The component renders nothing when `null` or when the draggable has no active drag preview.

- Required.

### children

```ts
type children = ((props: DragPreviewRenderProps) => JSX.Element) | JSX.Element;
```

The content to render inside each proxy element. If a function is provided, it is called once per proxy element with a [`DragPreviewRenderProps`](#dragpreviewrenderprops) object, allowing you to render dynamic content based on drag state.

- Optional.

## Types

### DragPreviewProps

```ts
// Import
import type { DragPreviewProps } from 'dragdoll-solid';

// Interface
interface DragPreviewProps {
  draggable: MaybeAccessor<AnyDraggable | null>;
  children?: ((props: DragPreviewRenderProps) => JSX.Element) | JSX.Element;
}
```

### DragPreviewRenderProps

```ts
// Import
import type { DragPreviewRenderProps } from 'dragdoll-solid';

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

The original DOM element that this proxy represents. This is the element returned by the [`elements`](/solid/use-draggable#elements) setting that stays in place while its proxy moves.

#### exiting

`true` when the drag has ended but the proxy is still alive for exit animation (requires [`dragPreviewExitTimeout`](/solid/use-draggable#dragpreviewexittimeout)). Use this to trigger CSS transitions or animations.

#### done

Call this when your exit animation finishes to remove the proxy element. Only meaningful when `exiting` is `true`. If not called within the configured timeout, cleanup happens automatically as a safety fallback.

## How It Works

Internally, `<DragPreview>` uses [`useDragPreview`](/solid/use-drag-preview) to subscribe to the drag preview store. When proxies are active, the component uses Solid's `<Show>` and `<For>` to iterate over the proxy elements, and `<Portal>` to mount children into each proxy DOM node. This keeps your Solid reactivity intact while rendering into non-Solid-managed proxy elements.
