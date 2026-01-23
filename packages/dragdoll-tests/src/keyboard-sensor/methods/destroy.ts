import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('destroy', () => {
    defaultSetup();

    it('should allow destroying only once', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const events: string[] = [];

      // Destroy the sensor.
      s.destroy();

      // Try to bind a new destroy listener.
      s.on('destroy', (data) => void events.push(data.type));

      // Try destroy the sensor again.
      s.destroy();

      // There should be no events.
      expectWithContext(events, 'no events on double destroy').toStrictEqual([]);

      // Delete the element
      el.remove();
    });

    describe('if drag active', () => {
      it(`should set isDestroyed property to true, emit "cancel" event with the current x/y coordinates, reset drag data, emit "destroy" event and remove all listeners`, () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        const events: string[] = [];

        s.on('start', (data) => void events.push(data.type));
        s.on('move', (data) => void events.push(data.type));
        s.on('end', (data) => void events.push(data.type));
        s.on('cancel', (data) => {
          expectWithContext(s.drag, 'drag exists in cancel callback').not.toBe(null);
          expectWithContext(s.isDestroyed, 'isDestroyed in cancel callback').toBe(true);
          expectWithContext(data, 'cancel event data').toStrictEqual({
            type: 'cancel',
            startX: s.drag!.startX,
            startY: s.drag!.startY,
            x: s.drag!.x,
            y: s.drag!.y,
            deltaX: s.drag!.deltaX,
            deltaY: s.drag!.deltaY,
          });
          events.push(data.type);
        });
        s.on('destroy', (data) => {
          expectWithContext(s.drag, 'drag null in destroy callback').toBe(null);
          expectWithContext(s.isDestroyed, 'isDestroyed in destroy callback').toBe(true);
          expectWithContext(data, 'destroy event data').toStrictEqual({ type: 'destroy' });
          events.push(data.type);
        });

        // Make sure all listeners are set.
        expectWithContext(s['_emitter'].listenerCount(), 'listener count before').toBe(5);

        // Start dragging
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Destroy the sensor
        s.destroy();

        // Delete the element
        el.remove();

        // Drag data should be reset.
        expectWithContext(s.drag, 'drag null after destroy').toBe(null);

        // isDestroyed should be true.
        expectWithContext(s.isDestroyed, 'isDestroyed after destroy').toBe(true);

        // Only the "start", "cancel" and "destroy" events should be emitted.
        expectWithContext(events, 'events emitted').toStrictEqual(['start', 'cancel', 'destroy']);

        // All listeners should be removed.
        expectWithContext(s['_emitter'].listenerCount(), 'listener count after').toBe(0);
      });
    });

    describe('if drag is not active', () => {
      it(`should set isDestroyed property to true, emit "destroy" event and remove all listeners`, () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        const events: string[] = [];

        s.on('start', (data) => void events.push(data.type));
        s.on('move', (data) => void events.push(data.type));
        s.on('end', (data) => void events.push(data.type));
        s.on('cancel', (data) => void events.push(data.type));
        s.on('destroy', (data) => {
          expectWithContext(s.drag, 'drag null in destroy callback').toBe(null);
          expectWithContext(s.isDestroyed, 'isDestroyed in destroy callback').toBe(true);
          expectWithContext(data, 'destroy event data').toStrictEqual({ type: 'destroy' });
          events.push(data.type);
        });

        // Make sure all listeners are set.
        expectWithContext(s['_emitter'].listenerCount(), 'listener count before').toBe(5);

        // Destroy the sensor
        s.destroy();

        // Delete the element
        el.remove();

        // Drag data should be reset.
        expectWithContext(s.drag, 'drag null after destroy').toBe(null);

        // isDestroyed should be true.
        expectWithContext(s.isDestroyed, 'isDestroyed after destroy').toBe(true);

        // Only the "destroy" event should be emitted.
        expectWithContext(events, 'events emitted').toStrictEqual(['destroy']);

        // All listeners should be removed.
        expectWithContext(s['_emitter'].listenerCount(), 'listener count after').toBe(0);
      });
    });
  });
};
