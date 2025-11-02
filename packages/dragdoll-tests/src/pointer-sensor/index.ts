import events from './events/index.js';
import methods from './methods/index.js';
import options from './options/index.js';
import properties from './properties/index.js';
import misc from './misc.js';

export default () => {
  describe('PointerSensor', () => {
    events();
    methods();
    options();
    properties();
    misc();
  });
};
