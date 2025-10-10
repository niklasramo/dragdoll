import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { PointerSensor, type PointerSensorEndEvent } from 'dragdoll/sensors/pointer';

export function eventEnd() {
  describe('end', () => {
    it(`should be triggered correctly on mouseup`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let endEvent: PointerSensorEndEvent | null = null;
      let sourceEvent: any;

      s.on('end', (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail('end event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'mouseup') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(endEvent, {
        type: 'end',
        srcEvent: sourceEvent,
        target: el,
        pointerId: -1,
        pointerType: 'mouse',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on pointerup`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let endEvent: PointerSensorEndEvent | null = null;
      let sourceEvent: any;

      s.on('end', (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail('end event listener called twice');
        }
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
          onAfterStep: (e) => {
            if (e.type === 'pointerup') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(endEvent, {
        type: 'end',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on touchend`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let endEvent: PointerSensorEndEvent | null = null;
      let sourceEvent: any;

      s.on('end', (e) => {
        if (endEvent === null) {
          endEvent = e;
        } else {
          assert.fail('end event listener called twice');
        }
      });

      createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'touchend') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(endEvent, {
        type: 'end',
        srcEvent: sourceEvent,
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: 'touch',
        x: 2,
        y: 2,
      });

      s.destroy();
      el.remove();
    });
  });
}
