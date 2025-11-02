import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('destroy', () => {
    defaultSetup();

    it(`should destroy the sensor`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let cancelEventCount = 0;
      let destroyEventCount = 0;

      s.on('cancel', () => {
        ++cancelEventCount;
      });
      s.on('destroy', () => {
        ++destroyEventCount;
      });

      s.destroy();

      expect(s.isDestroyed).toBe(true);
      expect(destroyEventCount).toBe(1);
      expect(cancelEventCount).toBe(0);

      el.remove();
    });

    it(`should destroy the sensor during drag`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let cancelEventCount = 0;
      let destroyEventCount = 0;

      s.on('cancel', () => {
        ++cancelEventCount;
      });
      s.on('destroy', () => {
        ++destroyEventCount;
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
            s.destroy();
          },
        },
      );

      expect(s.drag).toBe(null);
      expect(s.isDestroyed).toBe(true);
      expect(destroyEventCount).toBe(1);
      expect(cancelEventCount).toBe(1);

      await fakeDrag;

      el.remove();
    });
  });
};
