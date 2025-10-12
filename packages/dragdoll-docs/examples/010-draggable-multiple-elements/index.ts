import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const otherElements = draggableElements.filter((el) => el !== element);
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => {
      return [element, ...otherElements];
    },
    startPredicate: () => {
      return !element.classList.contains('dragging');
    },
    onStart: (drag) => {
      drag.items.forEach((item) => {
        item.element.classList.add('dragging');
      });
    },
    onEnd: (drag) => {
      drag.items.forEach((item) => {
        item.element.classList.remove('dragging');
      });
    },
  });
});
