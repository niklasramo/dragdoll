import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('updateSettings', () => {
    defaultSetup();

    it(`should update startPredicate setting`, () => {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).toBe(null);

      s.updateSettings({ startPredicate: () => true });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).not.toBe(null);
    });

    it(`should update preventNativeDrag setting`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', preventNativeDrag: true });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expect(s.drag).not.toBe(null);

      const dragstartEvent = new DragEvent('dragstart', { cancelable: true, bubbles: true });
      window.dispatchEvent(dragstartEvent);
      expect(dragstartEvent.defaultPrevented).toBe(true);

      s.updateSettings({ preventNativeDrag: false });
      window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1, clientY: 1, bubbles: true }));
      s.updateSettings({ preventNativeDrag: true });
      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      const dragstartEvent2 = new DragEvent('dragstart', { cancelable: true, bubbles: true });
      window.dispatchEvent(dragstartEvent2);
      expect(dragstartEvent2.defaultPrevented).toBe(true);

      s.destroy();
      el.remove();
    });

    it(`should update preventContextMenu setting`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', preventContextMenu: true });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expect(s.drag).not.toBe(null);

      const contextmenuEvent = new MouseEvent('contextmenu', {
        cancelable: true,
        bubbles: true,
      });
      window.dispatchEvent(contextmenuEvent);
      expect(contextmenuEvent.defaultPrevented).toBe(true);

      window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1, clientY: 1, bubbles: true }));
      s.updateSettings({ preventContextMenu: false });
      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));

      const contextmenuEvent2 = new MouseEvent('contextmenu', {
        cancelable: true,
        bubbles: true,
      });
      window.dispatchEvent(contextmenuEvent2);
      expect(contextmenuEvent2.defaultPrevented).toBe(false);

      s.destroy();
      el.remove();
    });

    it(`should update cancelOnEscape setting`, () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse', cancelOnEscape: false });

      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expect(s.drag).not.toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(s.drag).not.toBe(null);

      window.dispatchEvent(new MouseEvent('mouseup', { clientX: 1, clientY: 1, bubbles: true }));
      expect(s.drag).toBe(null);

      s.updateSettings({ cancelOnEscape: true });
      el.dispatchEvent(new MouseEvent('mousedown', { clientX: 1, clientY: 1, bubbles: true }));
      expect(s.drag).not.toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(s.drag).toBe(null);

      s.destroy();
      el.remove();
    });

    it(`should update sourceEvents setting`, () => {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'pointer',
        startPredicate: () => true,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).toBe(null);

      s.updateSettings({ sourceEvents: 'mouse' });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).not.toBe(null);
    });
  });
};
