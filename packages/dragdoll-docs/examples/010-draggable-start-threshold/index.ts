import { Draggable, DraggableModifier, PointerSensor, startOffsetModifier } from 'dragdoll';

const THRESHOLD = 5;

let zIndex = 0;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);

new Draggable<PointerSensor>([pointerSensor], {
  elements: () => [element],
  // Require 5px of movement before drag starts.
  // This allows clicking the link to work normally.
  startPredicate: ({ event }) => {
    const dx = event.x - event.startX;
    const dy = event.y - event.startY;
    return Math.sqrt(dx * dx + dy * dy) >= THRESHOLD ? true : undefined;
  },
  // Offset position on start to account for the threshold distance moved.
  positionModifiers: [startOffsetModifier as unknown as DraggableModifier<PointerSensor>],
  // preventClickOnEnd is enabled by default, so the link click is
  // automatically blocked after dragging. No manual workaround needed!
  onStart: () => {
    element.classList.add('dragging');
    element.style.zIndex = `${++zIndex}`;
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
