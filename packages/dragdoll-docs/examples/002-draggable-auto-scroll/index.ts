import { autoScrollPlugin, Draggable, KeyboardMotionSensor, PointerSensor } from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const dragContainer = document.querySelector('.drag-container') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element, {
  computeSpeed: () => 100,
});
new Draggable([pointerSensor, keyboardSensor], {
  container: dragContainer,
  elements: () => [element],
  frozenStyles: () => ['left', 'top'],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
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
