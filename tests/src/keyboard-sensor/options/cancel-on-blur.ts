import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { blurElement } from '../../utils/blur-element.js';
import { wait } from '../../utils/wait.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function optionCancelOnBlur() {
  describe('cancelOnBlur', () => {
    it('should cancel drag on blur when true', async () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { cancelOnBlur: true });

      // Make sure the cancelOnBlur property is set correctly.
      assert.equal(s['_cancelOnBlur'], true);

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
      assert.notEqual(s.drag, null);

      // Blur the sensor element.
      blurElement(el);

      // The blur canceling is done asynchronously. We need to wait a bit.
      await wait(1);

      // Make sure drag is canceled, not ended.
      assert.equal(s.drag, null);
      assert.equal(cancelEvents, 1);
      assert.equal(endEvents, 0);

      el.remove();
      s.destroy();
    });

    it('should not cancel drag on blur when false', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { cancelOnBlur: false });

      // Make sure the cancelOnBlur property is set correctly.
      assert.equal(s['_cancelOnBlur'], false);

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag is started.
      assert.notEqual(s.drag, null);

      // Blur the sensor element.
      blurElement(el);

      // Make sure drag is not canceled.
      assert.notEqual(s.drag, null);

      el.remove();
      s.destroy();
    });
  });
}
