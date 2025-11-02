import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
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
          expect(Object.keys(args).length).toBe(4);
          expect(args.draggable).toBe(draggable);
          expect(args.drag).toBe(draggable.drag);
          expect(args.item.element).toBe(el);
          expect(args.style).toStrictEqual(window.getComputedStyle(el));
          return null;
        },
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the callback has been called.
      expect(callCount).toBe(1);

      // Move the element to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the callback is not called again.
      expect(callCount).toBe(1);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the callback is not called again.
      expect(callCount).toBe(1);

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
      expect(el.style.width).toBe(expectedFrozenStyles.width);
      expect(el.style.height).toBe(expectedFrozenStyles.height);
      expect(el.style.left).toBe(expectedFrozenStyles.left);
      expect(el.style.top).toBe(expectedFrozenStyles.top);

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the styles are unfrozen (reverted back to original).
      expect(el.style.width).toBe('10vw');
      expect(el.style.height).toBe('10vh');
      expect(el.style.left).toBe('10vw');
      expect(el.style.top).toBe('10vh');

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
      expect(el.style.width).toBe('10px');
      expect(el.style.height).toBe('20px');
      expect(el.style.left).toBe('30px');
      expect(el.style.top).toBe('40px');

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the styles are unfrozen (reverted back to original).
      expect(el.style.width).toBe('10vw');
      expect(el.style.height).toBe('10vh');
      expect(el.style.left).toBe('10vw');
      expect(el.style.top).toBe('10vh');

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container.remove();
    });
  });
};
