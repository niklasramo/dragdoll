# useDndObserverContext

A React hook that retrieves the [DndObserver](/dnd-observer) instance from [DndObserverContext](/react/dnd-observer-context).

## Usage

```tsx
import { useDndObserverContext } from 'dragdoll-react';

function MyComponent() {
  const dndObserver = useDndObserverContext();

  if (!dndObserver) {
    return <div>No observer in context</div>;
  }

  return <div>Observer ready</div>;
}
```

## Signature

```ts
function useDndObserverContext<T extends CollisionData = CollisionData>(): DndObserver<T> | null;
```

## Return Value

Returns the [DndObserver](/dnd-observer) instance from context, or `null` if no observer is provided in context.

## Examples

### Basic Usage

```tsx
import { useRef, useMemo, useCallback } from 'react';
import {
  DndObserverContext,
  useDndObserver,
  useDndObserverContext,
  usePointerSensor,
  useDraggable,
} from 'dragdoll-react';

function DraggableItem() {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const dndObserver = useDndObserverContext();
  const [sensor, setSensorRef] = usePointerSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      dndObserver,
    }),
    [dndObserver],
  );

  // Explicitly use the context observer
  const draggable = useDraggable([sensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setSensorRef(node);
    },
    [setSensorRef],
  );

  return (
    <div ref={setRefs} className="item">
      Drag me
    </div>
  );
}

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <DraggableItem />
    </DndObserverContext.Provider>
  );
}
```

### Check Observer Availability

```tsx
import { useRef, useMemo, useCallback } from 'react';
import { useDndObserverContext, usePointerSensor, useDraggable } from 'dragdoll-react';

function DraggableItem() {
  const dndObserver = useDndObserverContext();

  if (!dndObserver) {
    return <div>Error: No DndObserver in context</div>;
  }

  const elementRef = useRef<HTMLDivElement | null>(null);
  const [sensor, setSensorRef] = usePointerSensor();
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      dndObserver,
    }),
    [dndObserver],
  );
  const draggable = useDraggable([sensor], draggableSettings);
  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setSensorRef(node);
    },
    [setSensorRef],
  );

  return (
    <div ref={setRefs} className="item">
      Drag me
    </div>
  );
}
```

### Access Observer Directly

```tsx
import { useDndObserverContext } from 'dragdoll-react';

function ObserverInfo() {
  const dndObserver = useDndObserverContext();

  const handleClick = () => {
    if (dndObserver) {
      console.log('Draggables:', dndObserver.draggables.length);
      console.log('Droppables:', dndObserver.droppables.length);
    }
  };

  return <button onClick={handleClick}>Log Observer State</button>;
}
```

### Conditional Observer Logic

```tsx
import { useDndObserverContext, useDroppable } from 'dragdoll-react';

function SmartDropZone() {
  const dndObserver = useDndObserverContext();

  // Use context observer if available, otherwise create a standalone droppable
  const [droppable, setRef] = useDroppable({
    dndObserver, // Will be null if not in context, which is fine
    data: { name: 'Smart Zone' },
  });

  return (
    <div ref={setRef} style={{ border: '2px dashed gray' }}>
      {dndObserver ? 'Context Observer' : 'No Observer'}
    </div>
  );
}
```

### Add Event Listeners to Context Observer

```tsx
import {
  DndObserverContext,
  useDndObserver,
  useDndObserverContext,
  useDndObserverCallback,
} from 'dragdoll-react';

function EventLogger() {
  const dndObserver = useDndObserverContext();

  useDndObserverCallback(
    'enter',
    ({ droppable }) => {
      console.log('Entered:', droppable.data.name);
    },
    dndObserver,
  );

  useDndObserverCallback(
    'leave',
    ({ droppable }) => {
      console.log('Left:', droppable.data.name);
    },
    dndObserver,
  );

  return null;
}

function App() {
  const dndObserver = useDndObserver();

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <EventLogger />
      <DraggableItem />
      <DropZone />
    </DndObserverContext.Provider>
  );
}
```

### Multiple Nested Contexts

```tsx
import { DndObserverContext, useDndObserver, useDndObserverContext } from 'dragdoll-react';

function NestedComponent() {
  const dndObserver = useDndObserverContext();

  return <div>Observer ID: {dndObserver?.constructor.name || 'None'}</div>;
}

function App() {
  const observer1 = useDndObserver();
  const observer2 = useDndObserver();

  return (
    <DndObserverContext.Provider value={observer1}>
      <NestedComponent /> {/* Gets observer1 */}
      <DndObserverContext.Provider value={observer2}>
        <NestedComponent /> {/* Gets observer2 */}
      </DndObserverContext.Provider>
    </DndObserverContext.Provider>
  );
}
```

## Notes

- Returns `null` if used outside of a [DndObserverContext](/react/dnd-observer-context) Provider
- Returns `null` if the context value is explicitly set to `null`
- This hook is automatically called by [useDraggable](/react/use-draggable) and [useDroppable](/react/use-droppable) when no explicit observer is provided
- You can use this hook to access the observer for manual operations or event listening

## Comparison with Automatic Context Usage

```tsx
// Option 1: Explicit context access
function Component1() {
  const dndObserver = useDndObserverContext();
  const draggable = useDraggable([sensor], {
    elements: () => [element],
    dndObserver, // Explicit
  });
}

// Option 2: Automatic context usage (recommended)
function Component2() {
  // No need to call useDndObserverContext
  const draggable = useDraggable([sensor], {
    elements: () => [element],
    // dndObserver is automatically resolved from context
  });
}
```

Most of the time, you don't need to call `useDndObserverContext` explicitly. The hooks like [useDraggable](/react/use-draggable) and [useDroppable](/react/use-droppable) that need the observer will automatically get it from context.

## Types

For detailed type information, see the [DndObserver types](/dnd-observer.html#types) in the vanilla docs.
