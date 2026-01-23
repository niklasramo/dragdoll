import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('applyPosition', () => {
    defaultSetup();

    it('should receive the correct arguments', async () => {
      let callCount = 0;
      let expectedPhase = '';
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        applyPosition: (args) => {
          ++callCount;
          expectWithContext(Object.keys(args).length, 'args key count').toBe(4);
          expectWithContext(args.draggable, 'args.draggable').toBe(draggable);
          expectWithContext(args.drag, 'args.drag').toBe(draggable.drag);
          expectWithContext(args.item, 'args.item').toBe(draggable.drag?.items[0]);
          expectWithContext(args.phase, 'args.phase').toBe(expectedPhase);
        },
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      expectedPhase = 'start';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      expectWithContext(callCount, 'callCount after start').toBe(1);

      // Move the element to the right.
      expectedPhase = 'move';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      expectWithContext(callCount, 'callCount after move').toBe(2);

      // End the drag.
      expectedPhase = 'end';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the callback is not called again.
      expectWithContext(callCount, 'callCount after end').toBe(3);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
