# useDroppable

A React hook that creates a [`Droppable`](/droppable) instance for defining drop zones.

## Usage

```tsx
import { useMemo } from 'react';
import { useDroppable } from 'dragdoll-react';

function DropZone() {
  const droppableSettings = useMemo(
    () => ({
      accept: (draggable) => {
        // If any of the draggable's item elements have the 'foo' class, allow
        // the draggable to be dropped.
        return !!draggable.drag?.items.some((item) => item.element.classList.contains('foo'));
      },
    }),
    [],
  );
  const [droppable, setDroppableElementRef] = useDroppable(droppableSettings);

  return (
    <div
      ref={setDroppableElementRef}
      style={{ width: '200px', height: '200px', border: '2px dashed blue' }}
    >
      Drop foo here
    </div>
  );
}
```

## Signature

```ts
function useDroppable({
  id,
  accept,
  data,
  computeClientRect,
  element,
  dndObserver,
}?: UseDroppableSettings): readonly [
  Droppable | null,
  (node: HTMLElement | SVGSVGElement | null) => void,
];
```

## Parameters

### options

Configuration settings for the [`Droppable`](/droppable) instance. Extends core [`DroppableOptions`](/droppable#droppableoptions) with an optional `dndObserver` setting.

As per React's declarative nature, these settings are always merged with the default settings and then provided to the [`Droppable`](/droppable) instance. This way there will be no cumulative effect of settings changes over time meaning that the old settings will be completely overridden by the new settings.

Treat these as live settings that can be updated dynamically without recreating the droppable (except for `id`, which will cause the droppable to be recreated). When `accept` or `computeClientRect` change, the hook will automatically trigger collision detection updates.

#### id

```ts
type id = DroppableId;
```

The `id` is a unique identifier for the droppable that is assigned as the droppable's [`id`](/droppable#id-1) property. It can only be provided once via the constructor options and _should not_ be changed after instantiation.

> [!IMPORTANT]  
> The `Droppable` instance will be _automatically recreated_ when the `id` setting is explicitly provided and changed.

Check the [`id`](/droppable#id-1) core docs for more info.

- Optional.
- Default is a unique symbol.

#### accept

```ts
type accept = Set<DraggableDndGroup> | ((draggable: AnyDraggable) => boolean);
```

Function that determines if a draggable can be dropped on this droppable. Return `true` to accept, `false` to reject.

Check the [`accept`](/droppable#accept-1) core docs for more info.

- Optional.
- Default is `() => true` (accepts all draggables).

#### data

```ts
type data = { [key: string]: any };
```

Custom data associated with the droppable. Can be accessed during drag and drop operations.

Check the [`data`](/droppable#data-1) core docs for more info.

- Optional.
- Default is `{}`.

#### computeClientRect

```ts
type computeClientRect = (droppable: Droppable) => Rect;
```

A function that should return the current bounding client rectangle of the droppable. This rectangle is used for collision detection.

Check the [`computeClientRect`](/droppable#computeclientrect) core docs for more info.

- Optional.
- Default uses `element.getBoundingClientRect()` if `element` is not `null`, otherwise returns the cached client rect.

#### element

```ts
type element = HTMLElement | SVGSVGElement | null;
```

The element to use as the drop zone. If not provided, use the returned ref callback to attach to an element. Can be `null` if you're using a custom `computeClientRect` function.

- Optional.
- Default is `undefined`.

#### dndObserver

```ts
type dndObserver = DndObserver<any> | null;
```

[DndObserver](/dnd-observer) instance to register this droppable with. If `undefined`, uses the dnd observer from [DndObserverContext](/react/dnd-observer-context). Set to `null` to explicitly opt out of any observer.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = readonly [Droppable | null, (node: HTMLElement | SVGSVGElement | null) => void];
```

Returns a read-only array with two elements:

1. **droppable**
   - The [`Droppable`](/droppable) instance, or `null` if not yet initialized
2. **setDroppableElementRef**
   - A ref callback to attach droppable to an element. This is the recommended way to attach the droppable to an element. You can alternatively provide an explicit element as the second parameter to the hook.

## Types

### UseDroppableSettings

```ts
// Import
import type { UseDroppableSettings } from 'dragdoll-react';

// Interface
interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement | null;
  dndObserver?: DndObserver<any> | null;
}
```
