import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { autoScrollPlugin } from 'dragdoll/draggable/plugins/auto-scroll';

const element = document.querySelector('.draggable') as HTMLElement;
const dragContainer = document.querySelector('.drag-container') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element, {
  computeSpeed: () => 100,
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
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
