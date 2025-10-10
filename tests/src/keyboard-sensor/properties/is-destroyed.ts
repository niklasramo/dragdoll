import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { focusElement } from '../../utils/focus-element.js';

export function propIsDestroyed() {
  describe('isDestroyed', () => {
    it(`should be false on init`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.isDestroyed, false);
      el.remove();
      s.destroy();
    });

    it(`should be true after destroy method is called`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      s.destroy();
      assert.equal(s.isDestroyed, true);
      el.remove();
    });

    it(`should prevent drag from starting when true`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      // Destroy the sensor.
      s.destroy();

      // Try start dragging.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Drag should not start.
      assert.equal(s.drag, null);

      // Remove the element.
      el.remove();
    });
  });
}
