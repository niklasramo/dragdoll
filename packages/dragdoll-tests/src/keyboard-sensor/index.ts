import events from './events/index.js';
import methods from './methods/index.js';
import options from './options/index.js';
import properties from './properties/index.js';

export default () => {
  describe('KeyboardSensor', () => {
    events();
    methods();
    options();
    properties();
  });
};
