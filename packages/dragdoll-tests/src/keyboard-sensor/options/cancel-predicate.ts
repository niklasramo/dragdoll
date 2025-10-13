import { assert } from 'chai';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';

export function optionCancelPredicate() {
  describe('cancelPredicate', () => {
    it('should define the cancel predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        cancelPredicate: (e, sensor) => {
          assert.equal(e.type, 'keydown');
          assert.equal(sensor, s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag is not canceled if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      assert.notEqual(s.drag, null);

      // Make sure the drag is not canceled if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      assert.notEqual(s.drag, null);

      // Make sure the drag is canceled if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      assert.equal(s.drag, null);

      el.remove();
      s.destroy();
    });

    it(`should cancel drag with Escape by default`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const srcEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      document.dispatchEvent(srcEvent);
      assert.equal(s.drag, null);

      s.destroy();
      el.remove();
    });
  });
}
