import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
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
      expectWithContext(callCount, 'called on start').toBe(1);
      callCount = 0;

      // Should be called on move.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(callCount, 'called on move').toBe(1);
      callCount = 0;

      // Should be called on another move.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(callCount, 'called on another move').toBe(1);
      callCount = 0;

      // Should not be called on end.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(callCount, 'not called on end').toBe(0);

      // Should be called again on new start.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(callCount, 'called on new start').toBe(1);
      callCount = 0;

      // Should not be called on cancel.
      keyboardSensor.cancel();
      expectWithContext(callCount, 'not called on cancel').toBe(0);

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
          expectWithContext(Object.keys(args).length, 'args key count').toBe(3);
          expectWithContext(args.draggable, 'args.draggable').toBe(draggable);
          expectWithContext(args.sensor, 'args.sensor').toBe(keyboardSensor);
          expectWithContext(typeof args.event.x, 'args.event.x type').toBe('number');
          expectWithContext(typeof args.event.y, 'args.event.y type').toBe('number');
          expectWithContext(['move', 'start'].includes(args.event.type), 'event type valid').toBe(
            true,
          );
          expectWithContext(args.event.srcEvent, 'args.event.srcEvent').toBe(keyboardEvent);
          return undefined;
        },
      });

      focusElement(el);
      keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyboardEvent);
      expectWithContext(callCount, 'callCount after start').toBe(1);

      keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(keyboardEvent);
      expectWithContext(callCount, 'callCount after move').toBe(2);

      keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyboardEvent);
      expectWithContext(callCount, 'callCount after end').toBe(2);

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
      expectWithContext(callCount, 'callCount after start').toBe(1);
      expectWithContext(draggable.drag, 'drag null after start').toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(callCount, 'callCount after move 1').toBe(2);
      expectWithContext(draggable.drag, 'drag null after move 1').toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      expectWithContext(callCount, 'callCount after move 2').toBe(3);
      expectWithContext(draggable.drag, 'drag null after move 2').toBe(null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(callCount, 'callCount after end').toBe(3);
      expectWithContext(draggable.drag, 'drag null after end').toBe(null);

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
      expectWithContext(callCount, 'callCount after start').toBe(1);
      expectWithContext(draggable.drag, 'drag not null after start').not.toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should continue to be active, but there should not be any
      // additional calls to the predicate.
      expectWithContext(callCount, 'callCount after moves').toBe(1);
      expectWithContext(draggable.drag, 'drag still active').not.toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should stop immediately, but there should not be any
      // additional calls to the predicate.
      expectWithContext(draggable.drag, 'drag null after end').toBe(null);
      expectWithContext(callCount, 'callCount after end').toBe(1);

      // Start the drag again.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should start immediately again, and there should be one
      // additional call to the predicate
      expectWithContext(callCount, 'callCount after restart').toBe(2);
      expectWithContext(draggable.drag, 'drag not null after restart').not.toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should continue to be active, but there should not be any
      // additional calls to the predicate.
      expectWithContext(callCount, 'callCount after second moves').toBe(2);
      expectWithContext(draggable.drag, 'drag still active second').not.toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should stop immediately, but there should not be any
      // additional calls to the predicate.
      expectWithContext(callCount, 'callCount after second end').toBe(2);
      expectWithContext(draggable.drag, 'drag null after second end').toBe(null);

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
      expectWithContext(callCount, 'callCount after start').toBe(1);
      expectWithContext(draggable.drag, 'drag null - rejected').toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should not start, and there should not be any additional
      // calls to the predicate.
      expectWithContext(callCount, 'callCount after moves').toBe(1);
      expectWithContext(draggable.drag, 'drag still null after moves').toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // There should not be any additional calls to the predicate.
      expectWithContext(callCount, 'callCount after end').toBe(1);

      // Start the drag again.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should not start, and there should be one additional call
      // to the predicate.
      expectWithContext(callCount, 'callCount after restart').toBe(2);
      expectWithContext(draggable.drag, 'drag null on restart').toBe(null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should not start, and there should not be any additional
      // calls to the predicate.
      expectWithContext(callCount, 'callCount after second moves').toBe(2);
      expectWithContext(draggable.drag, 'drag still null').toBe(null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // There should not be any additional calls to the predicate.
      expectWithContext(callCount, 'callCount after second end').toBe(2);
      expectWithContext(draggable.drag, 'drag null at end').toBe(null);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
