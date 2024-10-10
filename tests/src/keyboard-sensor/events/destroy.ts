import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function eventDestroy() {
  describe('destroy', () => {
    it('should be triggered on destroy', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      let destroyEventCount = 0;
      s.on('destroy', (e) => {
        assert.deepEqual(e, { type: 'destroy' });
        ++destroyEventCount;
      });

      s.destroy();

      assert.equal(destroyEventCount, 1);

      el.remove();
    });
  });
}
