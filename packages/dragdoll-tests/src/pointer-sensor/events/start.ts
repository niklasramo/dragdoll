import { PointerSensor, type PointerSensorStartEvent } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('start', () => {
    defaultSetup();

    it(`should be triggered correctly on mousedown`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let startEvent: PointerSensorStartEvent | null = null;
      let sourceEvent: any;

      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          expectWithContext(false, 'start triggered multiple times').toBe(true);
        }
      });

      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
          onAfterStep: (e) => {
            if (e.type === 'mousedown') {
              sourceEvent = e;
            }
          },
        },
      );

      const { srcEvent, ...restOfStartEvent } = startEvent!;
      expectWithContext(restOfStartEvent, 'mousedown start event data').toStrictEqual({
        type: 'start',
        target: el,
        pointerId: -1,
        pointerType: 'mouse',
        startX: 1,
        startY: 1,
        x: 1,
        y: 1,
        deltaX: 0,
        deltaY: 0,
      });
      expectWithContext(srcEvent, 'mousedown srcEvent').toBe(sourceEvent);

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on pointerdown`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'pointer' });
      let startEvent: PointerSensorStartEvent | null = null;
      let sourceEvent: any;

      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          expectWithContext(false, 'start triggered multiple times').toBe(true);
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
          onAfterStep: (e) => {
            if (e.type === 'pointerdown') {
              sourceEvent = e;
            }
          },
        },
      );

      const { srcEvent, ...restOfStartEvent } = startEvent!;
      expectWithContext(restOfStartEvent, 'pointerdown start event data').toStrictEqual({
        type: 'start',
        target: el,
        pointerId: sourceEvent.pointerId,
        pointerType: sourceEvent.pointerType,
        startX: 1,
        startY: 1,
        x: 1,
        y: 1,
        deltaX: 0,
        deltaY: 0,
      });
      expectWithContext(srcEvent, 'pointerdown srcEvent').toBe(sourceEvent);

      s.destroy();
      el.remove();
    });

    it(`should be triggered correctly on touchstart`, async () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'touch' });
      let startEvent: PointerSensorStartEvent | null = null;
      let sourceEvent: any;

      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          expectWithContext(false, 'start triggered multiple times').toBe(true);
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
          onAfterStep: (e) => {
            if (e.type === 'touchstart') {
              sourceEvent = e;
            }
          },
        },
      );

      const { srcEvent, ...restOfStartEvent } = startEvent!;
      expectWithContext(restOfStartEvent, 'touchstart start event data').toStrictEqual({
        type: 'start',
        target: el,
        pointerId: sourceEvent.changedTouches[0].identifier,
        pointerType: 'touch',
        startX: 1,
        startY: 1,
        x: 1,
        y: 1,
        deltaX: 0,
        deltaY: 0,
      });
      expectWithContext(srcEvent, 'touchstart srcEvent').toBe(sourceEvent);

      s.destroy();
      el.remove();
    });
  });
};
