import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('drag', () => {
    defaultSetup();

    it(`should be null on init`, () => {
      const s = new PointerSensor(document.body);
      expectWithContext(s.drag, 'drag null on init').toBe(null);
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
              expectWithContext(s.drag, 'drag data on start').toStrictEqual({
                pointerId: 1,
                pointerType: 'touch',
                startX: 1,
                startY: 1,
                x: 1,
                y: 1,
                deltaX: 0,
                deltaY: 0,
              });
            } else if (e.type === 'move') {
              expectWithContext(s.drag, 'drag data on move').toStrictEqual({
                pointerId: 1,
                pointerType: 'touch',
                startX: 1,
                startY: 1,
                x: 2,
                y: 2,
                deltaX: 1,
                deltaY: 1,
              });
            } else if (e.type === 'end') {
              expectWithContext(s.drag, 'drag null on end').toBe(null);
            }
          },
        },
      );

      expectWithContext(dragEventCount, 'drag event count').toBe(3);

      s.destroy();
      el.remove();
    });
  });
};
