import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('elements', () => {
    defaultSetup();

    it('should be a function that returns an array of the dragged elements', async () => {
      const elA = createTestElement();
      const elB = createTestElement();
      const elC = createTestElement();
      const keyboardSensor = new KeyboardSensor(elA, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [elB, elC],
      });

      // Start dragging the element with keyboard.
      focusElement(elA);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the a element has not moved.
      const rectA = elA.getBoundingClientRect();
      expect(rectA.x).toBe(0);
      expect(rectA.y).toBe(0);

      // Make sure the b element has moved.
      const rectB = elB.getBoundingClientRect();
      expect(rectB.x).toBe(1);
      expect(rectB.y).toBe(0);

      // Make sure the c element has moved.
      const rectC = elC.getBoundingClientRect();
      expect(rectC.x).toBe(1);
      expect(rectC.y).toBe(0);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      elA.remove();
      elB.remove();
      elC.remove();
    });
  });
};
