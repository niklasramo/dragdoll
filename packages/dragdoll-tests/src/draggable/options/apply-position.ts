import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function optionApplyPosition() {
  describe('applyPosition', () => {
    it('should receive the correct arguments', async () => {
      let callCount = 0;
      let expectedPhase = '';
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        applyPosition: (args) => {
          ++callCount;
          assert.equal(Object.keys(args).length, 4);
          assert.equal(args.draggable, draggable);
          assert.equal(args.drag, draggable.drag);
          assert.equal(args.item, draggable.drag?.items[0]);
          assert.equal(args.phase, expectedPhase);
        },
      });

      // Start dragging the element with keyboard.
      focusElement(el);
      expectedPhase = 'start';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      assert.equal(callCount, 1);

      // Move the element to the right.
      expectedPhase = 'move';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      assert.equal(callCount, 2);

      // End the drag.
      expectedPhase = 'end';
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the callback is not called again.
      assert.equal(callCount, 3);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
