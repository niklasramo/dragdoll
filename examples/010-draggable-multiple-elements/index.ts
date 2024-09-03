import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
} from '../../src';

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  const draggable = new Draggable([pointerSensor, keyboardSensor], {
    elements: () => {
      return [element, ...draggableElements.filter((el) => el !== element)];
    },
    startPredicate: createPointerSensorStartPredicate(),
    onStart: () => {
      element.classList.add('dragging');
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
});
