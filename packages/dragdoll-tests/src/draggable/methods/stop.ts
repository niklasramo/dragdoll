import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('stop', () => {
    defaultSetup();

    it('should stop the drag after it has started', async () => {
      const el = createTestElement();
      const elRect = el.getBoundingClientRect();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        onEnd: (drag) => {
          onEndCalled = true;
          expect(drag.isEnded).toBe(true);
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
      expect(draggable.drag).not.toBe(null);

      // Stop dragging.
      draggable.stop();

      // Verify that the drag has stopped instantly.
      expect(draggable.drag).toBe(null);

      // Verify that the end event is triggered.
      expect(endEventTriggered).toBe(true);

      // Verify that the onEnd callback is called.
      expect(onEndCalled).toBe(true);

      // Verify that the element's bounding client rect did not change.
      expect(elRect).toStrictEqual(el.getBoundingClientRect());

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
          expect(drag.isEnded).toBe(true);
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
      expect(draggable.drag).not.toBe(null);

      // Stop dragging.
      draggable.stop();

      // Verify that the drag has stopped instantly.
      expect(draggable.drag).toBe(null);

      // Verify that the end event is triggered.
      expect(endEventTriggered).toBe(true);

      // Verify that the onEnd callback is called.
      expect(onEndCalled).toBe(true);

      // Verify that the element's bounding client rect did not change.
      expect(elRect).toStrictEqual(el.getBoundingClientRect());

      // Clean up.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
