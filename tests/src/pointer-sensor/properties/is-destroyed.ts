import { assert } from 'chai';
import { PointerSensor } from '../../../../src/index.js';

export function propIsDestroyed() {
  describe('isDestroyed', () => {
    it(`should be false on init`, function () {
      const s = new PointerSensor(document.body);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
  });
}
