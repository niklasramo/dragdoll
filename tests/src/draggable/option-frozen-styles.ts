import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { Draggable, KeyboardSensor } from '../../../src/index.js';

export function optionFrozenStyles() {
  describe('option - frozenStyles', async () => {
    it('should receive the correct arguments', async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        frozenStyles: (args) => {
          ++callCount;
          assert.equal(Object.keys(args).length, 4);
          assert.equal(args.draggable, draggable);
          assert.equal(args.drag, draggable.drag);
          assert.equal(args.item.element, el);
          assert.deepEqual(args.style, window.getComputedStyle(el));
          return null;
        },
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the callback has been called.
      assert.equal(callCount, 1);

      // Move the element to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the callback is not called again.
      assert.equal(callCount, 1);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the callback is not called again.
      assert.equal(callCount, 1);

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
      assert.equal(el.style.width, expectedFrozenStyles.width);
      assert.equal(el.style.height, expectedFrozenStyles.height);
      assert.equal(el.style.left, expectedFrozenStyles.left);
      assert.equal(el.style.top, expectedFrozenStyles.top);

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the styles are unfrozen (reverted back to original).
      assert.equal(el.style.width, '10vw');
      assert.equal(el.style.height, '10vh');
      assert.equal(el.style.left, '10vw');
      assert.equal(el.style.top, '10vh');

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
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
      assert.equal(el.style.width, '10px');
      assert.equal(el.style.height, '20px');
      assert.equal(el.style.left, '30px');
      assert.equal(el.style.top, '40px');

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the styles are unfrozen (reverted back to original).
      assert.equal(el.style.width, '10vw');
      assert.equal(el.style.height, '10vh');
      assert.equal(el.style.left, '10vw');
      assert.equal(el.style.top, '10vh');

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
