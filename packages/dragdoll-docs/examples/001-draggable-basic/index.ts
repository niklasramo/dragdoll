import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

let zIndex = 0;

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => [element],
    onStart: () => {
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
});
