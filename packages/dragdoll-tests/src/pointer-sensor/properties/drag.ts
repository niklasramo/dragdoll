import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('drag', () => {
    defaultSetup();

    it(`should be null on init`, () => {
      const s = new PointerSensor(document.body);
      expect(s.drag).toBe(null);
      s.destroy();
    });

    it(`should contain drag data during drag`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });

      let dragEventCount = 0;

      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          pointerId: 1,
          pointerType: 'touch',
          stepDuration: 0,
          onAfterStep: (e) => {
            ++dragEventCount;
            if (e.type === 'start') {
              expect(s.drag).toStrictEqual({
                pointerId: 1,
                pointerType: 'touch',
                x: 1,
                y: 1,
              });
            } else if (e.type === 'move') {
              expect(s.drag).toStrictEqual({
                pointerId: 1,
                pointerType: 'touch',
                x: 2,
                y: 2,
              });
            } else if (e.type === 'end') {
              expect(s.drag).toBe(null);
            }
          },
        },
      );

      expect(dragEventCount).toBe(3);

      s.destroy();
      el.remove();
    });
  });
};
