# Examples

## Draggable - Basic

<iframe src="/dragdoll/examples/001-draggable-basic/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
} from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});

```

## Draggable - Autoscroll

<iframe src="/dragdoll/examples/002-draggable-autoscroll/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
  autoScrollPlugin,
} from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const container = document.querySelector('.drag-container') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  container,
  getElements: () => [element],
  getFrozenProps: () => ['left', 'top'],
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

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});

```

## Draggable - Snap To Grid

<iframe src="/dragdoll/examples/003-draggable-snap-to-grid/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
} from 'dragdoll';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor({
  moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
  getPositionChange: ({ startEvent, event, item }) => {
    let { prevX = startEvent.x, prevY = startEvent.y } = item.data;

    let changeX = event.x - prevX;
    let changeXAbs = Math.abs(changeX);
    if (changeXAbs >= GRID_WIDTH) {
      const overshoot = changeXAbs % GRID_WIDTH;
      if (changeX > 0) {
        changeX -= overshoot;
        item.data.prevX = event.x - overshoot;
      } else {
        changeX += overshoot;
        item.data.prevX = event.x + overshoot;
      }
    } else {
      changeX = 0;
    }

    let changeY = event.y - prevY;
    let changeYAbs = Math.abs(changeY);
    if (changeYAbs >= GRID_HEIGHT) {
      const overshoot = changeYAbs % GRID_HEIGHT;
      if (changeY > 0) {
        changeY -= overshoot;
        item.data.prevY = event.y - overshoot;
      } else {
        changeY += overshoot;
        item.data.prevY = event.y + overshoot;
      }
    } else {
      changeY = 0;
    }

    return {
      x: changeX,
      y: changeY,
    };
  },
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});

```

