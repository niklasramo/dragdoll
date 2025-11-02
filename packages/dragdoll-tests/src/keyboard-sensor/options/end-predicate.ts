import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('endPredicate', () => {
    defaultSetup();

    it('should define the end predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        endPredicate: (e, sensor) => {
          expect(e.type).toBe('keydown');
          expect(sensor).toBe(s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag is not ended if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).not.toBe(null);

      // Make sure the drag is not ended if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).not.toBe(null);

      // Make sure the drag is ended if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).toBe(null);

      el.remove();
      s.destroy();
    });

    it(`should end drag with Enter and Space by default when the target element is focused`, () => {
      ['Enter', ' '].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expect(s.drag).toStrictEqual({ x: 0, y: 0 });

        document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        expect(s.drag).toBe(null);

        s.destroy();
        el.remove();
      });
    });
  });
};
