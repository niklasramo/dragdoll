import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { PointerSensor } from 'dragdoll/sensors/pointer';

export function methodDestroy() {
  describe('destroy', () => {
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

      assert.equal(s.isDestroyed, true);
      assert.equal(destroyEventCount, 1);
      assert.equal(cancelEventCount, 0);

      el.remove();
    });

    it(`should destroy the sensor during drag`, () => {
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
            s.destroy();
          },
        },
      );

      assert.equal(s.drag, null);
      assert.equal(s.isDestroyed, true);
      assert.equal(destroyEventCount, 1);
      assert.equal(cancelEventCount, 1);

      el.remove();
    });
  });
}
