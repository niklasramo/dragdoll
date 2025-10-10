import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';

export function optionStartPredicate() {
  describe('startPredicate', () => {
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
      assert.equal(callCount, 1);
      callCount = 0;

      // Should be called on move.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.equal(callCount, 1);
      callCount = 0;

      // Should be called on another move.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.equal(callCount, 1);
      callCount = 0;

      // Should not be called on end.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.equal(callCount, 0);

      // Should be called again on new start.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.equal(callCount, 1);
      callCount = 0;

      // Should not be called on cancel.
      keyboardSensor.cancel();
      assert.equal(callCount, 0);

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
          assert.equal(Object.keys(args).length, 3);
          assert.equal(args.draggable, draggable);
          assert.equal(args.sensor, keyboardSensor);
          assert.equal(typeof args.event.x, 'number');
          assert.equal(typeof args.event.y, 'number');
          assert.ok(['move', 'start'].includes(args.event.type));
          assert.equal(args.event.srcEvent, keyboardEvent);
          return undefined;
        },
      });

      focusElement(el);
      keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyboardEvent);
      assert.equal(callCount, 1);

      keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      document.dispatchEvent(keyboardEvent);
      assert.equal(callCount, 2);

      keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      document.dispatchEvent(keyboardEvent);
      assert.equal(callCount, 2);

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
      assert.equal(callCount, 1);
      assert.equal(draggable.drag, null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      assert.equal(callCount, 3);
      assert.equal(draggable.drag, null);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      assert.equal(callCount, 3);
      assert.equal(draggable.drag, null);

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
      assert.equal(callCount, 1);
      assert.notEqual(draggable.drag, null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should continue to be active, but there should not be any
      // additional calls to the predicate.
      assert.equal(callCount, 1);
      assert.notEqual(draggable.drag, null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should stop immediately, but there should not be any
      // additional calls to the predicate.
      assert.equal(draggable.drag, null);
      assert.equal(callCount, 1);

      // Start the drag again.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should start immediately again, and there should be one
      // additional call to the predicate
      assert.equal(callCount, 2);
      assert.notEqual(draggable.drag, null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should continue to be active, but there should not be any
      // additional calls to the predicate.
      assert.equal(callCount, 2);
      assert.notEqual(draggable.drag, null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should stop immediately, but there should not be any
      // additional calls to the predicate.
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);

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
      assert.equal(callCount, 1);
      assert.equal(draggable.drag, null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should not start, and there should not be any additional
      // calls to the predicate.
      assert.equal(callCount, 1);
      assert.equal(draggable.drag, null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // There should not be any additional calls to the predicate.
      assert.equal(callCount, 1);

      // Start the drag again.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // The drag should not start, and there should be one additional call
      // to the predicate.
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);

      // Move sensor.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      // The drag should not start, and there should not be any additional
      // calls to the predicate.
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // There should not be any additional calls to the predicate.
      assert.equal(callCount, 2);
      assert.equal(draggable.drag, null);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
