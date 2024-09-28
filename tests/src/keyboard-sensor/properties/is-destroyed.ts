import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function propIsDestroyed() {
  describe('isDestroyed', () => {
    it(`should be false on init`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.isDestroyed, false);
      el.remove();
      s.destroy();
    });

    it(`should be true after destroy method is called`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      s.destroy();
      assert.equal(s.isDestroyed, true);
      el.remove();
    });
  });
}
