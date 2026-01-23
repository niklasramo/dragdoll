import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
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
      expectWithContext(rectA.x, 'elA.x unchanged').toBe(0);
      expectWithContext(rectA.y, 'elA.y unchanged').toBe(0);

      // Make sure the b element has moved.
      const rectB = elB.getBoundingClientRect();
      expectWithContext(rectB.x, 'elB.x moved').toBe(1);
      expectWithContext(rectB.y, 'elB.y unchanged').toBe(0);

      // Make sure the c element has moved.
      const rectC = elC.getBoundingClientRect();
      expectWithContext(rectC.x, 'elC.x moved').toBe(1);
      expectWithContext(rectC.y, 'elC.y unchanged').toBe(0);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      elA.remove();
      elB.remove();
      elC.remove();
    });
  });
};
