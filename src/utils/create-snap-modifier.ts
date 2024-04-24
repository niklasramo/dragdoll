import { Sensor } from '../sensors/sensor.js';

import { DraggableDragItem } from 'draggable/draggable-drag-item.js';

function round(value: number, multipleOf: number) {
  return Math.round(value / multipleOf) * multipleOf;
}

function getAxisChange(gridSize: number, snapPosition: number, sensorPosition: number) {
  let change = sensorPosition - snapPosition;
  let changeAbs = Math.abs(change);
  if (changeAbs >= gridSize) {
    const overflow = changeAbs % gridSize;
    return round(change > 0 ? change - overflow : change + overflow, gridSize);
  }
  return 0;
}

export function createSnapModifier<S extends Sensor[], E extends S[number]['events']>(
  gridWidth: number,
  gridHeight: number,
) {
  return function snapModifier({
    item,
    event,
    startEvent,
  }: {
    item: DraggableDragItem<S, E>;
    event: E['start'] | E['move'];
    startEvent: E['start'] | E['move'];
  }) {
    let { __snapX__ = startEvent.x, __snapY__ = startEvent.y } = item.data;

    const changeX = getAxisChange(gridWidth, __snapX__, event.x);
    const changeY = getAxisChange(gridHeight, __snapY__, event.y);

    if (changeX) {
      item.data.__snapX__ = __snapX__ + changeX;
    }
    if (changeY) {
      item.data.__snapY__ = __snapY__ + changeY;
    }

    return {
      x: changeX,
      y: changeY,
    };
  };
}
