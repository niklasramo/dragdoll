import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('startPredicate', () => {
    defaultSetup();

    it('should be called only on start and move events of the sensors', async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return undefined;
        },
      });

      // Should be called on start.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(callCount).toBe(1);
      callCount = 0;

      // Should be called on move.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(callCount).toBe(1);
      callCount = 0;

      // Should be called on another move.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(callCount).toBe(1);
      callCount = 0;

      // Should not be called on end.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(callCount).toBe(0);

      // Should be called again on new start.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(callCount).toBe(1);
      callCount = 0;

      // Should not be called on cancel.
      keyboardSensor.cancel();
      expect(callCount).toBe(0);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should receive the correct arguments', async () => {
      let callCount = 0;
      let keyboardEvent: any = null;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: (args) => {
          ++callCount;
          expect(Object.keys(args).length).toBe(3);
          expect(args.draggable).toBe(draggable);
          expect(args.sensor).toBe(keyboardSensor);
          expect(typeof args.event.x).toBe('number');
          expect(typeof args.event.y).toBe('number');
          expect(['move', 'start'].includes(args.event.type)).toBe(true);
          expect(args.event.srcEvent).toBe(keyboardEvent);
          return undefined;
        },
      });

      focusElement(el);
      keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyboardEvent);
      expect(callCount).toBe(1);

      keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(keyboardEvent);
      expect(callCount).toBe(2);

      keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyboardEvent);
      expect(callCount).toBe(2);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should remain in pending state when `undefined` is returned', async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return undefined;
        },
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(callCount).toBe(1);
      expect(draggable.drag).toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(callCount).toBe(2);
      expect(draggable.drag).toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expect(callCount).toBe(3);
      expect(draggable.drag).toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(callCount).toBe(3);
      expect(draggable.drag).toBe(null);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should resolve when `true` is returned', async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return true;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should start immediately.
      expect(callCount).toBe(1);
      expect(draggable.drag).not.toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should continue to be active, but there should not be any
      // additional calls to the predicate.
      expect(callCount).toBe(1);
      expect(draggable.drag).not.toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should stop immediately, but there should not be any
      // additional calls to the predicate.
      expect(draggable.drag).toBe(null);
      expect(callCount).toBe(1);

      // Start the drag again.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should start immediately again, and there should be one
      // additional call to the predicate
      expect(callCount).toBe(2);
      expect(draggable.drag).not.toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should continue to be active, but there should not be any
      // additional calls to the predicate.
      expect(callCount).toBe(2);
      expect(draggable.drag).not.toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should stop immediately, but there should not be any
      // additional calls to the predicate.
      expect(callCount).toBe(2);
      expect(draggable.drag).toBe(null);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should reject when `false` is returned', async () => {
      let callCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++callCount;
          return false;
        },
      });

      // Start drag.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should not start.
      expect(callCount).toBe(1);
      expect(draggable.drag).toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should not start, and there should not be any additional
      // calls to the predicate.
      expect(callCount).toBe(1);
      expect(draggable.drag).toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // There should not be any additional calls to the predicate.
      expect(callCount).toBe(1);

      // Start the drag again.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should not start, and there should be one additional call
      // to the predicate.
      expect(callCount).toBe(2);
      expect(draggable.drag).toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should not start, and there should not be any additional
      // calls to the predicate.
      expect(callCount).toBe(2);
      expect(draggable.drag).toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // There should not be any additional calls to the predicate.
      expect(callCount).toBe(2);
      expect(draggable.drag).toBe(null);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
