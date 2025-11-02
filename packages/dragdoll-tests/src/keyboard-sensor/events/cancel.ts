import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('cancel', () => {
    defaultSetup();

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
        expect(e).toStrictEqual(cancelEvent);
        ++cancelEventCount;
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(cancelEvent.srcEvent);

      expect(cancelEventCount).toBe(1);

      el.remove();
      s.destroy();
    });
  });
};
