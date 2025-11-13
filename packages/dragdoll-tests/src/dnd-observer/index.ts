import advancedCollisionDetector from './advanced-collision-detector.js';
import collisionDetector from './collision-detector.js';
import droppable from './droppable.js';
import events from './events.js';
import methods from './methods.js';

export default () => {
  describe('DndObserver', () => {
    advancedCollisionDetector();
    collisionDetector();
    droppable();
    events();
    methods();
  });
};
