import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
  autoScrollPlugin,
} from '../../src';

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
