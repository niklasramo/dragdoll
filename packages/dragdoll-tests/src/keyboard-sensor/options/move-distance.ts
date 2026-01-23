import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('moveDistance', () => {
    defaultSetup();

    it('should define the drag movement distance for x-axis and y-axis separately with an object', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: { x: 7, y: 9 } });

      // Make sure the moveDistance property is set correctly.
      expectWithContext(s.moveDistance, 'moveDistance property').toStrictEqual({ x: 7, y: 9 });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag position is at 0,0.
      expectWithContext(s.drag, 'drag at start').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      // Move to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      // Make sure drag position is at 7,0.
      expectWithContext(s.drag, 'drag at 7,0').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 7,
        y: 0,
        deltaX: 7,
        deltaY: 0,
      });

      // Move down.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // Make sure drag position is at 7,9.
      expectWithContext(s.drag, 'drag at 7,9').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 7,
        y: 9,
        deltaX: 0,
        deltaY: 9,
      });

      // Move left.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      // Make sure drag position is at 0,9.
      expectWithContext(s.drag, 'drag at 0,9').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 9,
        deltaX: -7,
        deltaY: 0,
      });

      // Move up.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      // Make sure drag position is at 0,0.
      expectWithContext(s.drag, 'drag back at 0,0').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: -9,
      });

      el.remove();
      s.destroy();
    });

    it('should define the drag movement distance for both axes with a number', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 5 });

      // Make sure the moveDistance property is set correctly.
      expectWithContext(s.moveDistance, 'moveDistance property').toStrictEqual({ x: 5, y: 5 });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag position is at 0,0.
      expectWithContext(s.drag, 'drag at start').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      // Move to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      // Make sure drag position is at 5,0.
      expectWithContext(s.drag, 'drag at 5,0').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 5,
        y: 0,
        deltaX: 5,
        deltaY: 0,
      });

      // Move down.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // Make sure drag position is at 5,5.
      expectWithContext(s.drag, 'drag at 5,5').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 5,
        y: 5,
        deltaX: 0,
        deltaY: 5,
      });

      // Move left.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

      // Make sure drag position is at 0,5.
      expectWithContext(s.drag, 'drag at 0,5').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 5,
        deltaX: -5,
        deltaY: 0,
      });

      // Move up.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

      // Make sure drag position is at 0,0.
      expectWithContext(s.drag, 'drag back at 0,0').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: -5,
      });

      el.remove();
      s.destroy();
    });
  });
};
