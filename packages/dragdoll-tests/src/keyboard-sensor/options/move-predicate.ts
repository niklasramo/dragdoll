import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function optionMovePredicate() {
  describe('movePredicate', () => {
    it('should define the move predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        movePredicate: (e, sensor) => {
          assert.equal(e.type, 'keydown');
          assert.equal(sensor, s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag does not move if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      // Make sure the drag does not move if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      // Make sure the drag moves if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.deepEqual(s.drag, returnValue);

      el.remove();
      s.destroy();
    });

    it(`should move drag with arrow keys by default`, function () {
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { moveDistance: 1 });
        const srcEvent = new KeyboardEvent('keydown', { key });

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        document.dispatchEvent(srcEvent);

        switch (key) {
          case 'ArrowLeft':
            assert.deepEqual(s.drag, { x: -1, y: 0 });
            break;
          case 'ArrowRight':
            assert.deepEqual(s.drag, { x: 1, y: 0 });
            break;
          case 'ArrowUp':
            assert.deepEqual(s.drag, { x: 0, y: -1 });
            break;
          case 'ArrowDown':
            assert.deepEqual(s.drag, { x: 0, y: 1 });
            break;
        }

        s.destroy();
        el.remove();
      });
    });
  });
}
