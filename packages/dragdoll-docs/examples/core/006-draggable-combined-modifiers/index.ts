import { createContainmentModifier, Draggable, PointerSensor } from 'dragdoll';

const THRESHOLD = 5;
const GRID = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);

new Draggable([pointerSensor], {
  elements: () => [element],
  startPredicate: ({ event }) => {
    const dx = event.x - event.startX;
    const dy = event.y - event.startY;
    return Math.sqrt(dx * dx + dy * dy) >= THRESHOLD ? true : undefined;
  },
  positionModifiers: [
    createContainmentModifier(
      () => ({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      { snapX: GRID, snapY: GRID },
    ),
  ],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
