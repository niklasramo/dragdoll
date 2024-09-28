import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function optionMoveDistance() {
  describe('moveDistance', () => {
    it('should define the drag movement distance', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: { x: 7, y: 9 } });

      // Make sure the moveDistance property is set correctly.
      assert.deepEqual(s.moveDistance, { x: 7, y: 9 });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag position is at 0,0.
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      // Move to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      // Make sure drag position is at 7,0.
      assert.deepEqual(s.drag, { x: 7, y: 0 });

      // Move down.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // Make sure drag position is at 7,9.
      assert.deepEqual(s.drag, { x: 7, y: 9 });

      // Move left.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      // Make sure drag position is at 0,9.
      assert.deepEqual(s.drag, { x: 0, y: 9 });

      // Move up.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      // Make sure drag position is at 0,0.
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      el.remove();
      s.destroy();
    });
  });
}
