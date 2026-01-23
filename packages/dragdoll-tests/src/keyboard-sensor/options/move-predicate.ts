import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('movePredicate', () => {
    defaultSetup();

    it('should define the move predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        movePredicate: (e, sensor) => {
          expectWithContext(e.type, 'event type').toBe('keydown');
          expectWithContext(sensor, 'sensor reference').toBe(s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag does not move if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(s.drag, 'drag unchanged when predicate returns null').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      // Make sure the drag does not move if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(s.drag, 'drag unchanged when predicate returns undefined').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      // Make sure the drag moves if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(s.drag, 'drag moved with custom point').toStrictEqual({
        startX: 0,
        startY: 0,
        ...returnValue,
        deltaX: returnValue.x,
        deltaY: returnValue.y,
      });

      el.remove();
      s.destroy();
    });

    it(`should move drag with arrow keys by default`, () => {
      ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach((key) => {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { moveDistance: 1 });
        const srcEvent = new KeyboardEvent('keydown', { key });

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        document.dispatchEvent(srcEvent);

        switch (key) {
          case 'ArrowLeft':
            expectWithContext(s.drag, 'drag after ArrowLeft').toStrictEqual({
              startX: 0,
              startY: 0,
              x: -1,
              y: 0,
              deltaX: -1,
              deltaY: 0,
            });
            break;
          case 'ArrowRight':
            expectWithContext(s.drag, 'drag after ArrowRight').toStrictEqual({
              startX: 0,
              startY: 0,
              x: 1,
              y: 0,
              deltaX: 1,
              deltaY: 0,
            });
            break;
          case 'ArrowUp':
            expectWithContext(s.drag, 'drag after ArrowUp').toStrictEqual({
              startX: 0,
              startY: 0,
              x: 0,
              y: -1,
              deltaX: 0,
              deltaY: -1,
            });
            break;
          case 'ArrowDown':
            expectWithContext(s.drag, 'drag after ArrowDown').toStrictEqual({
              startX: 0,
              startY: 0,
              x: 0,
              y: 1,
              deltaX: 0,
              deltaY: 1,
            });
            break;
        }

        s.destroy();
        el.remove();
      });
    });
  });
};
