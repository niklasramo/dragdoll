import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function eventCancel() {
  describe('cancel', () => {
    it('should be triggered on drag cancel', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const cancelEvent = {
        type: 'cancel',
        x: 0,
        y: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'Escape' }),
      } as const;

      let cancelEventCount = 0;

      s.on('cancel', (e) => {
        assert.deepEqual(e, cancelEvent);
        ++cancelEventCount;
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(cancelEvent.srcEvent);

      assert.equal(cancelEventCount, 1);

      el.remove();
      s.destroy();
    });
  });
}
