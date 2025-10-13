import { assert } from 'chai';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';

export function eventEnd() {
  describe('end', () => {
    it('should be triggered on drag end', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const endEvent = {
        type: 'end',
        x: 0,
        y: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
      };

      let endEventCount = 0;

      s.on('end', (e) => {
        assert.deepEqual(e, endEvent);
        ++endEventCount;
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(endEvent.srcEvent);

      assert.equal(endEventCount, 1);

      el.remove();
      s.destroy();
    });
  });
}
