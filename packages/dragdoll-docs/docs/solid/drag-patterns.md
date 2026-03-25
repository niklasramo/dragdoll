# Drag Patterns

The [`elements`](/solid/use-draggable#elements) setting determines **what moves** during the drag. In Solid there are two patterns. Both support returning multiple elements (to move several items in lockstep).

> [!TIP]
> For the full set of vanilla patterns (including Placeholder Preview and `container`), see [Core Drag Patterns](/drag-patterns). This page covers only the patterns available through the Solid integration.

## Why Solid Needs Different Patterns

In vanilla JS you can freely `cloneNode`, reparent DOM nodes, and manage proxy elements yourself. While Solid is closer to the DOM than React, it still tracks DOM nodes through its reactive system — reparenting Solid-managed nodes during a drag can break reactive bindings, event delegation, and cleanup logic. This is why the core [`container`](/draggable#container) option is **not available** in [`useDraggable`](/solid/use-draggable) — it reparents elements during drag, which would move Solid-controlled DOM nodes out from under Solid's ownership.

The Solid integration solves this with the [`dragPreview`](/solid/use-draggable#dragpreview) setting and the [`<DragPreview>`](/solid/drag-preview) component. Together they create **non-Solid proxy elements** outside the reactive system, reparent them safely to `document.body` (or a custom [`dragPreviewContainer`](/solid/use-draggable#dragpreviewcontainer)), and let you render custom Solid content into the proxies via `<Portal>`. Your original Solid-managed elements stay untouched in the DOM.

## Pattern 1: Direct Drag

Return the element itself. It moves in its current parent via CSS `transform`.

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useDraggable } from 'dragdoll-solid';

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
      }}
    >
      Drag me
    </div>
  );
}
```

**How it works:** The [`Draggable`](/draggable) tracks sensor movement and applies a CSS `transform` to the element on each frame. No reparenting, no cloning. The element stays in its original DOM position.

**When to use:** Most drag scenarios. The simplest pattern with zero overhead.

**Limitation:** Because the element stays in its original parent, it cannot escape `overflow: hidden`, scroll containers, or stacking context boundaries. If you need that, use Pattern 2 instead.

**Examples:** [Basic](/solid/examples#solid-draggable-basic).

## Pattern 2: Drag Preview

Enable [`dragPreview`](/solid/use-draggable#dragpreview) and use the [`<DragPreview>`](/solid/drag-preview) component. A non-Solid proxy element is created automatically for each element returned by `elements`, reparented to `document.body`, and moved during the drag. The original elements stay in place.

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useDraggable, DragPreview } from 'dragdoll-solid';
import { getLocalOffset } from 'dragdoll';

function DraggableBox() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => (element ? [element] : []),
    dragPreview: true,
    onEnd: (drag: { items: { clientRect: { x: number; y: number } }[] }) => {
      const item = drag.items[0];
      if (!element || !item) return;

      const offset = getLocalOffset(element, item.clientRect.x, item.clientRect.y);
      const parts = (getComputedStyle(element).translate || '').split(' ');
      const x = (parseFloat(parts[0]) || 0) + offset.x;
      const y = (parseFloat(parts[1]) || 0) + offset.y;
      element.style.translate = `${x}px ${y}px`;
    },
  }));

  return (
    <>
      <div
        ref={(node) => {
          element = node;
          setPointerSensorRef(node);
        }}
      >
        Drag me
      </div>
      <DragPreview draggable={draggable}>
        {({ sourceElement, exiting }) => (
          <div class={exiting ? 'fade-out' : ''}>{sourceElement.textContent}</div>
        )}
      </DragPreview>
    </>
  );
}
```

**How it works:** When `dragPreview: true` is set, the [`Draggable`](/draggable) creates a plain DOM proxy element for each element returned by `elements`, positions each proxy to overlap its source, reparents it to `document.body`, and moves it during the drag. The [`<DragPreview>`](/solid/drag-preview) component uses Solid's `<Portal>` to render your Solid content into each proxy — giving you full Solid reactivity without breaking ownership. Since the proxies live in `document.body`, they automatically escape `overflow: hidden`, scroll containers, and stacking context boundaries.

**When to use:** When you want the original to remain visible during drag (e.g. dimmed). When you need a different visual during drag (e.g. a simplified or styled preview). When the element is inside a scroll container or a parent with `overflow: hidden` that would clip the dragged element.

**End alignment:** Use [`getLocalOffset`](/get-local-offset) in `onEnd` to transfer the proxy's final viewport position back to the original element, correctly handling ancestor transforms.

**Custom container:** By default proxies are reparented to `document.body`. Use [`dragPreviewContainer`](/solid/use-draggable#dragpreviewcontainer) to reparent them into a different element instead (e.g. a specific stacking context, shadow DOM, or iframe).

**Exit animations:** Set [`dragPreviewExitTimeout`](/solid/use-draggable#dragpreviewexittimeout) to keep the proxy alive after drag end. The render function receives `exiting: true` and a `done` callback so you can run CSS transitions before removal.

## Multiple Elements

Both patterns work with multiple elements. Return multiple elements from the `elements` setting and they all move together following the same sensor input.

```tsx
/** @jsxImportSource solid-js */
import { usePointerSensor, useDraggable } from 'dragdoll-solid';

function MultiDrag() {
  const elements: HTMLDivElement[] = [];
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], () => ({
    elements: () => elements.filter((el): el is HTMLDivElement => !!el),
  }));

  return (
    <div ref={setPointerSensorRef}>
      <div ref={(el) => elements.push(el)}>Item A</div>
      <div ref={(el) => elements.push(el)}>Item B</div>
    </div>
  );
}
```

When using Pattern 2 with multiple elements, the [`<DragPreview>`](/solid/drag-preview) render function is called once per proxy with the `index` prop so you can differentiate between items.

```tsx
<DragPreview draggable={draggable}>{({ index }) => <div>ITEM {index + 1}</div>}</DragPreview>
```

## Choosing a Pattern

| Pattern         | Original moves | Original stays visible | Escapes overflow | Needs end alignment |
| --------------- | :------------: | :--------------------: | :--------------: | :-----------------: |
| 1. Direct Drag  |      Yes       |           —            |        No        |         No          |
| 2. Drag Preview |       No       |          Yes           |       Yes        |         Yes         |

Both patterns can return multiple elements.

**Start with Pattern 1 (Direct Drag).** It's the simplest and has zero overhead. Only reach for Pattern 2 when you need a visible placeholder, a custom preview, or need to escape overflow boundaries.

## Solid vs React Patterns

If you are coming from the React integration, the patterns are conceptually identical but the code differs in a few key ways:

- **No memoization needed.** Solid components run once, so you do not need `useMemo` or `useCallback`. Settings objects and callbacks are plain values.
- **Ref pattern.** Instead of `useRef` + a `useCallback` ref combiner, use `let element: HTMLDivElement | null = null` and set it in a `ref` callback: `ref={(node) => { element = node; setPointerSensorRef(node); }}`.
- **Accessor return.** `useDraggable` returns an `Accessor<Draggable | null>`, so you access the instance with `draggable()` instead of using it directly.
- **Portal.** The `<DragPreview>` component uses Solid's `<Portal>` instead of React's `createPortal`.
