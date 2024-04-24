import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
} from '../../src';

let zIndex = 0;

const draggableElements = document.querySelectorAll('.draggable');

[...draggableElements].forEach((draggableElement) => {
  const pointerSensor = new PointerSensor(draggableElement);
  const keyboardSensor = new KeyboardMotionSensor(draggableElement);
  const draggable = new Draggable([pointerSensor, keyboardSensor], {
    getElements: () => [draggableElement as HTMLElement],
    startPredicate: createPointerSensorStartPredicate(),
    getFrozenProps: () => ['transform'],
  });

  draggable.on('start', () => {
    draggableElement.classList.add('dragging');
    (draggableElement as HTMLElement).style.zIndex = `${++zIndex}`;
  });

  draggable.on('end', () => {
    draggableElement.classList.remove('dragging');
  });
});
