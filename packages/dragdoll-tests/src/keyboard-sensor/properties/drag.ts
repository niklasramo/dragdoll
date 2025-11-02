import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('drag', () => {
    defaultSetup();

    it(`should be null on init`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      expect(s.drag).toBe(null);
      el.remove();
      s.destroy();
    });

    it(`should be null after destroy method is called`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).not.toBe(null);

      s.destroy();
      expect(s.drag).toBe(null);

      el.remove();
    });

    it(`should match the current drag position`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 1 });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).toStrictEqual({ x: 0, y: 0 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(s.drag).toStrictEqual({ x: 1, y: 0 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(s.drag).toStrictEqual({ x: 1, y: 1 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expect(s.drag).toStrictEqual({ x: 0, y: 1 });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(s.drag).toStrictEqual({ x: 0, y: 0 });

      s.destroy();
      el.remove();
    });
  });
};
