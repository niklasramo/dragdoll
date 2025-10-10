import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function optionCallbacks() {
  describe('callbacks', () => {
    it('should be called at the right time with the right arguments', async () => {
      let events: string[] = [];
      let currentKeyboardEvent: KeyboardEvent | null = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onPrepareStart(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].startEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].prevMoveEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events.push('onPrepareStart');
        },
        onStart(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].startEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].prevMoveEvent.srcEvent, currentKeyboardEvent);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events.push('onStart');
        },
        onPrepareMove(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events.push('onPrepareMove');
        },
        onMove(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          assert.equal(args[0].moveEvent.srcEvent, currentKeyboardEvent);
          events.push('onMove');
        },
        onEnd(...args) {
          assert.equal(args.length, 2);
          assert.equal(args[0], draggable.drag);
          assert.equal(args[1], draggable);
          // @ts-ignore
          assert.equal(args[0].endEvent?.srcEvent, currentKeyboardEvent);
          events.push('onEnd');
        },
        onDestroy(...args) {
          assert.equal(args.length, 1);
          assert.equal(args[0], draggable);
          events.push('onDestroy');
        },
      });

      draggable.on('preparestart', () => {
        events.push('preparestart');
      });

      draggable.on('start', () => {
        events.push('start');
      });

      draggable.on('preparemove', () => {
        events.push('preparemove');
      });

      draggable.on('move', () => {
        events.push('move');
      });

      draggable.on('end', () => {
        events.push('end');
      });

      draggable.on('destroy', () => {
        events.push('destroy');
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the callbacks and events are called in the correct order.
      assert.deepEqual(events, ['preparestart', 'onPrepareStart', 'start', 'onStart']);

      // Reset events.
      events.length = 0;

      // Move the element to the right.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the callbacks and events are called in the correct order.
      assert.deepEqual(events, ['preparemove', 'onPrepareMove', 'move', 'onMove']);

      // Reset events.
      events.length = 0;

      // End the drag.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      // Make sure the callbacks and events are called in the correct order.
      assert.deepEqual(events, ['end', 'onEnd']);

      // Reset events.
      events.length = 0;

      // Destroy the draggable.
      draggable.destroy();

      // Make sure the callbacks and events are called in the correct order.
      assert.deepEqual(events, ['destroy', 'onDestroy']);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
