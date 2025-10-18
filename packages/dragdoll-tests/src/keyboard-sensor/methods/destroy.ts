import { assert } from 'chai';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';

export function methodDestroy() {
  describe('destroy', () => {
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
      assert.deepEqual(events, []);

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
          assert.notEqual(s.drag, null);
          assert.equal(s.isDestroyed, true);
          assert.deepEqual(data, {
            type: 'cancel',
            x: s.drag!.x,
            y: s.drag!.y,
          });
          events.push(data.type);
        });
        s.on('destroy', (data) => {
          assert.equal(s.drag, null);
          assert.equal(s.isDestroyed, true);
          assert.deepEqual(data, { type: 'destroy' });
          events.push(data.type);
        });

        // Make sure all listeners are set.
        assert.equal(s['_emitter'].listenerCount(), 5);

        // Start dragging
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Destroy the sensor
        s.destroy();

        // Delete the element
        el.remove();

        // Drag data should be reset.
        assert.equal(s.drag, null);

        // isDestroyed should be true.
        assert.equal(s.isDestroyed, true);

        // Only the "start", "cancel" and "destroy" events should be emitted.
        assert.deepEqual(events, ['start', 'cancel', 'destroy']);

        // All listeners should be removed.
        assert.equal(s['_emitter'].listenerCount(), 0);
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
          assert.equal(s.drag, null);
          assert.equal(s.isDestroyed, true);
          assert.deepEqual(data, { type: 'destroy' });
          events.push(data.type);
        });

        // Make sure all listeners are set.
        assert.equal(s['_emitter'].listenerCount(), 5);

        // Destroy the sensor
        s.destroy();

        // Delete the element
        el.remove();

        // Drag data should be reset.
        assert.equal(s.drag, null);

        // isDestroyed should be true.
        assert.equal(s.isDestroyed, true);

        // Only the "destroy" event should be emitted.
        assert.deepEqual(events, ['destroy']);

        // All listeners should be removed.
        assert.equal(s['_emitter'].listenerCount(), 0);
      });
    });
  });
}
