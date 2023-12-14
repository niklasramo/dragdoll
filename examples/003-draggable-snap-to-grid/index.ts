import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
} from '../../dist/dragdoll';

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
  getPositionChange: ({ startEvent, event, item }) => {
    let { prevX = startEvent.x, prevY = startEvent.y } = item.data;

    let changeX = event.x - prevX;
    let changeXAbs = Math.abs(changeX);
    if (changeXAbs >= GRID_WIDTH) {
      const overshoot = changeXAbs % GRID_WIDTH;
      if (changeX > 0) {
        changeX -= overshoot;
        item.data.prevX = event.x - overshoot;
      } else {
        changeX += overshoot;
        item.data.prevX = event.x + overshoot;
      }
    } else {
      changeX = 0;
    }

    let changeY = event.y - prevY;
    let changeYAbs = Math.abs(changeY);
    if (changeYAbs >= GRID_HEIGHT) {
      const overshoot = changeYAbs % GRID_HEIGHT;
      if (changeY > 0) {
        changeY -= overshoot;
        item.data.prevY = event.y - overshoot;
      } else {
        changeY += overshoot;
        item.data.prevY = event.y + overshoot;
      }
    } else {
      changeY = 0;
    }

    return {
      x: changeX,
      y: changeY,
    };
  },
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});
