[Draggable](/docs/draggable) →

# AutoScroll Plugin

Adds auto scrolling superpowers to a Draggable instance.

## Example

```ts
import {
  PointerSensor,
  KeyboardSensor,
  Draggable,
  autoScrollPlugin,
  createPointerSensorStartPredicate,
} from 'dragdoll';

const element = document.querySelector('.draggable');
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
}).use(
  autoScrollPlugin({
    targets: [
      {
        // Auto scroll the window.
        element: window,
        // Vertically only.
        axis: 'y',
        // When the dragged element's edge is 100 pixels (or less) from the
        // window's edge.
        threshold: 100,
      },
    ],
  })
);
```
