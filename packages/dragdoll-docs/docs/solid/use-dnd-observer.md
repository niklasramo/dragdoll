# useDndObserver

A Solid hook that creates and returns a [`DndObserver`](/dnd-observer) instance for observing collisions between `Draggable` and `Droppable` instances.

The observer is automatically destroyed when the component is disposed.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import { DndObserverContext, useDndObserver } from 'dragdoll-solid';

function App() {
  const observer = useDndObserver({
    onEnter: ({ draggable, droppable }) => {
      console.log('Draggable entered droppable');
    },
    onLeave: ({ draggable, droppable }) => {
      console.log('Draggable left droppable');
    },
  });

  return (
    <DndObserverContext.Provider value={observer}>
      {/* Your draggables and droppables */}
    </DndObserverContext.Provider>
  );
}

render(() => <App />, document.getElementById('root')!);
```

## Signature

```ts
function useDndObserver<T extends CollisionData = CollisionData>(
  settings?: MaybeAccessor<UseDndObserverSettings<T> | undefined>,
): Accessor<DndObserver<T> | null>;
```

## Parameters

### settings

```ts
type settings = MaybeAccessor<UseDndObserverSettings<T> | undefined>;
```

Configuration settings for the `DndObserver`.

Settings can be a plain object or an accessor function returning the settings object. When provided as an accessor, the hook reacts to changes automatically via Solid's fine-grained tracking.

#### collisionDetector

```ts
type collisionDetector = CollisionDetector<T>;
```

A factory function that receives the `DndObserver` instance and returns a [`CollisionDetector`](/collision-detector). By default, if `undefined`, a default `CollisionDetector` will be created.

> [!IMPORTANT]
> The `DndObserver` will be recreated whenever this setting changes. If you provide the setting via an accessor, make sure the returned function reference is stable when no actual change is intended.

See the [CollisionDetector](/collision-detector) docs for subclassing examples.

- Optional.
- Default is `undefined`.

#### onStart

```ts
type onStart = (event: DndObserverStartEvent<T>) => void;
```

A callback function that is called when a draggable starts being dragged.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onMove

```ts
type onMove = (event: DndObserverMoveEvent<T>) => void;
```

A callback function that is called when a draggable is moved.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onEnter

```ts
type onEnter = (event: DndObserverEnterEvent<T>) => void;
```

A callback function that is called when a draggable enters a droppable.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onLeave

```ts
type onLeave = (event: DndObserverLeaveEvent<T>) => void;
```

A callback function that is called when a draggable leaves a droppable.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onCollide

```ts
type onCollide = (event: DndObserverCollideEvent<T>) => void;
```

A callback function that is called when a draggable collides with a droppable.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onEnd

```ts
type onEnd = (event: DndObserverEndEvent<T>) => void;
```

A callback function that is called when a draggable stops being dragged.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onAddDraggables

```ts
type onAddDraggables = (event: DndObserverAddDraggablesEvent<T>) => void;
```

A callback function that is called when a draggable is added to the observer.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onRemoveDraggables

```ts
type onRemoveDraggables = (event: DndObserverRemoveDraggablesEvent<T>) => void;
```

A callback function that is called when a draggable is removed from the observer.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onAddDroppables

```ts
type onAddDroppables = (event: DndObserverAddDroppablesEvent<T>) => void;
```

A callback function that is called when a droppable is added to the observer.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onRemoveDroppables

```ts
type onRemoveDroppables = (event: DndObserverRemoveDroppablesEvent<T>) => void;
```

A callback function that is called when a droppable is removed from the observer.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

#### onDestroy

```ts
type onDestroy = (event: DndObserverDestroyEvent<T>) => void;
```

A callback function that is called when the observer is destroyed.

> [!IMPORTANT]
> Callbacks do not need special handling. The hook stores a reference to the latest callback internally.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = Accessor<DndObserver<T> | null>;
```

Returns an accessor to the [`DndObserver`](/dnd-observer) instance, or `null` if not yet initialized. Access with `observer()`.

## Types

### UseDndObserverSettings

```ts
// Import
import type { UseDndObserverSettings } from 'dragdoll-solid';

// Interface
interface UseDndObserverSettings<T extends CollisionData = CollisionData> {
  collisionDetector?: DndObserverOptions<T>['collisionDetector'];
  onStart?: DndObserverEventCallbacks<T>['start'];
  onMove?: DndObserverEventCallbacks<T>['move'];
  onEnter?: DndObserverEventCallbacks<T>['enter'];
  onLeave?: DndObserverEventCallbacks<T>['leave'];
  onCollide?: DndObserverEventCallbacks<T>['collide'];
  onEnd?: DndObserverEventCallbacks<T>['end'];
  onAddDraggables?: DndObserverEventCallbacks<T>['addDraggables'];
  onRemoveDraggables?: DndObserverEventCallbacks<T>['removeDraggables'];
  onAddDroppables?: DndObserverEventCallbacks<T>['addDroppables'];
  onRemoveDroppables?: DndObserverEventCallbacks<T>['removeDroppables'];
  onDestroy?: DndObserverEventCallbacks<T>['destroy'];
}
```

## Notes

- The observer is destroyed automatically when the component is disposed.
- Creating a new `collisionDetector` reference triggers recreation of the whole observer.
- Callbacks can be supplied directly or via accessor functions for reactive composition.
- SSR-safe: returns `() => null` on the server.
