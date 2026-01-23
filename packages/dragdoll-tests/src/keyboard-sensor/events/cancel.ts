import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('cancel', () => {
    defaultSetup();

    it('should be triggered on drag cancel', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const cancelEvent = {
        type: 'cancel',
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'Escape' }),
      } as const;

      let cancelEventCount = 0;

      s.on('cancel', (e) => {
        expectWithContext(e, 'cancel event data').toStrictEqual(cancelEvent);
        ++cancelEventCount;
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(cancelEvent.srcEvent);

      expectWithContext(cancelEventCount, 'cancel event count').toBe(1);

      el.remove();
      s.destroy();
    });
  });
};
