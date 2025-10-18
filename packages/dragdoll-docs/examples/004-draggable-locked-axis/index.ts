import { Draggable, KeyboardMotionSensor, PointerSensor } from 'dragdoll';

let zIndex = 0;

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => [element],
    positionModifiers: [
      (change, { item }) => {
        const { element } = item;
        const allowX = element.classList.contains('axis-x');
        const allowY = element.classList.contains('axis-y');
        if (allowX && !allowY) {
          change.y = 0;
        } else if (allowY && !allowX) {
          change.x = 0;
        }
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
