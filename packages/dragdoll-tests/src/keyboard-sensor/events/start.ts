import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('start', () => {
    defaultSetup();

    it(`should be triggered on drag start`, () => {
      const el = createTestElement({ left: '10px', top: '20px' });
      const s = new KeyboardSensor(el);
      const expectedEvent = {
        type: 'start' as const,
        startX: 10,
        startY: 20,
        x: 10,
        y: 20,
        deltaX: 0,
        deltaY: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
      };

      let startEventCount = 0;

      s.on('start', (e) => {
        expectWithContext(e, 'start event data').toStrictEqual(expectedEvent);
        ++startEventCount;
      });

      focusElement(el);
      document.dispatchEvent(expectedEvent.srcEvent);

      expectWithContext(startEventCount, 'start event count').toBe(1);

      el.remove();
      s.destroy();
    });
  });
};
