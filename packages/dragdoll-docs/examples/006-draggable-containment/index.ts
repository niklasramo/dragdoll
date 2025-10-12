import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { createContainmentModifier } from 'dragdoll/draggable/modifiers/containment';

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
