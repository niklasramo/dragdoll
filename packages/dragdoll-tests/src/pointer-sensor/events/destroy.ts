import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('destroy', () => {
    defaultSetup();

    it(`should be triggered on destroy`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el);

      let destroyEventCount = 0;

      s.on('destroy', (e) => {
        ++destroyEventCount;
        expect(e).toStrictEqual({ type: 'destroy' });
      });

      s.destroy();

      expect(destroyEventCount).toBe(1);

      el.remove();
    });
  });
};
