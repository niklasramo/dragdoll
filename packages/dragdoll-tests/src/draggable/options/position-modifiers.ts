import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
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
            expectWithContext(args.draggable, 'args.draggable').toBe(draggable);
            expectWithContext(args.drag, 'args.drag').toBe(draggable.drag!);
            expectWithContext(args.item, 'args.item').toBe(draggable.drag!.items[0]);
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
      expectWithContext(rect.x, 'initial rect.x').toBe(0);
      expectWithContext(rect.y, 'initial rect.y').toBe(0);

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the start modifiers have been called.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after start').toBe(1);
      expectWithContext(rect.y, 'rect.y after start').toBe(1);

      // Move the element to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the move modifiers have been called.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after move 1').toBe(4);
      expectWithContext(rect.y, 'rect.y after move 1').toBe(3);

      // Move the element down.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      await waitNextFrame();

      // Make sure the move modifiers have been called.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after move 2').toBe(6);
      expectWithContext(rect.y, 'rect.y after move 2').toBe(6);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the end modifiers have been called.
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'rect.x after end').toBe(9);
      expectWithContext(rect.y, 'rect.y after end').toBe(9);

      // Make sure each phase modifier has been called the correct number of
      // times.
      expectWithContext(phaseCounter.start, 'start phase count').toBe(1);
      expectWithContext(phaseCounter.move, 'move phase count').toBe(2);
      expectWithContext(phaseCounter.end, 'end phase count').toBe(1);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
