import { propDrag } from './drag.js';
import { propIsDestroyed } from './is-destroyed.js';

export function properties() {
  describe('properties', () => {
    propDrag();
    propIsDestroyed();
  });
}
