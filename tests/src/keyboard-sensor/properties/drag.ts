import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function propDrag() {
  describe('drag', () => {
    it(`should be null on init`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.drag, null);
      el.remove();
      s.destroy();
    });

    it(`should be null after destroy method is called`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.notEqual(s.drag, null);

      s.destroy();
      assert.equal(s.drag, null);

      el.remove();
    });

    it(`should match the current drag position`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 1 });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.deepEqual(s.drag, { x: 1, y: 0 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      assert.deepEqual(s.drag, { x: 1, y: 1 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      assert.deepEqual(s.drag, { x: 0, y: 1 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      assert.deepEqual(s.drag, { x: 0, y: 0 });

      s.destroy();
      el.remove();
    });
  });
}
