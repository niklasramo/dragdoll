import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('frozenStyles', () => {
    defaultSetup();

    it('should receive the correct arguments', async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        frozenStyles: (args) => {
          ++callCount;
          expectWithContext(Object.keys(args).length, 'args key count').toBe(4);
          expectWithContext(args.draggable, 'args.draggable').toBe(draggable);
          expectWithContext(args.drag, 'args.drag').toBe(draggable.drag);
          expectWithContext(args.item.element, 'args.item.element').toBe(el);
          expectWithContext(args.style, 'args.style').toStrictEqual(window.getComputedStyle(el));
          return null;
        },
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the callback has been called.
      expectWithContext(callCount, 'callCount after start').toBe(1);

      // Move the element to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the callback is not called again.
      expectWithContext(callCount, 'callCount after move').toBe(1);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the callback is not called again.
      expectWithContext(callCount, 'callCount after end').toBe(1);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should freeze the styles of the dragged element', async () => {
      const container = createTestElement();
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        container,
        elements: () => [el],
        frozenStyles: () => {
          return ['width', 'height', 'left', 'top'];
        },
      });

      // Give the element some viewport-relative styles.
      el.style.width = '10vw';
      el.style.height = '10vh';
      el.style.left = '10vw';
      el.style.top = '10vh';

      // Compute the expected frozen styles.
      const expectedFrozenStyles = {
        width: getComputedStyle(el).width,
        height: getComputedStyle(el).height,
        left: getComputedStyle(el).left,
        top: getComputedStyle(el).top,
      };

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the styles have been frozen.
      expectWithContext(el.style.width, 'frozen width').toBe(expectedFrozenStyles.width);
      expectWithContext(el.style.height, 'frozen height').toBe(expectedFrozenStyles.height);
      expectWithContext(el.style.left, 'frozen left').toBe(expectedFrozenStyles.left);
      expectWithContext(el.style.top, 'frozen top').toBe(expectedFrozenStyles.top);

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the styles are unfrozen (reverted back to original).
      expectWithContext(el.style.width, 'unfrozen width').toBe('10vw');
      expectWithContext(el.style.height, 'unfrozen height').toBe('10vh');
      expectWithContext(el.style.left, 'unfrozen left').toBe('10vw');
      expectWithContext(el.style.top, 'unfrozen top').toBe('10vh');

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container.remove();
    });

    it('should set the explicitly provided styles if object is provided', async () => {
      const container = createTestElement();
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        container,
        elements: () => [el],
        frozenStyles: () => {
          return { width: '10px', height: '20px', left: '30px', top: '40px' };
        },
      });

      // Give the element some viewport-relative styles.
      el.style.width = '10vw';
      el.style.height = '10vh';
      el.style.left = '10vw';
      el.style.top = '10vh';

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the styles have been frozen.
      expectWithContext(el.style.width, 'explicit width').toBe('10px');
      expectWithContext(el.style.height, 'explicit height').toBe('20px');
      expectWithContext(el.style.left, 'explicit left').toBe('30px');
      expectWithContext(el.style.top, 'explicit top').toBe('40px');

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the styles are unfrozen (reverted back to original).
      expectWithContext(el.style.width, 'reverted width').toBe('10vw');
      expectWithContext(el.style.height, 'reverted height').toBe('10vh');
      expectWithContext(el.style.left, 'reverted left').toBe('10vw');
      expectWithContext(el.style.top, 'reverted top').toBe('10vh');

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container.remove();
    });
  });
};
