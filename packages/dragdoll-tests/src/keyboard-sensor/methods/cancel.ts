import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('cancel', () => {
    defaultSetup();

    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const events: string[] = [];

      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('destroy', (data) => void events.push(data.type));
      s.on('cancel', (data) => {
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

      // Start dragging.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag started.
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      // Cancel dragging.
      s.cancel();

      // Make sure drag stopped.
      expectWithContext(s.drag, 'drag stopped').toBe(null);

      // Assert events.
      expectWithContext(events, 'events emitted').toStrictEqual(['start', 'cancel']);

      // Destroy sensor and element.
      s.destroy();
      el.remove();
    });

    it(`should not do anything if drag is not active`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const events: string[] = [];

      s.on('start', (data) => void events.push(data.type));
      s.on('move', (data) => void events.push(data.type));
      s.on('end', (data) => void events.push(data.type));
      s.on('destroy', (data) => void events.push(data.type));
      s.on('cancel', (data) => void events.push(data.type));

      // Cancel dragging.
      s.cancel();

      // Assert events.
      expectWithContext(events, 'no events emitted').toStrictEqual([]);

      // Destroy sensor and element.
      s.destroy();
      el.remove();
    });
  });
};
