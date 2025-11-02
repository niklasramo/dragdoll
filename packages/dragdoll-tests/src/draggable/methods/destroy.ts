import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
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
      expect(draggable.isDestroyed).toBe(true);

      // Destroy event should be emitted once.
      expect(destroyEventCount).toBe(1);

      // Try start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Dragging should not work.
      const rect = el.getBoundingClientRect();
      expect(draggable.drag).toBe(null);
      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);

      // Try destroy again.
      draggable.destroy();

      // Destroy event should not be emitted again.
      expect(destroyEventCount).toBe(1);

      // Reset stuff.
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
