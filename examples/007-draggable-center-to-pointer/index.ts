import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  positionModifiers: [
    (change, { drag, item, phase }) => {
      // Align the dragged element so that the pointer
      // is in the center of the element.
      if (
        // Only apply the alignment on the start phase.
        phase === 'start' &&
        // Only apply the alignment for the pointer sensor.
        drag.sensor instanceof PointerSensor &&
        // Only apply the alignment for the primary drag element.
        drag.items[0].element === item.element
      ) {
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
