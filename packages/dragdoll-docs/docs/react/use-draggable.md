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

Configuration settings for the [`Draggable`](/draggable) instance. Extends core [`DraggableOptions`](/draggable#draggableoptions) with an optional `dndObserver` setting.

As per React's declarative nature, these settings are always merged with the [default settings](/draggable#settings) and then provided to the [`Draggable`](/draggable) instance. This way there will be no cumulative effect of settings changes over time meaning that the old settings will be completely overridden by the new settings.

Treat these as live settings that can be updated dynamically without recreating the draggable (except for `id`, which will cause the draggable to be recreated). When `dndGroups` or `computeClientRect` change, the hook will automatically trigger collision detection updates in the associated `DndObserver`.

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

```ts
type container =
  | HTMLElement
  | null
  | ((data: {
      draggable: Draggable<S>;
      drag: DraggableDrag<S>;
      element: HTMLElement | SVGSVGElement;
    }) => HTMLElement | null);
```

The element the dragged elements should be appended to for the duration of the drag. If set to `null` the element's current parent element is used.

> [!IMPORTANT]  
> The `container` setting is not fully supported in React because it will make the core library move DOM nodes under a different node for the duration of the drag. React has it's own [portal API](https://react.dev/reference/react-dom/createPortal) for moving DOM nodes around, which is very hard to support in a wrapper library.

However, all is not lost. The `container` option can be used to a quite large extent. As long as you don't give React any reason to _move_ the dragged element (provided via the [`elements`](#elements) setting) in the DOM during the drag, you should be mostly fine.

If you follow these rules, you should be mostly fine:

1. The dragged element should not be moved in the DOM during the drag.
2. The dragged element should not be removed from the DOM during the drag.
3. The dragged element should not be recreated during the drag, e.g. React creating a new DOM node for the dragged element during the drag.
4. The container element should not be removed from the DOM during the drag.
5. The container element should not be recreated during the drag, e.g. React creating a new DOM node for the container element during the drag.

To really play it safe, it's recommended to do the following:

1. Use a non-React controlled element as the `container`, e.g. `document.body`.
2. Create a non-React controlled drag preview element (e.g. clone the actual draggable element) and provide it as the dragged element via the [`elements`](#elements) setting.

If you do both, React should have no reason to throw an error about the DOM manipulations by the core library.

Check the [`container`](/draggable#container) core docs for more info.

- Optional.
- Default is `null`.

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
interface UseDraggableSettings<S extends Sensor = Sensor> extends Partial<DraggableOptions<S>> {
  dndObserver?: DndObserver<any> | null;
}
```
