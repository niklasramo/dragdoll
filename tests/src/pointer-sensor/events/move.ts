import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { PointerSensor, type PointerSensorMoveEvent } from 'dragdoll/sensors/pointer';

export function eventMove() {
  describe('move', () => {
    it(`should be triggered correctly on mousemove`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let moveEvent: PointerSensorMoveEvent | null = null;
      let sourceEvent: any;

      s.on('move', (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail('move event listener called twice');
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
            if (e.type === 'mousemove') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(moveEvent, {
        type: 'move',
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

    it(`should be triggered correctly on pointermove`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let moveEvent: PointerSensorMoveEvent | null = null;
      let sourceEvent: any;

      s.on('move', (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail('move event listener called twice');
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
            if (e.type === 'pointermove') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(moveEvent, {
        type: 'move',
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

    it(`should be triggered correctly on touchmove`, function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let moveEvent: PointerSensorMoveEvent | null = null;
      let sourceEvent: any;

      s.on('move', (e) => {
        if (moveEvent === null) {
          moveEvent = e;
        } else {
          assert.fail('start event listener called twice');
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
            if (e.type === 'touchmove') {
              sourceEvent = e;
            }
          },
        },
      );

      assert.deepEqual(moveEvent, {
        type: 'move',
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
