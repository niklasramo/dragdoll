# useKeyboardSensor

Creates a [`KeyboardSensor`](/keyboard-sensor) that moves draggables with fixed step distances.
The hook exposes Solid accessors so you can react to the sensor instance declaratively.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import { useDraggable, useDraggableDrag, useKeyboardSensor } from 'dragdoll-solid';

function Card() {
  let element: HTMLDivElement | null = null;
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardSensor({
    moveDistance: { x: 40, y: 40 },
  });
  const draggable = useDraggable([keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
  }));
  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        setKeyboardSensorRef(node);
      }}
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      tabIndex={0}
    >
      Arrow keys move me
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

## Signature

```ts
function useKeyboardSensor(
  settings?: MaybeAccessor<Partial<KeyboardSensorSettings> | undefined>,
  element?: MaybeAccessor<Element | null>,
): readonly [Accessor<KeyboardSensor | null>, (node: Element | null) => void];
```

## Parameters

### settings

`MaybeAccessor<Partial<KeyboardSensorSettings> | undefined>`

Optional configuration for the core sensor (speed, keys, axis locking, etc.).

### element

`MaybeAccessor<Element | null>`

Explicit element/accessor to attach the sensor to. Use the returned ref callback instead whenever
possible so Solid controls the lifecycle.

## Return Value

`readonly [Accessor<KeyboardSensor | null>, (node: Element | null) => void]`

1. Accessor returning the current sensor instance.
2. Ref callback used to bind the sensor to a DOM node.

## Notes

- Supports `MaybeAccessor` inputs so you can derive settings from signals or stores.
- Automatically tears down the sensor on cleanup.
- Re-creates the sensor if the DOM element changes.
