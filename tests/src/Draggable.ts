import { assert } from 'chai';
import { createFakeDrag } from './utils/createFakeDrag.js';
import { createTestElement } from './utils/createTestElement.js';
import { focusElement } from './utils/focusElement.js';
import { wait } from './utils/wait.js';
import { Draggable, PointerSensor, KeyboardSensor } from '../../src/index.js';

describe('Draggable', () => {
  it('should drag an element using the provided sensors', async () => {
    const el = createTestElement();
    const pointerSensor = new PointerSensor(el, { sourceEvents: 'mouse' });
    const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
    const draggable = new Draggable([pointerSensor, keyboardSensor], { getElements: () => [el] });

    // Make sure the element is at the top left corner.
    let rect = el.getBoundingClientRect();
    assert.equal(rect.x, 0);
    assert.equal(rect.y, 0);

    // Start dragging the element with keyboard.
    focusElement(el);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    await wait(100);

    // Make sure the element has moved.
    rect = el.getBoundingClientRect();
    assert.equal(rect.x, 1);
    assert.equal(rect.y, 0);

    // Stop dragging the element with keyboard.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    await wait(100);

    // Make sure the drag has stopped.
    assert.equal(draggable.drag, null);

    await wait(100);

    // Fake drag the element with mouse.
    await createFakeDrag(
      [
        { x: 1, y: 1 }, // mouse down
        { x: 2, y: 2 }, // mouse move
        { x: 3, y: 3 }, // mouse move
        { x: 3, y: 3 }, // mouse up
      ],
      {
        eventType: 'mouse',
        stepDuration: 50,
      },
    );

    await wait(100);

    // Make sure the drag has stopped.
    assert.equal(draggable.drag, null);

    // Make sure the element has moved correctly.
    rect = el.getBoundingClientRect();
    assert.equal(rect.x, 3);
    assert.equal(rect.y, 2);

    // Reset stuff.
    draggable.destroy();
    pointerSensor.destroy();
    keyboardSensor.destroy();
    el.remove();
  });

  describe('options', () => {
    describe('container', () => {
      it('should define the drag container', async () => {
        const container = createTestElement();
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], { container, getElements: () => [el] });
        const originalContainer = el.parentNode;

        // Start dragging the element with keyboard.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        await wait(100);

        // Make sure the drag started.
        assert.notEqual(draggable.drag, null);

        // Make sure the element has been moved within the container.
        assert.equal(el.parentNode, container);

        // End the drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        await wait(100);

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

      it(`should not offset client position`, async () => {
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
              getElements: () => [el],
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

            await wait(100);

            // Make sure the element has been moved inside the container.
            assert.equal(el.parentNode, container, '3: ' + assertMsg);

            // Make sure the element's client position has not changed.
            let rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x, '4: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '5: ' + assertMsg);

            // Move the element to the right.
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

            await wait(100);

            // Make sure the element has moved.
            rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x + 1, '6: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '7: ' + assertMsg);

            // End the drag.
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            await wait(100);

            // Make sure the element was moved back to it's original container
            // and client position is correct.
            rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x + 1, '8: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '9: ' + assertMsg);
            assert.equal(el.parentNode, originalContainer, '10: ' + assertMsg);

            // Reset stuff.
            draggable.destroy();
            keyboardSensor.destroy();
            el.remove();
            container.remove();
          }
        }
      });
    });

    describe('getElements', () => {
      it('should be a function that returns an array of the dragged elements', async () => {
        const elA = createTestElement();
        const elB = createTestElement();
        const elC = createTestElement();
        const keyboardSensor = new KeyboardSensor(elA, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          getElements: () => [elB, elC],
        });

        // Start dragging the element with keyboard.
        focusElement(elA);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        await wait(100);

        // Make sure the a element has not moved.
        const rectA = elA.getBoundingClientRect();
        assert.equal(rectA.x, 0);
        assert.equal(rectA.y, 0);

        // Make sure the b element has moved.
        const rectB = elB.getBoundingClientRect();
        assert.equal(rectB.x, 1);
        assert.equal(rectB.y, 0);

        // Make sure the c element has moved.
        const rectC = elC.getBoundingClientRect();
        assert.equal(rectC.x, 1);
        assert.equal(rectC.y, 0);

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        elA.remove();
        elB.remove();
        elC.remove();
      });
    });
  });

  describe('events', () => {
    describe('preparestart', () => {});
    describe('start', () => {});
    describe('preparemove', () => {});
    describe('move', () => {});
    describe('end', () => {});
    describe('destroy', () => {});
  });
});
