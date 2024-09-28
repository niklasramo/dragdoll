import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function methodOff() {
  describe('off', () => {
    it('should remove an event listener based on id', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let msg = '';

      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      assert.equal(msg, 'b');
    });
  });
}
