import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('isDestroyed', () => {
    defaultSetup();

    it(`should be false on init`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      expect(s.isDestroyed).toBe(false);
      el.remove();
      s.destroy();
    });

    it(`should be true after destroy method is called`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      s.destroy();
      expect(s.isDestroyed).toBe(true);
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
      expect(s.drag).toBe(null);

      // Remove the element.
      el.remove();
    });
  });
};
