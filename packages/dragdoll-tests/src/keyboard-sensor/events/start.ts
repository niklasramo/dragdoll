import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('start', () => {
    defaultSetup();

    it(`should be triggered on drag start`, () => {
      const el = createTestElement({ left: '10px', top: '20px' });
      const s = new KeyboardSensor(el);
      const expectedEvent = {
        type: 'start',
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
        expect(e).toStrictEqual(expectedEvent);
        ++startEventCount;
      });

      focusElement(el);
      document.dispatchEvent(expectedEvent.srcEvent);

      expect(startEventCount).toBe(1);

      el.remove();
      s.destroy();
    });
  });
};
