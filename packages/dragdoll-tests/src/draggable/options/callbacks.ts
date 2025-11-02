import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
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
          expect(args.length).toBe(2);
          expect(args[0]).toBe(draggable.drag);
          expect(args[1]).toBe(draggable);
          expect(args[0].startEvent.srcEvent).toBe(currentKeyboardEvent);
          expect(args[0].prevMoveEvent.srcEvent).toBe(currentKeyboardEvent);
          expect(args[0].moveEvent.srcEvent).toBe(currentKeyboardEvent);
          events.push('onPrepareStart');
        },
        onStart(...args) {
          expect(args.length).toBe(2);
          expect(args[0]).toBe(draggable.drag);
          expect(args[1]).toBe(draggable);
          expect(args[0].startEvent.srcEvent).toBe(currentKeyboardEvent);
          expect(args[0].prevMoveEvent.srcEvent).toBe(currentKeyboardEvent);
          expect(args[0].moveEvent.srcEvent).toBe(currentKeyboardEvent);
          events.push('onStart');
        },
        onPrepareMove(...args) {
          expect(args.length).toBe(2);
          expect(args[0]).toBe(draggable.drag);
          expect(args[1]).toBe(draggable);
          expect(args[0].moveEvent.srcEvent).toBe(currentKeyboardEvent);
          events.push('onPrepareMove');
        },
        onMove(...args) {
          expect(args.length).toBe(2);
          expect(args[0]).toBe(draggable.drag);
          expect(args[1]).toBe(draggable);
          expect(args[0].moveEvent.srcEvent).toBe(currentKeyboardEvent);
          events.push('onMove');
        },
        onEnd(...args) {
          expect(args.length).toBe(2);
          expect(args[0]).toBe(draggable.drag);
          expect(args[1]).toBe(draggable);
          // @ts-expect-error - srcEvent is optional.
          expect(args[0].endEvent?.srcEvent).toBe(currentKeyboardEvent);
          events.push('onEnd');
        },
        onDestroy(...args) {
          expect(args.length).toBe(1);
          expect(args[0]).toBe(draggable);
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
      expect(events).toStrictEqual(['preparestart', 'onPrepareStart', 'start', 'onStart']);

      // Reset events.
      events.length = 0;

      // Move the element to the right.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the callbacks and events are called in the correct order.
      expect(events).toStrictEqual(['preparemove', 'onPrepareMove', 'move', 'onMove']);

      // Reset events.
      events.length = 0;

      // End the drag.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      // Make sure the callbacks and events are called in the correct order.
      expect(events).toStrictEqual(['end', 'onEnd']);

      // Reset events.
      events.length = 0;

      // Destroy the draggable.
      draggable.destroy();

      // Make sure the callbacks and events are called in the correct order.
      expect(events).toStrictEqual(['destroy', 'onDestroy']);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
