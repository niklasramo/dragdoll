import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('movePredicate', () => {
    defaultSetup();

    it('should define the move predicate', () => {
      let returnValue: undefined | null | { x: number; y: number } = null;
      const el = createTestElement();
      const s = new KeyboardSensor(el, {
        movePredicate: (e, sensor) => {
          expect(e.type).toBe('keydown');
          expect(sensor).toBe(s);
          return returnValue;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag does not move if the predicate returns null.
      returnValue = null;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(s.drag).toStrictEqual({ x: 0, y: 0 });

      // Make sure the drag does not move if the predicate returns undefined.
      returnValue = undefined;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(s.drag).toStrictEqual({ x: 0, y: 0 });

      // Make sure the drag moves if the predicate returns a point.
      returnValue = { x: 1, y: 1 };
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(s.drag).toStrictEqual(returnValue);

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
            expect(s.drag).toStrictEqual({ x: -1, y: 0 });
            break;
          case 'ArrowRight':
            expect(s.drag).toStrictEqual({ x: 1, y: 0 });
            break;
          case 'ArrowUp':
            expect(s.drag).toStrictEqual({ x: 0, y: -1 });
            break;
          case 'ArrowDown':
            expect(s.drag).toStrictEqual({ x: 0, y: 1 });
            break;
        }

        s.destroy();
        el.remove();
      });
    });
  });
};
