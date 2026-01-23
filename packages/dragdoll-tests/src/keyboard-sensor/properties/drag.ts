import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('drag', () => {
    defaultSetup();

    it(`should be null on init`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      expectWithContext(s.drag, 'drag is null on init').toBe(null);
      el.remove();
      s.destroy();
    });

    it(`should be null after destroy method is called`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(s.drag, 'drag not null during drag').not.toBe(null);

      s.destroy();
      expectWithContext(s.drag, 'drag null after destroy').toBe(null);

      el.remove();
    });

    it(`should match the current drag position`, () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 1 });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(s.drag, 'drag at start').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(s.drag, 'drag after ArrowRight').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 1,
        y: 0,
        deltaX: 1,
        deltaY: 0,
      });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expectWithContext(s.drag, 'drag after ArrowDown').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 1,
        y: 1,
        deltaX: 0,
        deltaY: 1,
      });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      expectWithContext(s.drag, 'drag after ArrowLeft').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 1,
        deltaX: -1,
        deltaY: 0,
      });

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expectWithContext(s.drag, 'drag after ArrowUp').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: -1,
      });

      s.destroy();
      el.remove();
    });
  });
};
