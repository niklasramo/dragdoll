import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('destroy', () => {
    defaultSetup();

    it('should be triggered on destroy', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      let destroyEventCount = 0;
      s.on('destroy', (e) => {
        expect(e).toStrictEqual({ type: 'destroy' });
        ++destroyEventCount;
      });

      s.destroy();

      expect(destroyEventCount).toBe(1);

      el.remove();
    });
  });
};
