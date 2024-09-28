import { assert } from 'chai';
import { PointerSensor } from '../../../../src/index.js';

export function methodUpdateSettings() {
  describe('updateSettings', () => {
    it(`should update startPredicate setting`, function () {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.equal(s.drag, null);

      s.updateSettings({ startPredicate: () => true });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
    });

    it(`should update sourceEvents setting`, function () {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'pointer',
        startPredicate: () => true,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.equal(s.drag, null);

      s.updateSettings({ sourceEvents: 'mouse' });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
    });
  });
}
