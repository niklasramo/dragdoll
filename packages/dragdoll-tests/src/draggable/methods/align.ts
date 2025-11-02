import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
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
      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the element has moved.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(1);
      expect(rect.y).toBe(0);

      // Shift element manually out of alignment.
      el.style.left = parseFloat(el.style.left) + 10 + 'px';
      el.style.top = parseFloat(el.style.top) + 10 + 'px';

      // Make sure the element has moved.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(11);
      expect(rect.y).toBe(10);

      // Align the element asynchronously.
      draggable.align();

      // Make sure the element has not been aligned yet.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(11);
      expect(rect.y).toBe(10);

      await waitNextFrame();

      // Make sure the element has been aligned after the next frame.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(1);
      expect(rect.y).toBe(0);

      // Shift element manually out of alignment, again.
      el.style.left = parseFloat(el.style.left) + 10 + 'px';
      el.style.top = parseFloat(el.style.top) + 10 + 'px';

      // Make sure the element has moved.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(11);
      expect(rect.y).toBe(10);

      // Align the element synchronously.
      draggable.align(true);

      // Make sure the element has been aligned synchronously.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(1);
      expect(rect.y).toBe(0);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
