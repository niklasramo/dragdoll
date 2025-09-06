import { events } from './events.js';
import { collisionDetection } from './collision-detection.js';
import { droppables } from './droppables.js';
import { methods } from './methods.js';

describe('DndContext', () => {
  events();
  collisionDetection();
  droppables();
  methods();
});
