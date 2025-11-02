import methods from './methods/index.js';
import options from './options/index.js';
import events from './events.js';
import misc from './misc.js';

export default () => {
  describe('Draggable', () => {
    methods();
    options();
    events();
    misc();
  });
};
