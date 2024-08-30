import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
} from '../../src';

const element = document.querySelector('.draggable') as HTMLElement;
const handle = element.querySelector('.handle') as HTMLElement;
const pointerSensor = new PointerSensor(handle);
const keyboardSensor = new KeyboardMotionSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
});

draggable.on('start', () => {
  element.classList.add('dragging');
  if (draggable.drag!.sensor instanceof PointerSensor) {
    element.classList.add('pointer-dragging');
  } else {
    element.classList.add('keyboard-dragging');
  }
});

draggable.on('end', () => {
  element.classList.remove('dragging', 'pointer-dragging', 'keyboard-dragging');
});
