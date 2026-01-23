import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('cancelPredicate', () => {
    defaultSetup();

    it('should define the cancel predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        cancelPredicate: (e, sensor) => {
          expectWithContext(e.type, 'event type').toBe('keydown');
          expectWithContext(sensor, 'sensor reference').toBe(s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag is not canceled if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expectWithContext(s.drag, 'drag active when predicate returns null').not.toBe(null);

      // Make sure the drag is not canceled if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expectWithContext(s.drag, 'drag active when predicate returns undefined').not.toBe(null);

      // Make sure the drag is canceled if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      expectWithContext(s.drag, 'drag canceled when predicate returns point').toBe(null);

      el.remove();
      s.destroy();
    });

    it(`should cancel drag with Escape by default`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const srcEvent = new KeyboardEvent('keydown', { key: 'Escape' });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(s.drag, 'drag started').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      document.dispatchEvent(srcEvent);
      expectWithContext(s.drag, 'drag canceled with Escape').toBe(null);

      s.destroy();
      el.remove();
    });
  });
};
