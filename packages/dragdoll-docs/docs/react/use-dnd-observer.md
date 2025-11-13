# useDndObserver

A React hook that creates and returns a [`DndObserver`](/dnd-observer) instance for observing collisions between `Draggable` and `Droppable` instances.

The observer is automatically destroyed when the component unmounts.

## Usage

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver({
    onEnter: ({ draggable, droppable }) => {
      console.log('Draggable entered droppable');
    },
    onLeave: ({ draggable, droppable }) => {
      console.log('Draggable left droppable');
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      {/* Your draggables and droppables */}
    </DndObserverContext.Provider>
  );
}
```

## Signature

```ts
function useDndObserver<T extends CollisionData = CollisionData>(
  settings?: UseDndObserverOptions<T>,
): DndObserver<T> | null;
```

## Parameters

### settings

```ts
type settings = UseDndObserverSettings<T>;
```

Configuration settings for the `DndObserver`.

#### collisionDetector

```ts
type collisionDetector = CollisionDetector<T>;
```

A factory function that receives the `DndObserver` instance and returns a [`CollisionDetector`](/collision-detector). By default, if `undefined`, a default `CollisionDetector` will be created.

> [!IMPORTANT]  
> Make sure to memoize the collision detector factory function as the `DndObserver` will be recreated whenever this setting changes.

See the [CollisionDetector](/collision-detector) docs for subclassing examples.

- Optional.
- Default is `undefined`.

#### onStart

```ts
type onStart = (event: DndObserverStartEvent<T>) => void;
```

A callback function that is called when a draggable starts being dragged.

- Optional.
- Default is `undefined`.

#### onMove

```ts
type onMove = (event: DndObserverMoveEvent<T>) => void;
```

A callback function that is called when a draggable is moved.

- Optional.
- Default is `undefined`.

#### onEnter

```ts
type onEnter = (event: DndObserverEnterEvent<T>) => void;
```

A callback function that is called when a draggable enters a droppable.

- Optional.
- Default is `undefined`.

#### onLeave

```ts
type onLeave = (event: DndObserverLeaveEvent<T>) => void;
```

A callback function that is called when a draggable leaves a droppable.

- Optional.
- Default is `undefined`.

#### onCollide

```ts
type onCollide = (event: DndObserverCollideEvent<T>) => void;
```

A callback function that is called when a draggable collides with a droppable.

- Optional.
- Default is `undefined`.

#### onEnd

```ts
type onEnd = (event: DndObserverEndEvent<T>) => void;
```

A callback function that is called when a draggable stops being dragged.

- Optional.
- Default is `undefined`.

#### onAddDraggables

```ts
type onAddDraggables = (event: DndObserverAddDraggablesEvent<T>) => void;
```

A callback function that is called when a draggable is added to the observer.

- Optional.
- Default is `undefined`.

#### onRemoveDraggables

```ts
type onRemoveDraggables = (event: DndObserverRemoveDraggablesEvent<T>) => void;
```

A callback function that is called when a draggable is removed from the observer.

- Optional.
- Default is `undefined`.

#### onAddDroppables

```ts
type onAddDroppables = (event: DndObserverAddDroppablesEvent<T>) => void;
```

A callback function that is called when a droppable is added to the observer.

- Optional.
- Default is `undefined`.

#### onRemoveDroppables

```ts
type onRemoveDroppables = (event: DndObserverRemoveDroppablesEvent<T>) => void;
```

A callback function that is called when a droppable is removed from the observer.

- Optional.
- Default is `undefined`.

#### onDestroy

```ts
type onDestroy = (event: DndObserverDestroyEvent<T>) => void;
```

A callback function that is called when the observer is destroyed.

- Optional.
- Default is `undefined`.

## Return Value

```ts
type returnValue = DndObserver<T> | null;
```

Returns the [`DndObserver`](/dnd-observer) instance or `null` if not yet initialized.

## Types

### UseDndObserverSettings

```ts
// Import
import type { UseDndObserverSettings } from 'dragdoll-react';

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
