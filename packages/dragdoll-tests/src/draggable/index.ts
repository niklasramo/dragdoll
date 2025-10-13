import { methods } from './methods/index.js';
import { options } from './options/index.js';
import { events } from './events.js';
import { misc } from './misc.js';

describe('Draggable', () => {
  events();
  options();
  methods();
  misc();
});
