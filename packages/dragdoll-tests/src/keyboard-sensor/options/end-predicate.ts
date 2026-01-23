import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('endPredicate', () => {
    defaultSetup();

    it('should define the end predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        endPredicate: (e, sensor) => {
          expectWithContext(e.type, 'event type').toBe('keydown');
          expectWithContext(sensor, 'sensor reference').toBe(s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag is not ended if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(s.drag, 'drag active when predicate returns null').not.toBe(null);

      // Make sure the drag is not ended if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(s.drag, 'drag active when predicate returns undefined').not.toBe(null);

      // Make sure the drag is ended if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(s.drag, 'drag ended when predicate returns point').toBe(null);

      el.remove();
      s.destroy();
    });

    it(`should end drag with Enter and Space by default when the target element is focused`, () => {
      ['Enter', ' '].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        expectWithContext(s.drag, `drag started (${key})`).toStrictEqual({
          startX: 0,
          startY: 0,
          x: 0,
          y: 0,
          deltaX: 0,
          deltaY: 0,
        });

        document.dispatchEvent(new KeyboardEvent('keydown', { key }));
        expectWithContext(s.drag, `drag ended with ${key}`).toBe(null);

        s.destroy();
        el.remove();
      });
    });
  });
};
