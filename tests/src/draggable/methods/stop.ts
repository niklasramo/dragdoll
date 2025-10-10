import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export function methodStop() {
  describe('stop', () => {
    it('should stop the drag after it has started', async () => {
      const el = createTestElement();
      const elRect = el.getBoundingClientRect();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onEnd: (drag) => {
          onEndCalled = true;
          assert.equal(drag.isEnded, true);
        },
      });
      let endEventTriggered = false;
      let onEndCalled = false;

      draggable.on('end', () => {
        endEventTriggered = true;
      });

      // Start dragging.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      // Verify that the drag started.
      assert.notEqual(draggable.drag, null, 'Drag should have started');

      // Stop dragging.
      draggable.stop();

      // Verify that the drag has stopped instantly.
      assert.equal(draggable.drag, null, 'Drag should have stopped instantly');

      // Verify that the end event is triggered.
      assert.equal(endEventTriggered, true, 'end event should have been triggered');

      // Verify that the onEnd callback is called.
      assert.equal(onEndCalled, true, 'onEnd callback should have been called');

      // Verify that the element's bounding client rect did not change.
      assert.deepEqual(
        elRect,
        el.getBoundingClientRect(),
        "Element's bounding client rect should not change after stopping the drag",
      );

      // Clean up.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should stop the drag synchronously after it is triggered to be start', async () => {
      const el = createTestElement();
      const elRect = el.getBoundingClientRect();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onEnd: (drag) => {
          onEndCalled = true;
          assert.equal(drag.isEnded, true);
        },
      });
      let endEventTriggered = false;
      let onEndCalled = false;

      draggable.on('end', () => {
        endEventTriggered = true;
      });

      // Start dragging.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Verify that the drag started.
      assert.notEqual(draggable.drag, null, 'Drag should have started');

      // Stop dragging.
      draggable.stop();

      // Verify that the drag has stopped instantly.
      assert.equal(draggable.drag, null, 'Drag should have stopped instantly');

      // Verify that the end event is triggered.
      assert.equal(endEventTriggered, true, 'end event should have been triggered');

      // Verify that the onEnd callback is called.
      assert.equal(onEndCalled, true, 'onEnd callback should have been called');

      // Verify that the element's bounding client rect did not change.
      assert.deepEqual(
        elRect,
        el.getBoundingClientRect(),
        "Element's bounding client rect should not change after stopping the drag",
      );

      // Clean up.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
