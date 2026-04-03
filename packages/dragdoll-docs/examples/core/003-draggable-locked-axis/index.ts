import { Draggable, KeyboardMotionSensor, PointerSensor } from 'dragdoll';

let zIndex = 0;

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const axis = element.classList.contains('axis-x') ? 'x' : 'y';
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => [element],
    positionModifiers: [
      (change) => {
        if (axis === 'x') change.y = 0;
        else change.x = 0;
        return change;
      },
    ],
    onStart: () => {
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
});
