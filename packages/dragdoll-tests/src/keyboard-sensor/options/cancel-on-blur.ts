import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { blurElement } from '../../utils/blur-element.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';
import { wait } from '../../utils/wait.js';

export default () => {
  describe('cancelOnBlur', () => {
    defaultSetup();

    it('should cancel drag on blur when true', async () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { cancelOnBlur: true });

      // Make sure the cancelOnBlur property is set correctly.
      expect(s['_cancelOnBlur']).toBe(true);

      // Count cancel events.
      let cancelEvents = 0;
      s.on('cancel', () => {
        ++cancelEvents;
      });

      // Count end events.
      let endEvents = 0;
      s.on('end', () => {
        ++endEvents;
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag is started.
      expect(s.drag).not.toBe(null);

      // Blur the sensor element.
      blurElement(el);

      // The blur canceling is done asynchronously. We need to wait a bit.
      await wait(1);

      // Make sure drag is canceled, not ended.
      expect(s.drag).toBe(null);
      expect(cancelEvents).toBe(1);
      expect(endEvents).toBe(0);

      el.remove();
      s.destroy();
    });

    it('should not cancel drag on blur when false', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { cancelOnBlur: false });

      // Make sure the cancelOnBlur property is set correctly.
      expect(s['_cancelOnBlur']).toBe(false);

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag is started.
      expect(s.drag).not.toBe(null);

      // Blur the sensor element.
      blurElement(el);

      // Make sure drag is not canceled.
      expect(s.drag).not.toBe(null);

      el.remove();
      s.destroy();
    });
  });
};
