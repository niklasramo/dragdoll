import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('align', () => {
    defaultSetup();

    it('should align the element visually', async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      // Make sure the element is at the top left corner.
      let rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'initial rect.x').toBe(0);
      expectWithContext(rect.y, 'initial rect.y').toBe(0);

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the element has moved.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after move').toBe(1);
      expectWithContext(rect.y, 'rect.y after move').toBe(0);

      // Shift element manually out of alignment.
      el.style.left = parseFloat(el.style.left) + 10 + 'px';
      el.style.top = parseFloat(el.style.top) + 10 + 'px';

      // Make sure the element has moved.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after manual shift').toBe(11);
      expectWithContext(rect.y, 'rect.y after manual shift').toBe(10);

      // Align the element asynchronously.
      draggable.align();

      // Make sure the element has not been aligned yet.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x before async align').toBe(11);
      expectWithContext(rect.y, 'rect.y before async align').toBe(10);

      await waitNextFrame();

      // Make sure the element has been aligned after the next frame.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after async align').toBe(1);
      expectWithContext(rect.y, 'rect.y after async align').toBe(0);

      // Shift element manually out of alignment, again.
      el.style.left = parseFloat(el.style.left) + 10 + 'px';
      el.style.top = parseFloat(el.style.top) + 10 + 'px';

      // Make sure the element has moved.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after second shift').toBe(11);
      expectWithContext(rect.y, 'rect.y after second shift').toBe(10);

      // Align the element synchronously.
      draggable.align(true);

      // Make sure the element has been aligned synchronously.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after sync align').toBe(1);
      expectWithContext(rect.y, 'rect.y after sync align').toBe(0);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
