# useDraggableAutoScroll

Enhances a draggable with the core [`autoScrollPlugin`](/draggable-auto-scroll-plugin) while keeping
the plugin settings reactive.

## Usage

```tsx
/** @jsxImportSource solid-js */
import { render } from 'solid-js/web';
import {
  useDraggable,
  useDraggableAutoScroll,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';

function Card() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const baseDraggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
  }));

  const draggable = useDraggableAutoScroll(baseDraggable, () => ({
    targets: [
      {
        element: window,
        axis: 'y',
        padding: { top: 64, bottom: 64 },
      },
    ],
  }));

  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
        setKeyboardSensorRef(node);
      }}
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      tabIndex={0}
    >
      Auto-scrolls viewport
    </div>
  );
}

render(() => <Card />, document.getElementById('root')!);
```

## Signature

```ts
function useDraggableAutoScroll<S extends Sensor[] = Sensor[]>(
  draggable: MaybeAccessor<Draggable<S> | null>,
  settings?: MaybeAccessor<UseDraggableAutoScrollSettings<S> | undefined>,
): Accessor<ReturnType<ReturnType<typeof autoScrollPlugin<S>>> | null>;
```

## Notes

- Automatically installs the plugin once the draggable exists.
- Plugin settings are diffed; real changes call `plugin.updateSettings`.
- Returns the same accessor as the input draggable so you can keep chaining helpers.
