import type { Sensor } from '../../sensors/sensor.js';
import type { DraggableModifier } from '../draggable.js';

function round(value: number, multipleOf: number) {
  return Math.round(value / multipleOf) * multipleOf;
}

function getAxisChange(cellSize: number, snapPosition: number, sensorPosition: number) {
  const change = sensorPosition - snapPosition;
  const changeAbs = Math.abs(change);
  if (changeAbs >= cellSize) {
    const overflow = changeAbs % cellSize;
    return round(change > 0 ? change - overflow : change + overflow, cellSize);
  }
  return 0;
}

export function createSnapModifier<S extends Sensor[]>(cellWidth: number, cellHeight: number) {
  return function snapModifier(change, { item }) {
    const snapState: { snapX: number; snapY: number; sensorX: number; sensorY: number } =
      item.data.__snap__ ||
      (item.data.__snap__ = {
        snapX: 0,
        snapY: 0,
        sensorX: 0,
        sensorY: 0,
      });

    // Add the change to the sensor position.
    snapState.sensorX += change.x;
    snapState.sensorY += change.y;

    // Compute the change on the x and y axis.
    const changeX = getAxisChange(cellWidth, snapState.snapX, snapState.sensorX);
    const changeY = getAxisChange(cellHeight, snapState.snapY, snapState.sensorY);

    // Add the change to the snap position.
    snapState.snapX += changeX;
    snapState.snapY += changeY;

    // Update the change.
    change.x = changeX;
    change.y = changeY;

    return change;
  } as DraggableModifier<S>;
}
