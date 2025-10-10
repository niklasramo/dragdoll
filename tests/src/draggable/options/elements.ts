import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function optionElements() {
  describe('elements', () => {
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
      assert.equal(rectA.x, 0);
      assert.equal(rectA.y, 0);

      // Make sure the b element has moved.
      const rectB = elB.getBoundingClientRect();
      assert.equal(rectB.x, 1);
      assert.equal(rectB.y, 0);

      // Make sure the c element has moved.
      const rectC = elC.getBoundingClientRect();
      assert.equal(rectC.x, 1);
      assert.equal(rectC.y, 0);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      elA.remove();
      elB.remove();
      elC.remove();
    });
  });
}
