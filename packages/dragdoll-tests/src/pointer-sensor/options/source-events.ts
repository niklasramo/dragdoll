import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createFakeDrag } from '../../utils/create-fake-drag.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('sourceEvents', () => {
    defaultSetup();

    it('should listen to mouse/pointer/touch events when set to "mouse"/"pointer"/"touch"', async () => {
      const mouseSensor = new PointerSensor(document.body, { sourceEvents: 'mouse' });
      const pointerSensor = new PointerSensor(document.body, { sourceEvents: 'pointer' });
      const touchSensor = new PointerSensor(document.body, { sourceEvents: 'touch' });

      const mouseList: string[] = [];
      const pointerList: string[] = [];
      const touchList: string[] = [];

      mouseSensor.on('start', (e) => mouseList.push(e.type));
      mouseSensor.on('move', (e) => mouseList.push(e.type));
      mouseSensor.on('end', (e) => mouseList.push(e.type));

      pointerSensor.on('start', (e) => pointerList.push(e.type));
      pointerSensor.on('move', (e) => pointerList.push(e.type));
      pointerSensor.on('end', (e) => pointerList.push(e.type));

      touchSensor.on('start', (e) => touchList.push(e.type));
      touchSensor.on('move', (e) => touchList.push(e.type));
      touchSensor.on('end', (e) => touchList.push(e.type));

      // Simulate mouse events...
      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'mouse',
          stepDuration: 0,
        },
      );

      // ...which should trigger only mouse sensor events.
      expect(mouseList).toStrictEqual(['start', 'move', 'end']);
      expect(pointerList).toStrictEqual([]);
      expect(touchList).toStrictEqual([]);

      // Reset mouse list.
      mouseList.length = 0;

      // Simulate pointer events...
      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'pointer',
          stepDuration: 0,
        },
      );

      // ...which should trigger only pointer sensor events.
      expect(mouseList).toStrictEqual([]);
      expect(pointerList).toStrictEqual(['start', 'move', 'end']);
      expect(touchList).toStrictEqual([]);

      // Reset pointer list.
      pointerList.length = 0;

      // Simulate touch events...
      await createFakeDrag(
        [
          { x: 1, y: 1 },
          { x: 2, y: 2 },
          { x: 2, y: 2 },
        ],
        {
          eventType: 'touch',
          stepDuration: 0,
        },
      );

      // ...which should trigger only touch sensor events.
      expect(mouseList).toStrictEqual([]);
      expect(pointerList).toStrictEqual([]);
      expect(touchList).toStrictEqual(['start', 'move', 'end']);

      mouseSensor.destroy();
      pointerSensor.destroy();
      touchSensor.destroy();
    });
  });
};
