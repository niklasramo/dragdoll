import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { PointerSensor } from '../../../../src/index.js';

export function methodOff() {
  describe('off', () => {
    it('should remove an event listener based on id', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let msg = '';

      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);

      el.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );

      assert.equal(msg, 'b');

      s.destroy();
      el.remove();
    });
  });
}
