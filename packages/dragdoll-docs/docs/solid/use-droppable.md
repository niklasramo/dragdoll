# useDroppable

A Solid hook that creates a [`Droppable`](/droppable) instance for defining drop zones.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { useDroppable } from 'dragdoll-solid';

function DropZone() {
  const [droppable, setDroppableElementRef] = useDroppable(() => ({
    accept: (draggable) => {
      // If any of the draggable's item elements have the 'foo' class, allow
      // the draggable to be dropped.
      return !!draggable.drag?.items.some((item) => item.element.classList.contains('foo'));
    },
  }));

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
function useDroppable(
  settings?: MaybeAccessor<UseDroppableSettings | undefined>,
): readonly [Accessor<Droppable | null>, (node: HTMLElement | SVGSVGElement | null) => void];
```

## Parameters

### settings

Configuration settings for the [`Droppable`](/droppable) instance. Extends core [`DroppableOptions`](/droppable#droppableoptions) with optional `element` and `dndObserver` settings. You can pass a plain object or an accessor function that returns one.

Since Solid components run their setup code only once, there is no need to memoize settings. If you need reactive settings, pass an accessor function (e.g. `() => ({ ...mySignalSettings() })`).

These settings are always merged with the default settings and then provided to the [`Droppable`](/droppable) instance. This way there will be no cumulative effect of settings changes over time meaning that the old settings will be completely overridden by the new settings.

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
type element = HTMLElement | SVGSVGElement;
```

The element to use as the drop zone. If not provided, use the returned ref callback to attach to an element. Can be `null` if you're using a custom `computeClientRect` function.

- Optional.
- Default is `undefined`.

#### dndObserver

```ts
type dndObserver = DndObserver<any> | null;
```

[DndObserver](/dnd-observer) instance to register this droppable with. If `undefined`, uses the dnd observer from [DndObserverContext](/solid/dnd-observer-context). Set to `null` to explicitly opt out of any observer.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = readonly [
  Accessor<Droppable | null>,
  (node: HTMLElement | SVGSVGElement | null) => void,
];
```

Returns a read-only array with two elements:

1. **droppable**
   - An accessor that resolves to the [`Droppable`](/droppable) instance, or `null` if not yet initialized. Access the value by calling it: `droppable()`.

2. **setDroppableElementRef**
   - A ref callback to attach the droppable to an element. This is the recommended way to attach the droppable to an element. You can alternatively provide an explicit element via the `element` setting.

## Notes

- The droppable instance is automatically destroyed when the component unmounts (via `onCleanup`).
- Each droppable is automatically registered with the effective `DndObserver`.
- Updating `accept`, `data`, or `computeClientRect` mutates the existing droppable instead of recreating it.
- Changing the `id` or `element` triggers a recreation of the droppable instance.
- When `accept` or `computeClientRect` change, the hook automatically triggers collision detection on the observer.

## Types

### UseDroppableSettings

```ts
// Import
import type { UseDroppableSettings } from 'dragdoll-solid';

// Interface
interface UseDroppableSettings extends DroppableOptions {
  element?: HTMLElement | SVGSVGElement;
  dndObserver?: DndObserver<any> | null;
}
```
