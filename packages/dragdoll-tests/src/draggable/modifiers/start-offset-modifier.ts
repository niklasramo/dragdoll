import { startOffsetModifier } from 'dragdoll';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('startOffsetModifier', () => {
    defaultSetup();

    it('should offset the element position on start to compensate for deferred predicate movement', async () => {
      let predicateCallCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++predicateCallCount;
          // Defer start on first call (sensor start event), resolve on
          // second call (first move event).
          return predicateCallCount >= 2 ? true : undefined;
        },
        positionModifiers: [startOffsetModifier],
      });

      // Initial position should be 0,0.
      let rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'initial rect.x').toBe(0);
      expectWithContext(rect.y, 'initial rect.y').toBe(0);

      // Start sensor (predicate returns undefined, drag does not start yet).
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expectWithContext(predicateCallCount, 'predicate call count after sensor start').toBe(1);
      expectWithContext(draggable.drag, 'drag null after sensor start').toBe(null);

      // Move right (predicate returns true, drag starts on this move event).
      // The sensor has moved 10px right from its start position. The modifier
      // should offset the element position by 10px on start to compensate.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      expectWithContext(predicateCallCount, 'predicate call count after move').toBe(2);
      expectWithContext(draggable.drag, 'drag not null after move').not.toBe(null);

      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after start - should include offset').toBe(10);
      expectWithContext(rect.y, 'rect.y after start - no y movement').toBe(0);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should not offset the element position on move or end phases', async () => {
      let predicateCallCount = 0;
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        startPredicate: () => {
          ++predicateCallCount;
          return predicateCallCount >= 2 ? true : undefined;
        },
        positionModifiers: [startOffsetModifier],
      });

      // Start sensor (deferred).
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Move right to trigger drag start (offset applied here).
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      let rect = el.getBoundingClientRect();
      const xAfterStart = rect.x;
      const yAfterStart = rect.y;
      expectWithContext(xAfterStart, 'rect.x after start').toBe(10);
      expectWithContext(yAfterStart, 'rect.y after start').toBe(0);

      // Move down - should move by exactly moveDistance, no extra offset.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      await waitNextFrame();

      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after move down').toBe(xAfterStart);
      expectWithContext(rect.y, 'rect.y after move down').toBe(yAfterStart + 10);

      // Move right - should move by exactly moveDistance, no extra offset.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after move right').toBe(xAfterStart + 10);
      expectWithContext(rect.y, 'rect.y after move right').toBe(yAfterStart + 10);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after end').toBe(xAfterStart + 10);
      expectWithContext(rect.y, 'rect.y after end').toBe(yAfterStart + 10);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should not offset when drag starts immediately (no deferred predicate)', async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        positionModifiers: [startOffsetModifier],
      });

      // Start drag immediately (default predicate resolves on start).
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // The start event has x === startX and y === startY, so offset should
      // be zero.
      let rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after immediate start').toBe(0);
      expectWithContext(rect.y, 'rect.y after immediate start').toBe(0);

      // Move right - normal movement.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after move').toBe(10);
      expectWithContext(rect.y, 'rect.y after move').toBe(0);

      // End drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
