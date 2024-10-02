import { addDefaultPageStyles, removeDefaultPageStyles } from '../utils/default-page-styles.js';
import { events } from './events/index.js';
import { methods } from './methods/index.js';
import { options } from './options/index.js';
import { properties } from './properties/index.js';
import { misc } from './misc.js';

describe('PointerSensor', () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  events();
  methods();
  options();
  properties();
  misc();
});
