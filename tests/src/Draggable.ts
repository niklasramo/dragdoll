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

  it('should work with transformed elements', async () => {
    const el = createTestElement({
      transform: 'scale(1.2) translate(-5px, -6px) rotate(33deg) skew(31deg, 43deg)',
      transformOrigin: '21px 22px',
    });
    const container = createTestElement({
      transform: 'scale(0.5) translate(3px, 4px) rotate(77deg) skew(11deg, 22deg)',
      transformOrigin: '12px 13px',
    });
    const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
    const draggable = new Draggable([keyboardSensor], { getElements: () => [el] });

    // Add the element to a container.
    container.appendChild(el);

    const startRect = el.getBoundingClientRect();

    // Drag element 1px right and down.
    focusElement(el);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    await wait(100);

    // Make sure the element has moved 1px, approximately.
    const endRect = el.getBoundingClientRect();
    assert.equal(Math.round((endRect.x - startRect.x) * 1000) / 1000, 1, 'x');
    assert.equal(Math.round((endRect.y - startRect.y) * 1000) / 1000, 1, 'y');

    // Reset stuff.
    draggable.destroy();
    keyboardSensor.destroy();
    el.remove();
    container.remove();
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
        assert.ok(container.contains(el));

        // Make sure the element's current parent is the drag inner container.
        assert.equal(el.parentElement, draggable.drag?.items[0].dragInnerContainer);

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

            // Make sure the element has been moved within the container.
            assert.ok(container.contains(el), '3: ' + assertMsg);

            // Make sure the element's current parent is the drag inner
            // container.
            assert.equal(
              el.parentElement,
              draggable.drag?.items[0].dragInnerContainer,
              '4: ' + assertMsg,
            );

            // Make sure the element's client position has not changed.
            let rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x, '5: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '6: ' + assertMsg);

            // Move the element to the right.
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

            await wait(100);

            // Make sure the element has moved.
            rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x + 1, '7: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '8: ' + assertMsg);

            // End the drag.
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            await wait(100);

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
        const container = createTestElement({
          transform: 'scale(0.5) translate(3px, 4px) rotate(77deg) skew(11deg, 22deg)',
          transformOrigin: '12px 13px',
        });
        const dragContainer = createTestElement({
          transform: 'scale(0.75) translate(-30px, 79px) rotate(31deg) skew(3deg, 4deg)',
          transformOrigin: '120px 130px',
        });
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          getElements: () => [el],
          container: dragContainer,
        });

        // Add the element to a container.
        container.appendChild(el);

        const startRect = el.getBoundingClientRect();

        // Drag element 1px right and down.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        await wait(100);

        // Make sure the element has moved 1px, approximately.
        const endRect = el.getBoundingClientRect();
        assert.equal(Math.round((endRect.x - startRect.x) * 1000) / 1000, 1, 'x');
        assert.equal(Math.round((endRect.y - startRect.y) * 1000) / 1000, 1, 'y');

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
        container.remove();
        dragContainer.remove();
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
