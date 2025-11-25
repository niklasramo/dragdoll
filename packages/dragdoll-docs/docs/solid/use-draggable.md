# useDraggable

Creates and maintains a [`Draggable`](/draggable) instance using Solid's lifecycle. The hook keeps the
instance synchronized with sensors, options, and the current [`DndObserver`](/dnd-observer) context.

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
function useDraggable<S extends Sensor[] = Sensor[]>(
  sensors: MaybeAccessor<S[number] | null>[],
  settings?: MaybeAccessor<UseDraggableSettings<S> | undefined>,
): Accessor<Draggable<S> | null>;
```

## Parameters

- `sensors` — Array of sensor accessors (e.g. values returned from `usePointerSensor`) or raw
  sensor instances. Any falsy entry is ignored so you can pass sensors that are not yet mounted.
- `settings` — Optional `MaybeAccessor` returning the [`Draggable`](/draggable#options) options.
  `UseDraggableSettings` adds a `dndObserver` override, letting you bypass the context provider.

## Return Value

`Accessor<Draggable<S> | null>` — Accessor that resolves to the live draggable instance. Useful for
advanced integrations (e.g. plugins) or awaiting initialization.

## Notes

- The draggable is destroyed automatically when the component is disposed.
- Recreating sensors, changing the `id`, or swapping the observer triggers a new instance.
- Option objects are diffed via a deep comparison; only real changes call `draggable.updateSettings`.
- If no sensors are available, the draggable is removed until at least one sensor exists.
