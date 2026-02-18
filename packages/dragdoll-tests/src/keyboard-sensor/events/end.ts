import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('end', () => {
    defaultSetup();

    it('should be triggered on drag end', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const endEvent = {
        type: 'end' as const,
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
      };

      let endEventCount = 0;

      s.on('end', (e) => {
        expectWithContext(e, 'end event data').toStrictEqual(endEvent);
        ++endEventCount;
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(endEvent.srcEvent);

      expectWithContext(endEventCount, 'end event count').toBe(1);

      el.remove();
      s.destroy();
    });
  });
};
