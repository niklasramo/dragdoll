import { base } from './base.js';
import { events } from './events.js';
import { methods } from './methods/index.js';
import { options } from './options/index.js';

describe('Draggable', () => {
  base();
  events();
  options();
  methods();
});
