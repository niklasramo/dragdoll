import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('cancelOnEscape', () => {
    defaultSetup();

    it('should cancel drag on Escape when true', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', cancelOnEscape: true });

      let cancelEvents = 0;
      s.on('cancel', () => ++cancelEvents);

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expectWithContext(s.drag, 'drag cancelled').toBe(null);
      expectWithContext(cancelEvents, 'cancel event').toBe(1);

      s.destroy();
      el.remove();
    });

    it('should not cancel drag on Escape when false', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', cancelOnEscape: false });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expectWithContext(s.drag, 'drag started').not.toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expectWithContext(s.drag, 'drag not cancelled').not.toBe(null);

      s.destroy();
      el.remove();
    });
  });
};
