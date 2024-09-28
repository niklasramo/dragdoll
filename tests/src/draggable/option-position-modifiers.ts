import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { Draggable, KeyboardSensor } from '../../../src/index.js';

export function optionPositionModifiers() {
  describe('option - positionModifiers', () => {
    it('should modify the dragged element position', async () => {
      let phaseCounter = { start: 0, move: 0, end: 0 };
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        positionModifiers: [
          (position, args) => {
            assert.equal(args.draggable, draggable);
            assert.equal(args.drag, draggable.drag);
            assert.equal(args.item, draggable.drag?.items[0]);
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
      assert.equal(rect.x, 0);
      assert.equal(rect.y, 0);

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Make sure the start modifiers have been called.
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 1);
      assert.equal(rect.y, 1);

      // Move the element to the right.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Make sure the move modifiers have been called.
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 4);
      assert.equal(rect.y, 3);

      // Move the element down.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      await waitNextFrame();

      // Make sure the move modifiers have been called.
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 6);
      assert.equal(rect.y, 6);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the end modifiers have been called.
      rect = el.getBoundingClientRect();
      assert.equal(rect.x, 9);
      assert.equal(rect.y, 9);

      // Make sure each phase modifier has been called the correct number of
      // times.
      assert.equal(phaseCounter.start, 1);
      assert.equal(phaseCounter.move, 2);
      assert.equal(phaseCounter.end, 1);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
}
