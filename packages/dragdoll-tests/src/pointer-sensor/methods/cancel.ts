import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { PointerSensor } from 'dragdoll/sensors/pointer';

export function methodCancel() {
  describe('cancel', () => {
    it(`should cancel active drag forcefully`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let cancelEventCount = 0;

      s.on('cancel', () => {
        ++cancelEventCount;
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          onAfterStep: () => {
            assert.notEqual(s.drag, null);
            s.cancel();
          },
        },
      );

      assert.equal(s.drag, null);
      assert.equal(cancelEventCount, 1);

      s.destroy();
      el.remove();
    });
  });
}
