import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('positionModifiers', () => {
    defaultSetup();

    it('should modify the dragged element position', async () => {
      const phaseCounter = { start: 0, move: 0, end: 0 };
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        positionModifiers: [
          (position, args) => {
            expect(args.draggable).toBe(draggable);
            expect(args.drag).toBe(draggable.drag);
            expect(args.item).toBe(draggable.drag?.items[0]);
            switch (args.phase) {
              case 'start': {
                ++phaseCounter.start;
                position.x += 1;
                position.y += 1;
                break;
              }
              case 'move': {
                ++phaseCounter.move;
                position.x += 2;
                position.y += 2;
                break;
              }
              case 'end': {
                ++phaseCounter.end;
                position.x += 3;
                position.y += 3;
                break;
              }
            }
            return position;
          },
        ],
      });

      let rect = el.getBoundingClientRect();
      expect(rect.x).toBe(0);
      expect(rect.y).toBe(0);

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the start modifiers have been called.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(1);
      expect(rect.y).toBe(1);

      // Move the element to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the move modifiers have been called.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(4);
      expect(rect.y).toBe(3);

      // Move the element down.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      await waitNextFrame();

      // Make sure the move modifiers have been called.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(6);
      expect(rect.y).toBe(6);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the end modifiers have been called.
      rect = el.getBoundingClientRect();
      expect(rect.x).toBe(9);
      expect(rect.y).toBe(9);

      // Make sure each phase modifier has been called the correct number of
      // times.
      expect(phaseCounter.start).toBe(1);
      expect(phaseCounter.move).toBe(2);
      expect(phaseCounter.end).toBe(1);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
