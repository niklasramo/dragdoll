import { PointerSensor, type PointerSensorCancelEvent } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('cancel', () => {
    defaultSetup();

    it(`should be triggered correctly on pointercancel`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let cancelEvent: PointerSensorCancelEvent | null = null;
      let sourceEvent: any;

      s.on('cancel', (e) => {
        if (cancelEvent === null) {
          cancelEvent = e;
        } else {
          expect(false).toBe(true);
        }
      });

      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
          cancelAtEnd: true,
          onAfterStep: (e) => {
            if (e.type === 'pointercancel') {
              sourceEvent = e;
            }
          },
        },
      );

      expect(cancelEvent).toStrictEqual({
        type: 'cancel',
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

    it(`should be triggered correctly on touchcancel`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let cancelEvent: PointerSensorCancelEvent | null = null;
      let sourceEvent: any;

      s.on('cancel', (e) => {
        if (cancelEvent === null) {
          cancelEvent = e;
        } else {
          expect(false).toBe(true);
        }
      });

      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
          cancelAtEnd: true,
          onAfterStep: (e) => {
            if (e.type === 'touchcancel') {
              sourceEvent = e;
            }
          },
        },
      );

      expect(cancelEvent).toStrictEqual({
        type: 'cancel',
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
};
