import { assert } from 'chai';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';

export function propIsDestroyed() {
  describe('isDestroyed', () => {
    it(`should be false on init`, function () {
      const s = new PointerSensor(document.body);
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should be true after destroy method is called`, function () {
      const s = new PointerSensor(document.body);
      s.destroy();
      assert.equal(s.isDestroyed, true);
    });

    it(`should prevent drag from starting when true`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });

      s.destroy();

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: () => {
            assert.equal(s.drag, null);
          },
        },
      );

      assert.equal(s.drag, null);

      el.remove();
    });
  });
}
