import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('startPredicate', () => {
    defaultSetup();

    it('should define the start predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        startPredicate: (e, sensor) => {
          expect(e.type).toBe('keydown');
          expect(sensor).toBe(s);
          return returnValue;
        },
      });

      // Make sure the drag does not start if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).toBe(null);

      // Make sure the drag does not start if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).toBe(null);

      // Make sure the drag starts if the predicate returns a point.
      returnValue = { x: 10, y: 20 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(s.drag).toStrictEqual({ x: 10, y: 20 });

      el.remove();
      s.destroy();
    });

    it(`should start drag with Enter and Space by default when the target element is focused`, () => {
      ['Enter', ' '].forEach((key) => {
        const el = createTestElement();
        const elDecoy = createTestElement();
        const s = new KeyboardSensor(el);
        const srcEvent = new KeyboardEvent('keydown', { key });

        // Drag should not start if there is no focused element.
        document.dispatchEvent(srcEvent);
        expect(s.drag).toBe(null);

        // Drag should not start if any other element than sensor element is
        // focused.
        focusElement(elDecoy);
        document.dispatchEvent(srcEvent);
        expect(s.drag).toBe(null);

        // Drag should start if the sensor element is focused.
        focusElement(el);
        document.dispatchEvent(srcEvent);
        expect(s.drag).toStrictEqual({ x: 0, y: 0 });

        s.destroy();
        el.remove();
        elDecoy.remove();
      });
    });
  });
};
