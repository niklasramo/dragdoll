import { Draggable, KeyboardMotionSensor, PointerSensor } from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  positionModifiers: [
    (change, { drag, item, phase }) => {
      // Align the dragged element so that the pointer
      // is in the center of the element.
      if (phase === 'start' && drag.sensor instanceof PointerSensor) {
        const { clientRect } = item;
        const { x, y } = drag.startEvent;
        const targetX = clientRect.x + clientRect.width / 2;
        const targetY = clientRect.y + clientRect.height / 2;
        change.x = x - targetX;
        change.y = y - targetY;
      }
      return change;
    },
  ],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
