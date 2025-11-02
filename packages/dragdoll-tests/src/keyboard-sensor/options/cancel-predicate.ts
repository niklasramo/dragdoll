import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('cancelPredicate', () => {
    defaultSetup();

    it('should define the cancel predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        cancelPredicate: (e, sensor) => {
          expect(e.type).toBe('keydown');
          expect(sensor).toBe(s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag is not canceled if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(s.drag).not.toBe(null);

      // Make sure the drag is not canceled if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(s.drag).not.toBe(null);

      // Make sure the drag is canceled if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expect(s.drag).toBe(null);

      el.remove();
      s.destroy();
    });

    it(`should cancel drag with Escape by default`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const srcEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).toStrictEqual({ x: 0, y: 0 });

      document.dispatchEvent(srcEvent);
      expect(s.drag).toBe(null);

      s.destroy();
      el.remove();
    });
  });
};
