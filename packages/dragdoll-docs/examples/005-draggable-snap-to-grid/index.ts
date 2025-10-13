import { Draggable } from 'dragdoll/draggable';
import { createSnapModifier } from 'dragdoll/draggable/modifiers/snap';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element, {
  moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
});
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],

  positionModifiers: [createSnapModifier(GRID_WIDTH, GRID_HEIGHT)],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
