import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('isDestroyed', () => {
    defaultSetup();

    it(`should be false on init`, () => {
      const s = new PointerSensor(document.body);
      expect(s.isDestroyed).toBe(false);
      s.destroy();
    });

    it(`should be true after destroy method is called`, () => {
      const s = new PointerSensor(document.body);
      s.destroy();
      expect(s.isDestroyed).toBe(true);
    });

    it(`should prevent drag from starting when true`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });

      s.destroy();

      const fakeDrag = createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: () => {
            expect(s.drag).toBe(null);
          },
        },
      );

      expect(s.drag).toBe(null);

      await fakeDrag;

      el.remove();
    });
  });
};
