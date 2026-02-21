import type { Sensor, SensorEvents } from '../../sensors/sensor.js';
import type { DraggableModifier } from '../draggable.js';

export interface StartOffsetSensorEvents extends SensorEvents {
  start: SensorEvents['start'] & { startX?: number; startY?: number };
  move: SensorEvents['move'] & { startX?: number; startY?: number };
}

export interface StartOffsetSensor extends Sensor<StartOffsetSensorEvents> {
  drag?: {
    startX?: number;
    startY?: number;
  } | null;
}

export const startOffsetModifier: DraggableModifier<StartOffsetSensor> = (
  change,
  { phase, drag },
) => {
  if (phase === 'start') {
    const startX = drag.sensor.drag?.startX ?? drag.startEvent.startX;
    const startY = drag.sensor.drag?.startY ?? drag.startEvent.startY;

    if (startX !== undefined && startY !== undefined) {
      change.x += drag.startEvent.x - startX;
      change.y += drag.startEvent.y - startY;
    }
  }
  return change;
};
