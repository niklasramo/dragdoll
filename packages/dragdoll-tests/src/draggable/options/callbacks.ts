import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('callbacks', () => {
    defaultSetup();

    it('should be called at the right time with the right arguments', async () => {
      const events: string[] = [];
      let currentKeyboardEvent: KeyboardEvent | null = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onPrepareStart(...args) {
          expectWithContext(args.length, 'onPrepareStart args.length').toBe(2);
          expectWithContext(args[0], 'onPrepareStart args[0]').toBe(draggable.drag);
          expectWithContext(args[1], 'onPrepareStart args[1]').toBe(draggable);
          expectWithContext(args[0].startEvent.srcEvent, 'onPrepareStart startEvent').toBe(
            currentKeyboardEvent,
          );
          expectWithContext(args[0].prevMoveEvent.srcEvent, 'onPrepareStart prevMoveEvent').toBe(
            currentKeyboardEvent,
          );
          expectWithContext(args[0].moveEvent.srcEvent, 'onPrepareStart moveEvent').toBe(
            currentKeyboardEvent,
          );
          events.push('onPrepareStart');
        },
        onStart(...args) {
          expectWithContext(args.length, 'onStart args.length').toBe(2);
          expectWithContext(args[0], 'onStart args[0]').toBe(draggable.drag);
          expectWithContext(args[1], 'onStart args[1]').toBe(draggable);
          expectWithContext(args[0].startEvent.srcEvent, 'onStart startEvent').toBe(
            currentKeyboardEvent,
          );
          expectWithContext(args[0].prevMoveEvent.srcEvent, 'onStart prevMoveEvent').toBe(
            currentKeyboardEvent,
          );
          expectWithContext(args[0].moveEvent.srcEvent, 'onStart moveEvent').toBe(
            currentKeyboardEvent,
          );
          events.push('onStart');
        },
        onPrepareMove(...args) {
          expectWithContext(args.length, 'onPrepareMove args.length').toBe(2);
          expectWithContext(args[0], 'onPrepareMove args[0]').toBe(draggable.drag);
          expectWithContext(args[1], 'onPrepareMove args[1]').toBe(draggable);
          expectWithContext(args[0].moveEvent.srcEvent, 'onPrepareMove moveEvent').toBe(
            currentKeyboardEvent,
          );
          events.push('onPrepareMove');
        },
        onMove(...args) {
          expectWithContext(args.length, 'onMove args.length').toBe(2);
          expectWithContext(args[0], 'onMove args[0]').toBe(draggable.drag);
          expectWithContext(args[1], 'onMove args[1]').toBe(draggable);
          expectWithContext(args[0].moveEvent.srcEvent, 'onMove moveEvent').toBe(
            currentKeyboardEvent,
          );
          events.push('onMove');
        },
        onEnd(...args) {
          expectWithContext(args.length, 'onEnd args.length').toBe(2);
          expectWithContext(args[0], 'onEnd args[0]').toBe(draggable.drag);
          expectWithContext(args[1], 'onEnd args[1]').toBe(draggable);
          // @ts-expect-error - srcEvent is optional.
          expectWithContext(args[0].endEvent?.srcEvent, 'onEnd endEvent').toBe(
            currentKeyboardEvent,
          );
          events.push('onEnd');
        },
        onDestroy(...args) {
          expectWithContext(args.length, 'onDestroy args.length').toBe(1);
          expectWithContext(args[0], 'onDestroy args[0]').toBe(draggable);
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
      expectWithContext(events, 'events after start').toStrictEqual([
        'preparestart',
        'onPrepareStart',
        'start',
        'onStart',
      ]);

      // Reset events.
      events.length = 0;

      // Move the element to the right.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the callbacks and events are called in the correct order.
      expectWithContext(events, 'events after move').toStrictEqual([
        'preparemove',
        'onPrepareMove',
        'move',
        'onMove',
      ]);

      // Reset events.
      events.length = 0;

      // End the drag.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      // Make sure the callbacks and events are called in the correct order.
      expectWithContext(events, 'events after end').toStrictEqual(['end', 'onEnd']);

      // Reset events.
      events.length = 0;

      // Destroy the draggable.
      draggable.destroy();

      // Make sure the callbacks and events are called in the correct order.
      expectWithContext(events, 'events after destroy').toStrictEqual(['destroy', 'onDestroy']);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
