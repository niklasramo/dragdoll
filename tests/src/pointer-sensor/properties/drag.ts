import { assert } from 'chai';
import { PointerSensor } from '../../../../src/index.js';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';

export function propDrag() {
  describe('drag', () => {
    it(`should be null on init`, function () {
      const s = new PointerSensor(document.body);
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should contain drag data during drag`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });

      let dragEventCount = 0;

      createFakeDrag(
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
              assert.deepEqual(s.drag, {
                pointerId: 1,
                pointerType: 'touch',
                x: 1,
                y: 1,
              });
            } else if (e.type === 'move') {
              assert.deepEqual(s.drag, {
                pointerId: 1,
                pointerType: 'touch',
                x: 2,
                y: 2,
              });
            } else if (e.type === 'end') {
              assert.equal(s.drag, null);
            }
          },
        },
      );

      assert.equal(dragEventCount, 3);

      s.destroy();
      el.remove();
    });
  });
}
