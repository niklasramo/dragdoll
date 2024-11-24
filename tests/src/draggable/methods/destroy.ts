import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';
import { Draggable, KeyboardSensor } from '../../../../src/index.js';

export function methodDestroy() {
  describe('destroy', () => {
    it('should destroy the draggable instance', async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let destroyEventCount = 0;

      draggable.on('destroy', () => {
        ++destroyEventCount;
      });

      // Destroy draggable instance.
      draggable.destroy();

      // draggable.isDestroyed should be true.
      assert.equal(draggable.isDestroyed, true);

      // Destroy event should be emitted once.
      assert.equal(destroyEventCount, 1);

      // Try start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Dragging should not work.
      const rect = el.getBoundingClientRect();
      assert.equal(draggable.drag, null);
      assert.equal(rect.x, 0);
      assert.equal(rect.y, 0);

      // Try destroy again.
      draggable.destroy();

      // Destroy event should not be emitted again.
      assert.equal(destroyEventCount, 1);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
