import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function methodCancel() {
  describe('cancel', () => {
    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let events: string[] = [];

      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('destroy', (data) => void events.push(data.type));
      s.on('cancel', (data) => {
        assert.deepEqual(data, {
          type: 'cancel',
          x: s.drag!.x,
          y: s.drag!.y,
        });
        events.push(data.type);
      });

      // Start dragging.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag started.
      assert.notEqual(s.drag, null);

      // Cancel dragging.
      s.cancel();

      // Make sure drag stopped.
      assert.equal(s.drag, null);

      // Assert events.
      assert.deepEqual(events, ['start', 'cancel']);

      // Destroy sensor and element.
      s.destroy();
      el.remove();
    });

    it(`should not do anything if drag is not active`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let events: string[] = [];

      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('destroy', (data) => void events.push(data.type));
      s.on('cancel', (data) => void events.push(data.type));

      // Cancel dragging.
      s.cancel();

      // Assert events.
      assert.deepEqual(events, []);

      // Destroy sensor and element.
      s.destroy();
      el.remove();
    });
  });
}
