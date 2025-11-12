# useDndObserver

A React hook that creates a [DndObserver](/dnd-observer) instance for handling drag and drop collision detection.

## Usage

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function MyComponent() {
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
function useDndObserver<T extends CollisionData = CollisionData>({
  collisionDetector,
  onStart,
  onMove,
  onEnter,
  onLeave,
  onCollide,
  onEnd,
  onAddDraggables,
  onRemoveDraggables,
  onAddDroppables,
  onRemoveDroppables,
  onDestroy,
}?: UseDndObserverOptions<T>): DndObserver<T> | null;
```

## Parameters

### options

- Type: `UseDndObserverOptions<T>`
- Optional

Configuration options for the DndObserver.

#### collisionDetector

Custom collision detector function. See [CollisionDetector](/collision-detector) in the vanilla docs.

#### Event Callbacks

All event callbacks are optional. See [DndObserver events](/dnd-observer.html#events) for the full list and payloads.

## Return Value

Returns the [DndObserver](/dnd-observer) instance or `null` if not yet initialized.

## Examples

### Basic Usage

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### With Event Handlers

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver({
    onStart: ({ draggable }) => {
      console.log('Drag started');
    },
    onEnter: ({ draggable, droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    onLeave: ({ draggable, droppable }) => {
      console.log('Left:', droppable.data.name);
    },
    onEnd: ({ draggable, droppable }) => {
      if (droppable) {
        console.log('Dropped on:', droppable.data.name);
      }
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### With State Updates

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';
import { useState } from 'react';

function App() {
  const [currentDroppable, setCurrentDroppable] = useState<string | null>(null);
  const [droppedOn, setDroppedOn] = useState<string | null>(null);

  const dndObserver = useDndObserver({
    onEnter: ({ droppable }) => {
      setCurrentDroppable(droppable.data.name);
    },
    onLeave: () => {
      setCurrentDroppable(null);
    },
    onEnd: ({ droppable }) => {
      if (droppable) {
        setDroppedOn(droppable.data.name);
      }
      setCurrentDroppable(null);
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div>
        {currentDroppable && <p>Over: {currentDroppable}</p>}
        {droppedOn && <p>Dropped on: {droppedOn}</p>}
      </div>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### With Custom Collision Detector

```tsx
import { AdvancedCollisionDetector } from 'dragdoll';
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const dndObserver = useDndObserver({
    collisionDetector: new AdvancedCollisionDetector({
      getScore: ({ rect1, rect2 }) => {
        // Custom collision scoring logic
        return getIntersectionArea(rect1, rect2);
      },
    }),
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Multiple Observers

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';

function App() {
  const observer1 = useDndObserver({
    onEnter: ({ droppable }) => {
      console.log('Observer 1: Entered', droppable.data.name);
    },
  });

  const observer2 = useDndObserver({
    onEnter: ({ droppable }) => {
      console.log('Observer 2: Entered', droppable.data.name);
    },
  });

  return (
    <>
      <DndObserverContext.Provider value={observer1}>
        <div className="group-1">
          <DraggableItem />
          <DropZone />
        </div>
      </DndObserverContext.Provider>

      <DndObserverContext.Provider value={observer2}>
        <div className="group-2">
          <DraggableItem />
          <DropZone />
        </div>
      </DndObserverContext.Provider>
    </>
  );
}
```

### With Collision Data

```tsx
import { DndObserverContext, useDndObserver } from 'dragdoll-react';
import { useState } from 'react';

function App() {
  const [collisions, setCollisions] = useState<string[]>([]);

  const dndObserver = useDndObserver({
    onCollide: ({ draggable, droppable, collision }) => {
      // Collision object contains detailed collision data
      console.log('Collision score:', collision.score);
    },
    onEnter: ({ droppable }) => {
      setCollisions((prev) => [...prev, droppable.data.name]);
    },
    onLeave: ({ droppable }) => {
      setCollisions((prev) => prev.filter((name) => name !== droppable.data.name));
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div>
        <h3>Currently colliding with:</h3>
        <ul>
          {collisions.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      </div>
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

## Notes

- The observer is automatically destroyed when the component unmounts
- If `collisionDetector` changes, the observer is recreated
- Event callbacks can be updated dynamically without recreating the observer
- The observer automatically manages draggable and droppable registration when using `useDraggable` and `useDroppable` with context
- The observer is `null` only during the initial render

## Events

See [DndObserver events](/dnd-observer.html#events) for the complete list of events, payloads, and timing semantics.

## Types

For detailed type information, see [DndObserver types](/dnd-observer.html#types) in the vanilla docs.
