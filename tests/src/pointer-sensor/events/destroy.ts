import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { PointerSensor } from '../../../../src/index.js';

export function eventDestroy() {
  describe('destroy', () => {
    it(`should be triggered on destroy`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el);

      let destroyEventCount = 0;

      s.on('destroy', (e) => {
        ++destroyEventCount;
        assert.deepEqual(e, { type: 'destroy' });
      });

      s.destroy();

      assert.equal(destroyEventCount, 1);

      el.remove();
    });
  });
}
