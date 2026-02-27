# Drag Patterns

The [`elements`](/react/use-draggable#elements) setting determines **what moves** during the drag. In React there are two patterns. Both support returning multiple elements (to move several items in lockstep).

> [!TIP]
> For the full set of vanilla patterns (including Placeholder Preview and `container`), see [Core Drag Patterns](/drag-patterns). This page covers only the patterns available through the React integration.

## Why React Needs Different Patterns

In vanilla JS you can freely `cloneNode`, reparent DOM nodes, and manage proxy elements yourself. React owns the DOM — cloning or moving React-managed nodes breaks reconciliation, loses state, and can cause subtle bugs. This is why the core [`container`](/draggable#container) option is **not available** in [`useDraggable`](/react/use-draggable) — it reparents elements during drag, which would move React-controlled DOM nodes out from under React's virtual DOM.

The React integration solves this with the [`dragPreview`](/react/use-draggable#dragpreview) setting and the [`<DragPreview>`](/react/drag-preview) component. Together they create **non-React proxy elements** outside the virtual DOM, reparent them safely to `document.body` (or a custom [`dragPreviewContainer`](/react/use-draggable#dragpreviewcontainer)), and let you render custom React content into the proxies via `createPortal`. Your original React-managed elements stay untouched in the DOM.

## Pattern 1: Direct Drag

Return the element itself. It moves in its current parent via CSS `transform`.

```tsx
const elementRef = useRef<HTMLDivElement>(null);
const [pointerSensor, setPointerSensorRef] = usePointerSensor();

const draggableSettings = useMemo(
  () => ({
    elements: () => (elementRef.current ? [elementRef.current] : []),
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

return <div ref={setRefs}>Drag me</div>;
```

**How it works:** The [`Draggable`](/draggable) tracks sensor movement and applies a CSS `transform` to the element on each frame. No reparenting, no cloning. The element stays in its original DOM position.

**When to use:** Most drag scenarios. The simplest pattern with zero overhead.

**Limitation:** Because the element stays in its original parent, it cannot escape `overflow: hidden`, scroll containers, or stacking context boundaries. If you need that, use Pattern 2 instead.

**Examples:** [Basic](/react/examples#draggable-basic), [Auto Scroll](/react/examples#draggable-auto-scroll-transforms), [Locked Axis](/react/examples#draggable-locked-axis), [Snap To Grid](/react/examples#draggable-snap-to-grid), [Containment](/react/examples#draggable-containment), [Combined Modifiers](/react/examples#draggable-combined-modifiers), [Center To Pointer](/react/examples#draggable-center-to-pointer), [Drag Handle](/react/examples#draggable-drag-handle).

## Pattern 2: Drag Preview

Enable [`dragPreview`](/react/use-draggable#dragpreview) and use the [`<DragPreview>`](/react/drag-preview) component. A non-React proxy element is created automatically for each element returned by `elements`, reparented to `document.body`, and moved during the drag. The original elements stay in place.

```tsx
const elementRef = useRef<HTMLDivElement>(null);
const [pointerSensor, setPointerSensorRef] = usePointerSensor();

const draggableSettings = useMemo(
  () => ({
    elements: () => (elementRef.current ? [elementRef.current] : []),
    dragPreview: true,
    onEnd: (drag: { items: { clientRect: { x: number; y: number } }[] }) => {
      const el = elementRef.current;
      const item = drag.items[0];
      if (!el || !item) return;

      const offset = getLocalOffset(el, item.clientRect.x, item.clientRect.y);
      const parts = (getComputedStyle(el).translate || '').split(' ');
      const x = (parseFloat(parts[0]) || 0) + offset.x;
      const y = (parseFloat(parts[1]) || 0) + offset.y;
      el.style.translate = `${x}px ${y}px`;
    },
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
    <div ref={setRefs}>Drag me</div>
    <DragPreview draggable={draggable}>
      {({ sourceElement, exiting }) => (
        <div className={exiting ? 'fade-out' : ''}>{sourceElement.textContent}</div>
      )}
    </DragPreview>
  </>
);
```

**How it works:** When `dragPreview: true` is set, the [`Draggable`](/draggable) creates a plain DOM proxy element for each element returned by `elements`, positions each proxy to overlap its source, reparents it to `document.body`, and moves it during the drag. The [`<DragPreview>`](/react/drag-preview) component uses `createPortal` to render your React content into each proxy — giving you full React rendering power without breaking reconciliation. Since the proxies live in `document.body`, they automatically escape `overflow: hidden`, scroll containers, and stacking context boundaries.

**When to use:** When you want the original to remain visible during drag (e.g. dimmed). When you need a different visual during drag (e.g. a simplified or styled preview). When the element is inside a scroll container or a parent with `overflow: hidden` that would clip the dragged element.

**End alignment:** Use [`getLocalOffset`](/get-local-offset) in `onEnd` to transfer the proxy's final viewport position back to the original element, correctly handling ancestor transforms.

**Custom container:** By default proxies are reparented to `document.body`. Use [`dragPreviewContainer`](/react/use-draggable#dragpreviewcontainer) to reparent them into a different element instead (e.g. a specific stacking context, shadow DOM, or iframe).

**Exit animations:** Set [`dragPreviewExitTimeout`](/react/use-draggable#dragpreviewexittimeout) to keep the proxy alive after drag end. The render function receives `exiting: true` and a `done` callback so you can run CSS transitions before removal.

**Examples:** [Drag Preview](/react/examples#draggable-drag-preview), [Multi-Item Drag Preview](/react/examples#draggable-multi-item-drag-preview).

## Multiple Elements

Both patterns work with multiple elements. Return multiple elements from the `elements` setting and they all move together following the same sensor input.

```tsx
const draggableSettings = useMemo(
  () => ({
    elements: () => elementRefs.current.filter((el): el is HTMLDivElement => !!el),
  }),
  [],
);
```

When using Pattern 2 with multiple elements, the [`<DragPreview>`](/react/drag-preview) render function is called once per proxy with the `index` prop so you can differentiate between items.

```tsx
<DragPreview draggable={draggable}>{({ index }) => <div>ITEM {index + 1}</div>}</DragPreview>
```

**Examples:** [Multiple Elements](/react/examples#draggable-multiple-elements), [Multi-Item Drag Preview](/react/examples#draggable-multi-item-drag-preview).

## Choosing a Pattern

| Pattern         | Original moves | Original stays visible | Escapes overflow | Needs end alignment |
| --------------- | :------------: | :--------------------: | :--------------: | :-----------------: |
| 1. Direct Drag  |      Yes       |           —            |        No        |         No          |
| 2. Drag Preview |       No       |          Yes           |       Yes        |         Yes         |

Both patterns can return multiple elements.

**Start with Pattern 1 (Direct Drag).** It's the simplest and has zero overhead. Only reach for Pattern 2 when you need a visible placeholder, a custom preview, or need to escape overflow boundaries.
