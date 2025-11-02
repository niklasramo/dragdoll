import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
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
      expect(events).toStrictEqual([]);

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
          expect(s.drag).not.toBe(null);
          expect(s.isDestroyed).toBe(true);
          expect(data).toStrictEqual({
            type: 'cancel',
            x: s.drag!.x,
            y: s.drag!.y,
          });
          events.push(data.type);
        });
        s.on('destroy', (data) => {
          expect(s.drag).toBe(null);
          expect(s.isDestroyed).toBe(true);
          expect(data).toStrictEqual({ type: 'destroy' });
          events.push(data.type);
        });

        // Make sure all listeners are set.
        expect(s['_emitter'].listenerCount()).toBe(5);

        // Start dragging
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Destroy the sensor
        s.destroy();

        // Delete the element
        el.remove();

        // Drag data should be reset.
        expect(s.drag).toBe(null);

        // isDestroyed should be true.
        expect(s.isDestroyed).toBe(true);

        // Only the "start", "cancel" and "destroy" events should be emitted.
        expect(events).toStrictEqual(['start', 'cancel', 'destroy']);

        // All listeners should be removed.
        expect(s['_emitter'].listenerCount()).toBe(0);
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
          expect(s.drag).toBe(null);
          expect(s.isDestroyed).toBe(true);
          expect(data).toStrictEqual({ type: 'destroy' });
          events.push(data.type);
        });

        // Make sure all listeners are set.
        expect(s['_emitter'].listenerCount()).toBe(5);

        // Destroy the sensor
        s.destroy();

        // Delete the element
        el.remove();

        // Drag data should be reset.
        expect(s.drag).toBe(null);

        // isDestroyed should be true.
        expect(s.isDestroyed).toBe(true);

        // Only the "destroy" event should be emitted.
        expect(events).toStrictEqual(['destroy']);

        // All listeners should be removed.
        expect(s['_emitter'].listenerCount()).toBe(0);
      });
    });
  });
};
