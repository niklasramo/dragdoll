import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('off', () => {
    defaultSetup();

    it('should remove an event listener based on id', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let msg = '';

      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(msg).toBe('b');

      s.destroy();
      el.remove();
    });
  });
};
