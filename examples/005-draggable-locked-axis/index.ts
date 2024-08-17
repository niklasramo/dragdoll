import {
  Draggable,
  DraggableDefaultSettings,
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
    getPositionChange: (...args) => {
      const change = DraggableDefaultSettings.getPositionChange(...args);
      const { element } = args[0].item;
      const allowX = element.classList.contains('axis-x');
      const allowY = element.classList.contains('axis-y');
      if (allowX && !allowY) {
        change.y = 0;
      } else if (allowY && !allowX) {
        change.x = 0;
      }
      return change;
    },
  });

  draggable.on('start', () => {
    draggableElement.classList.add('dragging');
    (draggableElement as HTMLElement).style.zIndex = `${++zIndex}`;
  });

  draggable.on('end', () => {
    draggableElement.classList.remove('dragging');
  });
});
