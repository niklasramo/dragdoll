import { addDefaultPageStyles, removeDefaultPageStyles } from '../utils/default-page-styles.js';
import { options } from './options/index.js';
import { properties } from './properties/index.js';
import { methods } from './methods/index.js';
import { events } from './events/index.js';

// TODO:
// - Make sure you change settings on the fly during drag.
// - Make sure you can define moveDistance as a point object also.
// - Make sure destroy method works correctly.

describe('KeyboardSensor', () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  options();
  properties();
  methods();
  events();
});
