import { assert } from 'chai';
import { PointerSensor } from '../../../../src/index.js';

export function propDrag() {
  describe('drag', () => {
    it(`should be null on init`, function () {
      const s = new PointerSensor(document.body);
      assert.equal(s.drag, null);
      s.destroy();
    });
  });
}
