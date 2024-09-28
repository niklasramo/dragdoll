import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { roundNumber } from '../../utils/round-number.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';
import { Draggable, KeyboardSensor } from '../../../../src/index.js';

export function optionContainer() {
  describe('container', () => {
    it('should define the drag container', async () => {
      const container = createTestElement();
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { container, elements: () => [el] });
      const originalContainer = el.parentNode;

      // Start dragging the element with keyboard.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag started.
      assert.notEqual(draggable.drag, null);

      await waitNextFrame();

      // Make sure the element has been moved within the container.
      assert.ok(container.contains(el));

      // Make sure the element's current parent is the container.
      assert.equal(el.parentElement, container);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag has stopped.
      assert.equal(draggable.drag, null);

      // Make sure the element was moved back to it's original container.
      assert.equal(el.parentNode, originalContainer);

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container.remove();
    });

    it(`should maintain client position`, async () => {
      const containerPositions = ['static', 'relative', 'fixed', 'absolute'];
      const elPositions = ['fixed', 'absolute'];
      for (const containerPosition of containerPositions) {
        for (const elPosition of elPositions) {
          const assertMsg = `element ${elPosition} - container ${containerPosition}`;
          const container = createTestElement({
            position: containerPosition,
            left: '0px',
            top: '0px',
            transform: 'translate(7px, 8px)',
          });
          const el = createTestElement({
            position: elPosition,
            left: '19px',
            top: '20px',
            transform: 'translate(-1px, -5px)',
          });
          const keyboardSensor = new KeyboardSensor(el, {
            moveDistance: 1,
          });
          const draggable = new Draggable([keyboardSensor], {
            container,
            elements: () => [el],
          });
          const originalContainer = el.parentNode;

          // Make sure the element and container are not at the same position.
          let containerRect = container.getBoundingClientRect();
          let elRect = el.getBoundingClientRect();
          assert.notEqual(elRect.x, containerRect.x, '1: ' + assertMsg);
          assert.notEqual(elRect.y, containerRect.y, '2: ' + assertMsg);

          // Start dragging the element with keyboard.
          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

          await waitNextFrame();

          // Make sure the element has been moved within the container.
          assert.ok(container.contains(el), '3: ' + assertMsg);

          // Make sure the element's client position has not changed.
          let rect = el.getBoundingClientRect();
          assert.equal(rect.x, elRect.x, '4: ' + assertMsg);
          assert.equal(rect.y, elRect.y, '5: ' + assertMsg);

          // Move the element to the right.
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

          await waitNextFrame();

          // Make sure the element has moved.
          rect = el.getBoundingClientRect();
          assert.equal(rect.x, elRect.x + 1, '6: ' + assertMsg);
          assert.equal(rect.y, elRect.y, '7: ' + assertMsg);

          // End the drag.
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

          // Make sure the element was moved back to it's original container
          // and client position is correct.
          rect = el.getBoundingClientRect();
          assert.equal(rect.x, elRect.x + 1, '9: ' + assertMsg);
          assert.equal(rect.y, elRect.y, '10: ' + assertMsg);
          assert.equal(el.parentNode, originalContainer, '11: ' + assertMsg);

          // Reset stuff.
          draggable.destroy();
          keyboardSensor.destroy();
          el.remove();
          container.remove();
        }
      }
    });

    it('should work with transformed elements', async () => {
      const el = createTestElement({
        transform: 'scale(1.2) translate(-5px, -6px) rotate(33deg) skew(31deg, 43deg)',
        transformOrigin: '21px 22px',
      });
      const scrollContainer = createTestElement({
        overflow: 'auto',
        width: '100%',
        height: '100%',
      });
      const scrollContent = createTestElement({
        position: 'relative',
        width: 'calc(100% + 100px)',
        height: 'calc(100% + 100px)',
      });
      const container1 = createTestElement({
        transform: 'scale(0.9) translate(3px, 4px) rotate(-10deg) skew(5deg, 10deg)',
        transformOrigin: '5px 10px',
      });
      const container2 = createTestElement({
        transform: 'scale(0.8) translate(4px, 5px) rotate(-20deg) skew(10deg, 15deg)',
        transformOrigin: '10px 15px',
      });
      const container3 = createTestElement({
        transform: 'scale(0.7) translate(5px, 6px) rotate(-30deg) skew(15deg, 20deg)',
        transformOrigin: '15px 20px',
      });
      const dragContainer1 = createTestElement({
        transform: 'scale(0.6) translate(6px, 7px) rotate(-35deg) skew(20deg, 25deg)',
        transformOrigin: '20px 25px',
      });
      const dragContainer2 = createTestElement({
        transform: 'scale(0.5) translate(7px, 8px) rotate(-40deg) skew(25deg, 30deg)',
        transformOrigin: '25px 30px',
      });
      const dragContainer3 = createTestElement({
        transform: 'scale(0.4) translate(8px, 9px) rotate(-45deg) skew(30deg, 35deg)',
        transformOrigin: '30px 35px',
      });
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        container: dragContainer1,
      });

      // Setup element structure.
      scrollContainer.appendChild(scrollContent);
      scrollContent.appendChild(container1);
      scrollContent.appendChild(dragContainer1);
      dragContainer1.appendChild(dragContainer2);
      dragContainer2.appendChild(dragContainer3);
      container1.appendChild(container2);
      container2.appendChild(container3);
      container3.appendChild(el);

      const startRect = el.getBoundingClientRect();

      // Drag element 1px right and down.
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

      await waitNextFrame();

      // Scroll the container 50px down and 25px right.
      scrollContainer.scrollBy(25, 50);

      await waitNextFrame();

      // Make sure the element has moved 1px, approximately.
      const moveRect = el.getBoundingClientRect();
      assert.equal(roundNumber(moveRect.x - startRect.x, 3), 1, 'x');
      assert.equal(roundNumber(moveRect.y - startRect.y, 3), 1, 'y');

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Again, make sure the element has moved 1px, approximately. When the
      // element is dropped (and moved back to the original container), the
      // element should maintain it's client position.
      const endRect = el.getBoundingClientRect();
      assert.equal(roundNumber(endRect.x - startRect.x, 3), 1, 'x');
      assert.equal(roundNumber(endRect.y - startRect.y, 3), 1, 'y');

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container1.remove();
      container2.remove();
      container3.remove();
      dragContainer1.remove();
      dragContainer2.remove();
      dragContainer3.remove();
    });
  });
}
