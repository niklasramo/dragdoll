import { createTouchDelayPredicate, Draggable, PointerSensor, startOffsetModifier } from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);

new Draggable([pointerSensor], {
  elements: () => [element],
  startPredicate: createTouchDelayPredicate({ touchDelay: 1000 }),
  positionModifiers: [startOffsetModifier],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
