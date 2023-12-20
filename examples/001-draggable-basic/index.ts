import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
} from '../../src';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});
