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
  getFrozenProps: () => ['transform'],
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
  createSnapModifier,
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
  getPositionChange: createSnapModifier(GRID_WIDTH, GRID_HEIGHT),
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});

```

