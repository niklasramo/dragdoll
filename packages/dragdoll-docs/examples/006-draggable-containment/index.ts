import {
  createContainmentModifier,
  Draggable,
  KeyboardMotionSensor,
  PointerSensor,
} from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  positionModifiers: [
    createContainmentModifier(() => {
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }),
  ],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
