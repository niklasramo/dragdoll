import { Draggable, PointerSensor, KeyboardMotionSensor } from '../../src';

let zIndex = 0;

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  const draggable = new Draggable([pointerSensor, keyboardSensor], {
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
