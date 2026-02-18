import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
import { expectWithContext } from '../utils/expect-with-context.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export default () => {
  describe('events', () => {
    defaultSetup();

    it('should be called at the right time with the right arguments', async () => {
      const events: string[] = [];
      let currentKeyboardEvent: KeyboardEvent | null = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
      });

      draggable.on('preparestart', (...args) => {
        expectWithContext(args.length, 'preparestart args length').toBe(2);
        expectWithContext(args[0], 'preparestart arg[0]').toBe(draggable.drag!);
        expectWithContext(args[1], 'preparestart arg[1]').toBe(draggable);
        events.push('preparestart');
      });

      draggable.on('start', (...args) => {
        expectWithContext(args.length, 'start args length').toBe(2);
        expectWithContext(args[0], 'start arg[0]').toBe(draggable.drag!);
        expectWithContext(args[1], 'start arg[1]').toBe(draggable);
        events.push('start');
      });

      draggable.on('preparemove', (...args) => {
        expectWithContext(args.length, 'preparemove args length').toBe(2);
        expectWithContext(args[0], 'preparemove arg[0]').toBe(draggable.drag!);
        expectWithContext(args[1], 'preparemove arg[1]').toBe(draggable);
        events.push('preparemove');
      });

      draggable.on('move', (...args) => {
        expectWithContext(args.length, 'move args length').toBe(2);
        expectWithContext(args[0], 'move arg[0]').toBe(draggable.drag!);
        expectWithContext(args[1], 'move arg[1]').toBe(draggable);
        events.push('move');
      });

      draggable.on('end', (...args) => {
        expectWithContext(args.length, 'end args length').toBe(2);
        expectWithContext(args[0], 'end arg[0]').toBe(draggable.drag!);
        expectWithContext(args[1], 'end arg[1]').toBe(draggable);
        events.push('end');
      });

      draggable.on('destroy', (...args) => {
        expectWithContext(args.length, 'destroy args length').toBe(0);
        events.push('destroy');
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the events are called in the correct order.
      expectWithContext(events, 'events after start').toStrictEqual(['preparestart', 'start']);

      // Reset events.
      events.length = 0;

      // Move the element to the right.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowRight' });
      document.dispatchEvent(currentKeyboardEvent);

      await waitNextFrame();

      // Make sure the events are called in the correct order.
      expectWithContext(events, 'events after move').toStrictEqual(['preparemove', 'move']);

      // Reset events.
      events.length = 0;

      // End the drag.
      currentKeyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(currentKeyboardEvent);

      // Make sure the events are called in the correct order.
      expectWithContext(events, 'events after end').toStrictEqual(['end']);

      // Reset events.
      events.length = 0;

      // Destroy the draggable.
      draggable.destroy();

      // Make sure the events are called in the correct order.
      expectWithContext(events, 'events after destroy').toStrictEqual(['destroy']);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
