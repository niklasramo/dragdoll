import { Draggable, PointerSensor, KeyboardSensor, createSnapModifier } from '../../src';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element, {
  moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],

  positionModifiers: [createSnapModifier(GRID_WIDTH, GRID_HEIGHT)],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
