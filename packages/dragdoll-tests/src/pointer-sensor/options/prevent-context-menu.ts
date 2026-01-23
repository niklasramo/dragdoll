import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('preventContextMenu', () => {
    defaultSetup();

    it('should prevent contextmenu when true', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', preventContextMenu: true });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      const contextmenuEvent = new MouseEvent('contextmenu', {
        cancelable: true,
        bubbles: true,
      });
      window.dispatchEvent(contextmenuEvent);

      expectWithContext(contextmenuEvent.defaultPrevented, 'contextmenu prevented').toBe(true);

      s.destroy();
      el.remove();
    });

    it('should allow contextmenu when false', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', preventContextMenu: false });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      const contextmenuEvent = new MouseEvent('contextmenu', {
        cancelable: true,
        bubbles: true,
      });
      window.dispatchEvent(contextmenuEvent);

      expectWithContext(contextmenuEvent.defaultPrevented, 'contextmenu not prevented').toBe(false);

      s.destroy();
      el.remove();
    });
  });
};
