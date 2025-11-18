import baseSensor from './base-sensor/index.js';
import dndObserver from './dnd-observer/index.js';
import draggable from './draggable/index.js';
import keyboardSensor from './keyboard-sensor/index.js';
import pointerSensor from './pointer-sensor/index.js';

describe('dragdoll', () => {
  baseSensor();
  dndObserver();
  draggable();
  keyboardSensor();
  pointerSensor();
});
