import { events } from './events.js';
import { collisionDetection } from './collision-detection.js';
import { droppables } from './droppables.js';
// import { integration } from './integration.js';

describe('DndContext', () => {
  events();
  collisionDetection();
  droppables();
  // integration();
});
