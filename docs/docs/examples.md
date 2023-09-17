# Examples

## Basic Draggable

<iframe src="/dragdoll/examples/draggable-basic.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
  autoScrollPlugin,
} from 'dragdoll';

const element = document.querySelector('.draggable');
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
});
```

## Draggable with AutoScroll

<iframe src="/dragdoll/examples/draggable-autoscroll.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
  autoScrollPlugin,
} from 'dragdoll';

const element = document.querySelector('.draggable');
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
}).use(
  autoScrollPlugin({
    targets: [
      {
        element: window,
        axis: 'y',
        padding: { top: Infinity, bottom: Infinity },
      },
    ],
  }),
);
```
