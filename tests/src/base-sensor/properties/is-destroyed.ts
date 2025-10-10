import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function propIsDestroyed() {
  describe('isDestroyed', () => {
    it(`should be false on init`, () => {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should be true after destroy method is called`, () => {
      const s = new BaseSensor();
      s.destroy();
      assert.equal(s.isDestroyed, true);
    });
  });
}
