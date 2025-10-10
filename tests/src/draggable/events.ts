import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function events() {
  describe('events', () => {
    it('should be called at the right time with the right arguments', async () => {
      let events: string[] = [];
      let currentKeyboardEvent: KeyboardEvent | null = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
      });

      draggable.on('preparestart', (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, 'start');
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events.push('preparestart');
      });

      draggable.on('start', (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, 'start');
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events.push('start');
      });

      draggable.on('preparemove', (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, 'move');
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events.push('preparemove');
      });

      draggable.on('move', (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0].type, 'move');
        assert.equal(args[0].srcEvent, currentKeyboardEvent);
        events.push('move');
      });

      draggable.on('end', (...args) => {
        assert.equal(args.length, 1);
        assert.equal(args[0]?.type, 'end');
        // @ts-ignore
        assert.equal(args[0]?.srcEvent, currentKeyboardEvent);
        events.push('end');
      });

      draggable.on('destroy', (...args) => {
        assert.equal(args.length, 0);
        events.push('destroy');
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the events are called in the correct order.
      assert.deepEqual(events, ['preparestart', 'start']);

      // Reset events.
      events.length = 0;

      // Move the element to the right.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the events are called in the correct order.
      assert.deepEqual(events, ['preparemove', 'move']);

      // Reset events.
      events.length = 0;

      // End the drag.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      // Make sure the events are called in the correct order.
      assert.deepEqual(events, ['end']);

      // Reset events.
      events.length = 0;

      // Destroy the draggable.
      draggable.destroy();

      // Make sure the events are called in the correct order.
      assert.deepEqual(events, ['destroy']);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
