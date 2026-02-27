import {
  createTouchDelayPredicate,
  Draggable,
  DraggableModifier,
  PointerSensor,
  startOffsetModifier,
} from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);

new Draggable<PointerSensor>([pointerSensor], {
  elements: () => [element],
  startPredicate: createTouchDelayPredicate({ touchDelay: 1000 }),
  positionModifiers: [startOffsetModifier as unknown as DraggableModifier<PointerSensor>],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
