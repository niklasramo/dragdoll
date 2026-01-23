import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('moveDistance', () => {
    defaultSetup();

    it('should define the drag movement distance for x-axis and y-axis separately with an object', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: { x: 7, y: 9 } });

      // Make sure the moveDistance property is set correctly.
      expect(s.moveDistance).toStrictEqual({ x: 7, y: 9 });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag position is at 0,0.
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.moveDistance).toStrictEqual({ x: 5, y: 5 });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure drag position is at 0,0.
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
      expect(s.drag).toStrictEqual({
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
