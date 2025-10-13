import { assert } from 'chai';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';

export function eventStart() {
  describe('start', () => {
    it(`should be triggered on drag start`, function () {
      const el = createTestElement({ left: '10px', top: '20px' });
      const s = new KeyboardSensor(el);
      const expectedEvent = {
        type: 'start',
        x: 10,
        y: 20,
        srcEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
      };

      let startEventCount = 0;

      s.on('start', (e) => {
        assert.deepEqual(e, expectedEvent);
        ++startEventCount;
      });

      focusElement(el);
      document.dispatchEvent(expectedEvent.srcEvent);

      assert.equal(startEventCount, 1);

      el.remove();
      s.destroy();
    });
  });
}
