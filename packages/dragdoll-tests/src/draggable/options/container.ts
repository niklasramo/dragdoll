import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';
import { roundNumber } from '../../utils/round-number.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('container', () => {
    defaultSetup();

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
      expect(draggable.drag).not.toBe(null);

      await waitNextFrame();

      // Make sure the element has been moved within the container.
      expect(container.contains(el)).toBe(true);

      // Make sure the element's current parent is the container.
      expect(el.parentElement).toBe(container);

      // End the drag.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Make sure the drag has stopped.
      expect(draggable.drag).toBe(null);

      // Make sure the element was moved back to it's original container.
      expect(el.parentNode).toBe(originalContainer);

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
          // const assertMsg = `element ${elPosition} - container ${containerPosition}`;
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
          const containerRect = container.getBoundingClientRect();
          const elRect = el.getBoundingClientRect();
          // console.log(`1: ${assertMsg}`);
          expect(elRect.x).not.toBe(containerRect.x);
          // console.log(`2: ${assertMsg}`);
          expect(elRect.y).not.toBe(containerRect.y);

          // Start dragging the element with keyboard.
          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

          await waitNextFrame();

          // Make sure the element has been moved within the container.
          // console.log(`3: ${assertMsg}`)
          expect(container.contains(el)).toBe(true);

          // Make sure the element's client position has not changed.
          let rect = el.getBoundingClientRect();
          // console.log(`4: ${assertMsg}`);
          expect(rect.x).toBe(elRect.x);
          // console.log(`5: ${assertMsg}`);
          expect(rect.y).toBe(elRect.y);

          // Move the element to the right.
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

          await waitNextFrame();

          // Make sure the element has moved.
          rect = el.getBoundingClientRect();
          // console.log(`6: ${assertMsg}`);
          expect(rect.x).toBe(elRect.x + 1);
          // console.log(`7: ${assertMsg}`);
          expect(rect.y).toBe(elRect.y);

          // End the drag.
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

          // Make sure the element was moved back to it's original container
          // and client position is correct.
          rect = el.getBoundingClientRect();
          // console.log(`8: ${assertMsg}`);
          expect(rect.x).toBe(elRect.x + 1);
          // console.log(`9: ${assertMsg}`);
          expect(rect.y).toBe(elRect.y);
          // console.log(`10: ${assertMsg}`);
          expect(el.parentNode).toBe(originalContainer);

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
      expect({
        x: roundNumber(moveRect.x - startRect.x, 3),
        y: roundNumber(moveRect.y - startRect.y, 3),
      }).toStrictEqual({ x: 1, y: 1 });

      // Drop the element.
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Again, make sure the element has moved 1px, approximately. When the
      // element is dropped (and moved back to the original container), the
      // element should maintain it's client position.
      const endRect = el.getBoundingClientRect();
      expect({
        x: roundNumber(endRect.x - startRect.x, 3),
        y: roundNumber(endRect.y - startRect.y, 3),
      }).toStrictEqual({ x: 1, y: 1 });

      // Reset stuff.
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
      container3.remove();
      container2.remove();
      container1.remove();
      dragContainer3.remove();
      dragContainer2.remove();
      dragContainer1.remove();
      scrollContent.remove();
      scrollContainer.remove();
    });
  });
};
