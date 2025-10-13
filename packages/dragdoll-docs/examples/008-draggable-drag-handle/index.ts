import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const handle = element.querySelector('.handle') as HTMLElement;
const pointerSensor = new PointerSensor(handle);
const keyboardSensor = new KeyboardMotionSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  onStart: () => {
    element.classList.add('dragging');
    if (draggable.drag!.sensor instanceof PointerSensor) {
      element.classList.add('pointer-dragging');
    } else {
      element.classList.add('keyboard-dragging');
    }
  },
  onEnd: () => {
    element.classList.remove('dragging', 'pointer-dragging', 'keyboard-dragging');
  },
});
