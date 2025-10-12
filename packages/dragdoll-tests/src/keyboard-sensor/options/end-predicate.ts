import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function optionEndPredicate() {
  describe('endPredicate', () => {
    it('should define the end predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        endPredicate: (e, sensor) => {
          assert.equal(e.type, 'keydown');
          assert.equal(sensor, s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag is not ended if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.notEqual(s.drag, null);

      // Make sure the drag is not ended if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.notEqual(s.drag, null);

      // Make sure the drag is ended if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.equal(s.drag, null);

      el.remove();
      s.destroy();
    });

    it(`should end drag with Enter and Space by default when the target element is focused`, function () {
      ['Enter', ' '].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        assert.equal(s.drag, null);

        s.destroy();
        el.remove();
      });
    });
  });
}
