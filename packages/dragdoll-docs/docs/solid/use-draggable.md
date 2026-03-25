# useDraggable

Creates and maintains a [`Draggable`](/draggable) instance using Solid's lifecycle. The hook keeps the instance synchronized with sensors, options, and the current [`DndObserver`](/dnd-observer) context.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  useDraggable,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';

function Card() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
    onStart: ({ sensor }) => {
      console.log('drag started with', sensor?.constructor.name);
    },
  }));

  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLDivElement | null) => {
    element = node;
    setPointerSensorRef(node);
    setKeyboardSensorRef(node);
  };

  return (
    <div ref={setRefs} class={`card draggable ${drag() ? 'dragging' : ''}`} tabIndex={0}>
      Drag me
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

## Signature

```ts
function useDraggable<S extends Sensor = Sensor>(
  sensors: MaybeAccessor<(S | null)[]> | MaybeAccessor<S | null>[],
  settings?: MaybeAccessor<UseDraggableSettings<S> | undefined>,
): Accessor<Draggable<S> | null>;
```

## Parameters

### sensors

Array of sensor accessors (e.g. values returned from `usePointerSensor`) or raw sensor instances. Sensors can be `null` while initializing. The hook will instantiate the draggable when sensors are available. When sensors change, the draggable is recreated with the new sensor set.

### settings

Configuration settings for the [`Draggable`](/draggable) instance. Extends core [`DraggableOptions`](/draggable#draggableoptions) (excluding [`container`](/draggable#container)) with additional Solid-specific settings.

Settings can be a plain object or a `MaybeAccessor` (function returning the settings object). When provided as a function, the hook reacts to changes automatically via Solid's fine-grained tracking.

Settings are always merged with the [default settings](/draggable#settings) and provided to the [`Draggable`](/draggable) instance. This way there is no cumulative effect of settings changes over time — old settings are completely overridden by new settings.

Option objects are diffed via a deep comparison; only real changes call `draggable.updateSettings`. When `dndGroups` or `computeClientRect` change, the hook automatically triggers collision detection updates in the associated `DndObserver`.

#### dragPreview

```ts
type dragPreview = boolean | undefined;
```

If true, generates a high-performance proxy element in `document.body` that receives all drag movements instead of your original elements. Your original elements stay perfectly in place.

Use the [`<DragPreview>`](/solid/drag-preview) component to render dynamic visuals directly into the proxy element. By using proxies, you bypass Solid's DOM ownership constraints while preserving 60fps hardware-accelerated transforms.

- Optional.
- Default is `undefined`.

#### dragPreviewContainer

```ts
type dragPreviewContainer = HTMLElement | (() => HTMLElement);
```

The container element to reparent drag preview proxy elements into during drag. Only used when [`dragPreview`](#dragpreview) is `true`.

This is useful when you need the proxy to live in a specific stacking context, shadow DOM, or iframe.

- Optional.
- Default is `document.body`.

#### dragPreviewExitTimeout

```ts
type dragPreviewExitTimeout = number | undefined;
```

If set to a positive number, enables exit animation for drag previews. When the drag ends, the proxy element stays alive in an "exiting" state instead of being removed immediately. The [`<DragPreview>`](/solid/drag-preview) render function receives `exiting: true` and a `done()` callback. Call `done()` when your animation finishes to remove the proxy.

If `done()` is not called within this many milliseconds, the proxy is removed automatically as a safety fallback.

Only used when [`dragPreview`](#dragpreview) is `true`.

- Optional.
- Default is `undefined` (no exit animation, proxy removed immediately on drag end).

#### id

```ts
type id = DraggableId;
```

The `id` is a unique identifier for the draggable that is assigned as the draggable's [`id`](/draggable#id-1) property.

> [!IMPORTANT]
> The `Draggable` instance will be _automatically recreated_ when the `id` setting is explicitly provided and changed.

- Optional.
- Default is a unique symbol.

#### dndObserver

```ts
type dndObserver = DndObserver<any> | null;
```

If this setting is not provided, the draggable will be registered to the [DndObserver](/dnd-observer) instance from the [DndObserverContext](/solid/dnd-observer-context) automatically (if available).

You can explicitly provide a [DndObserver](/dnd-observer) instance to register the draggable with. This setting takes precedence over the context observer.

Set to `null` to explicitly opt out of the automatic context observer registration.

- Optional.
- Default is `undefined`.

#### container

> [!WARNING]
> The core [`container`](/draggable#container) setting is **not available** in `useDraggable`. It has been removed to prevent framework errors caused by the core library reparenting Solid-controlled DOM nodes during drag.
>
> Solid maintains internal position tracking for all DOM nodes it manages. Moving a Solid-managed node to a different parent (reparenting) desynchronizes this internal state, causing `removeChild` errors, lost reactivity, and broken component behavior.
>
> If you need to reparent elements during drag, use [`dragPreview: true`](#dragpreview) combined with [`dragPreviewContainer`](#dragpreviewcontainer) instead. The drag preview system creates non-Solid proxy elements that can be safely reparented without conflicting with Solid's internal DOM tracking.

#### startPredicate

```ts
type startPredicate = (data: {
  draggable: Draggable<S>;
  sensor: S;
  event: S['_events_type']['start'] | S['_events_type']['move'];
}) => boolean | undefined;
```

Check the [`startPredicate`](/draggable#startpredicate) core docs for more info.

- Optional.
- Default is `() => true`.

#### elements

```ts
type elements = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
}) => (HTMLElement | SVGSVGElement)[] | null;
```

A function that should return all the elements you want to move during the drag. The function is called when the drag is starting so you can dynamically change the returned array of elements.

In Solid, you can capture element references via `let` variables set through `ref` callbacks, and return them from within this function.

> [!IMPORTANT]
> The core [`Draggable`](/draggable) class will modify the elements' inline transform styles. Make sure you don't modify the elements' inline transform styles during the drag.

Check the [`elements`](/draggable#elements) core docs for more info.

- Optional.
- Default is `() => null`.

#### frozenStyles

```ts
type frozenStyles = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
  item: DraggableDragItem<S>;
  style: CSSStyleDeclaration;
}) => CSSProperties | (keyof CSSProperties)[] | null;
```

> [!IMPORTANT]
> The core [`Draggable`](/draggable) class will modify the element's inline styles based on the [`frozenStyles`](#frozenstyles) setting. Make sure you don't modify the element's affected inline styles during the drag.

Check the [`frozenStyles`](/draggable#frozenstyles) core docs for more info.

- Optional.
- Default is `() => null`.

#### applyPosition

```ts
type applyPosition = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
  item: DraggableDragItem<S>;
  phase: DraggableApplyPositionPhase;
}) => void;
```

Check the [`applyPosition`](/draggable#applyposition) core docs for more info.

- Optional.
- Default is a (very involved) function that applies the position, container offset, alignment offset and matrix transform offsets to the element's transform property, while respecting the element's original transform and transform origin.

#### computeClientRect

```ts
type computeClientRect = (data: {
  draggable: Draggable<S>;
  drag: DraggableDrag<S>;
}) => Readonly<Rect> | null;
```

Check the [`computeClientRect`](/draggable#computeclientrect) core docs for more info.

- Optional.
- Default is `({ drag }) => drag.items[0].clientRect || null`.

#### positionModifiers

```ts
type positionModifiers = DraggableModifier<S>[];
```

Check the [`positionModifiers`](/draggable#positionmodifiers) core docs for more info.

- Optional.
- Default is `[]`.

#### sensorProcessingMode

```ts
type sensorProcessingMode = DraggableSensorProcessingMode;
```

Check the [`sensorProcessingMode`](/draggable#sensorprocessingmode) core docs for more info.

- Optional.
- Default is `'sampled'`.

#### dndGroups

```ts
type dndGroups = Set<DraggableDndGroup> | undefined;
```

Check the [`dndGroups`](/draggable#dndgroups) core docs for more info.

- Optional.
- Default is `undefined` (no groups, meaning the draggable won't match any droppables that use Set-based matching).

#### onPrepareStart

```ts
type onPrepareStart = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

Check the [`onPrepareStart`](/draggable#onpreparestart) core docs for more info.

- Optional.
- Default is `undefined`.

#### onStart

```ts
type onStart = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

Check the [`onStart`](/draggable#onstart) core docs for more info.

- Optional.
- Default is `undefined`.

#### onPrepareMove

```ts
type onPrepareMove = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

Check the [`onPrepareMove`](/draggable#onpreparemove) core docs for more info.

- Optional.
- Default is `undefined`.

#### onMove

```ts
type onMove = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

Check the [`onMove`](/draggable#onmove) core docs for more info.

- Optional.
- Default is `undefined`.

#### onEnd

```ts
type onEnd = (drag: DraggableDrag<S>, draggable: Draggable<S>) => void;
```

Check the [`onEnd`](/draggable#onend) core docs for more info.

- Optional.
- Default is `undefined`.

#### onDestroy

```ts
type onDestroy = (draggable: Draggable<S>) => void;
```

Check the [`onDestroy`](/draggable#ondestroy) core docs for more info.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = Accessor<Draggable<S> | null>;
```

Returns an accessor to the [`Draggable`](/draggable) instance, or `null` if there are no sensors ready yet. Access with `draggable()`.

## Types

### UseDraggableSettings

```ts
// Import
import type { UseDraggableSettings } from 'dragdoll-solid';

// Interface
interface UseDraggableSettings<S extends Sensor = Sensor> extends Omit<
  Partial<DraggableOptions<S>>,
  'container'
> {
  dndObserver?: DndObserver<any> | null;
  dragPreview?: boolean;
  dragPreviewContainer?: HTMLElement | (() => HTMLElement);
  dragPreviewExitTimeout?: number;
}
```

## Notes

- The draggable is destroyed automatically when the component is disposed.
- Recreating sensors, changing the `id`, or swapping the observer triggers a new instance.
- Option objects are diffed via a deep comparison; only real changes call `draggable.updateSettings`.
- If no sensors are available, the draggable is removed until at least one sensor exists.
- SSR-safe: returns `() => null` on the server.
