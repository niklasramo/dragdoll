import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
  createSnapModifier,
} from '../../src';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor({
  moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
  getPositionChange: createSnapModifier(GRID_WIDTH, GRID_HEIGHT),
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});
