import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('preventNativeDrag', () => {
    defaultSetup();

    it('should prevent native dragstart when true', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', preventNativeDrag: true });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      const dragstartEvent = new DragEvent('dragstart', { cancelable: true, bubbles: true });
      window.dispatchEvent(dragstartEvent);

      expectWithContext(dragstartEvent.defaultPrevented, 'dragstart prevented').toBe(true);

      s.destroy();
      el.remove();
    });

    it('should allow drag when false', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', preventNativeDrag: false });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      window.dispatchEvent(new MouseEvent('mousemove', { clientX: 2, clientY: 2, bubbles: true }));
      window.dispatchEvent(new MouseEvent('mouseup', { clientX: 2, clientY: 2, bubbles: true }));

      expectWithContext(s.drag, 'drag ended').toBe(null);

      s.destroy();
      el.remove();
    });
  });
};
