import type { BaseSensor } from '../../sensors/base-sensor.js';
import type { DraggableModifier } from '../draggable.js';

export const startOffsetModifier: DraggableModifier<BaseSensor> = (change, { phase, drag }) => {
  if (phase === 'start') {
    change.x += drag.startEvent.x - drag.startEvent.startX;
    change.y += drag.startEvent.y - drag.startEvent.startY;
  }
  return change;
};
