import { assert } from 'chai';
import { PointerSensor } from '../../../../src/index.js';

export function optionStartPredicate() {
  describe('startPredicate', () => {
    it('should allow start only when e.button is 0 by default', function () {
      const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });

      document.body.dispatchEvent(new MouseEvent('mousedown', { button: 1 }));
      assert.equal(s.drag, null);

      document.body.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      assert.notEqual(s.drag, null);

      s.destroy();
    });

    it('should allow start when true is returned and prevent start when false is returned', function () {
      const s1 = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => true,
      });
      const s2 = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s1.drag, null);
      assert.equal(s2.drag, null);

      s1.destroy();
      s2.destroy();
    });
  });
}
