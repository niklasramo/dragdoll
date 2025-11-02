import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('cancel', () => {
    defaultSetup();

    it(`should cancel active drag forcefully`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let cancelEventCount = 0;

      s.on('cancel', () => {
        ++cancelEventCount;
      });

      const fakeDrag = createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'pointerdown') {
              expect(s.drag).not.toBe(null);
            } else {
              expect(s.drag).toBe(null);
            }
            s.cancel();
          },
        },
      );

      expect(s.drag).toBe(null);
      expect(cancelEventCount).toBe(1);

      await fakeDrag;

      s.destroy();
      el.remove();
    });
  });
};
