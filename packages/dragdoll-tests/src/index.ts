import baseSensor from './base-sensor/index.js';
import dndContext from './dnd-context/index.js';
import draggable from './draggable/index.js';
import keyboardSensor from './keyboard-sensor/index.js';
import pointerSensor from './pointer-sensor/index.js';

describe('dragdoll', () => {
  baseSensor();
  dndContext();
  draggable();
  keyboardSensor();
  pointerSensor();
});
