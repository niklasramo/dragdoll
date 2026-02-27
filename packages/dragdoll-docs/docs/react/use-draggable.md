# useDraggable

A React hook that creates a [`Draggable`](/draggable) instance for orchestrating sensors and moving DOM elements.

## Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { usePointerSensor, useKeyboardSensor, useDraggable } from 'dragdoll-react';

function DraggableBox() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const [pointerSensor, setPointerSensorElementRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorElementRef] = useKeyboardSensor();
  const draggableSettings = useMemo(
    () => ({
      startPredicate: (e) => {
        const areStarsAligned = Math.random() > 0.5;
        return areStarsAligned;
      },
      // NB: If you don't define the elements setting, no elements will be
      // moved during the drag. This is the single most important setting to
      // define! It's optional, because technically there are a few use cases
      // where you might not want to move any elements during the drag, but
      // trigger e.g. auto-scrolling only.
      elements: () => (elementRef.current ? [elementRef.current] : []),
    }),
    [],
  );
  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorElementRef(node);
      setKeyboardSensorElementRef(node);
    },
    [setPointerSensorElementRef, setKeyboardSensorElementRef],
  );

  return (
    <div
      ref={setRefs}
      style={{ position: 'relative', width: '100px', height: '100px', backgroundColor: 'red' }}
    >
      Drag me
    </div>
  );
}
```

## Signature

```ts
function useDraggable<S extends Sensor = Sensor>(
  sensors: (S | null)[],
  settings?: UseDraggableSettings<S>,
): Draggable<S> | null;
```

## Parameters

### sensors

Array of [sensor](/sensor) instances. Sensors can be `null` while initializing. The hook will instantiate the draggable when sensors are available. When sensors change, they are updated in-place without recreating the draggable instance.

### settings

Configuration settings for the [`Draggable`](/draggable) instance. Extends core [`DraggableOptions`](/draggable#draggableoptions) (excluding [`container`](/draggable#container)) with additional React-specific settings.

> [!WARNING]
> You **MUST** memoize the settings object (e.g. with `useMemo`) to prevent unnecessary re-evaluations and performance issues.

As per React's declarative nature, these settings are always merged with the [default settings](/draggable#settings) and then provided to the [`Draggable`](/draggable) instance. This way there will be no cumulative effect of settings changes over time meaning that the old settings will be completely overridden by the new settings.

Treat these as live settings that can be updated dynamically without recreating the draggable (except for `id`, which will cause the draggable to be recreated). When `dndGroups` or `computeClientRect` change, the hook will automatically trigger collision detection updates in the associated `DndObserver`.

#### dragPreview

```ts
type dragPreview = boolean | undefined;
```

If true, generates a high-performance proxy element in `document.body` that receives all drag movements instead of your original elements. Your original elements stay perfectly in place.

You should use the [`<DragPreview>`](/react/drag-preview) component to render dynamic visuals directly into this proxy element. By using proxies, you completely bypass React's virtual DOM reparenting limits while preserving 60-120fps hardware-accelerated transforms.

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

If set to a positive number, enables exit animation for drag previews. When the drag ends, the proxy element stays alive in an "exiting" state instead of being removed immediately. The [`<DragPreview>`](/react/drag-preview) render function receives `exiting: true` and a `done()` callback. Call `done()` when your animation finishes to remove the proxy.

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

If this setting is not provided, the draggable will be registered to the [DndObserver](/dnd-observer) instance from the [DndObserverContext](/react/dnd-observer-context) automatically (if available).

However, here you can explicitly provide a [DndObserver](/dnd-observer) instance to register the draggable with. This setting will take precedence over the context observer.

Set to `null` to explicitly opt out of the automatic context observer registration, if you e.g. don't want this draggable to be registered with any dnd observer.

- Optional.
- Default is `undefined`.

#### container

> [!WARNING]
> The core [`container`](/draggable#container) setting is **not available** in `useDraggable`. It has been removed to prevent React unmount errors caused by the core library reparenting React-controlled DOM nodes during drag.
>
> If you need to reparent elements during drag, use [`dragPreview: true`](#dragpreview) combined with [`dragPreviewContainer`](#dragpreviewcontainer) instead. The drag preview system creates non-React proxy elements that can be safely reparented without conflicting with React's virtual DOM.

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

This pattern lends itself pretty handy in React as you can use refs within the function and dynamically get the current values of all the refs of elements you want to drag around.

> [!IMPORTANT]
> The core [`Draggable`](/draggable) class will modify the elements' inline transform styles. So it's important that you don't modify the elements' inline transform styles via React during the drag.

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
> The core [`Draggable`](/draggable) class will modify the element's inline styles based on the [`frozenStyles`](#frozenstyles) setting. So it's important that you don't modify the element's inline styles via React during the drag, at least not the ones that are affected by the [`frozenStyles`](#frozenstyles) setting.

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
- Default is a (very involved) function that applies the position, container offset, alignment offset and matrix transform offsets the element's transform property, while respecting the element's original transform and transform origin.

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
type returnValue = Draggable<S> | null;
```

Returns the [`Draggable`](/draggable) instance or `null` if there are no sensors ready yet.

## Types

### UseDraggableSettings

```ts
// Import
import type { UseDraggableSettings } from 'dragdoll-react';

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
