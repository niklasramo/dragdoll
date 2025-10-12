import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export function methodOff() {
  describe('off', () => {
    it('should remove an event listener based on id', async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let result = '';

      // Add the event listeners.
      const idA = draggable.on('start', () => {
        result += 'a';
      });
      draggable.on('start', () => {
        result += 'b';
      });

      // Unbind the first event listener.
      draggable.off('start', idA);

      // Start dragging.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      assert.equal(result, 'b', 'Only the second event listener should have been triggered');

      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
