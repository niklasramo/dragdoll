import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('destroy', () => {
    defaultSetup();

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
      expectWithContext(draggable.isDestroyed, 'isDestroyed after destroy').toBe(true);

      // Destroy event should be emitted once.
      expectWithContext(destroyEventCount, 'destroy event count').toBe(1);

      // Try start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Dragging should not work.
      const rect = el.getBoundingClientRect();
      expectWithContext(draggable.drag, 'drag null after destroy').toBe(null);
      expectWithContext(rect.x, 'rect.x unchanged').toBe(0);
      expectWithContext(rect.y, 'rect.y unchanged').toBe(0);

      // Try destroy again.
      draggable.destroy();

      // Destroy event should not be emitted again.
      expectWithContext(destroyEventCount, 'destroy event count after double destroy').toBe(1);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
