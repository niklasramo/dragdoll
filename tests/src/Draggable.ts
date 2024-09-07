import { assert } from 'chai';
import { createFakeDrag } from './utils/create-fake-drag.js';
import { createTestElement } from './utils/create-test-element.js';
import { focusElement } from './utils/focus-element.js';
import { roundNumber } from './utils/round-number.js';
import { wait } from './utils/wait.js';
import { Draggable, PointerSensor, KeyboardSensor } from '../../src/index.js';

describe('Draggable', () => {
  it('should drag an element using the provided sensors', async () => {
    const el = createTestElement();
    const pointerSensor = new PointerSensor(el, { sourceEvents: 'mouse' });
    const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
    const draggable = new Draggable([pointerSensor, keyboardSensor], { elements: () => [el] });

    // Make sure the element is at the top left corner.
    let rect = el.getBoundingClientRect();
    assert.equal(rect.x, 0);
    assert.equal(rect.y, 0);

    // Start dragging the element with keyboard.
    focusElement(el);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

    await wait(50);

    // Make sure the element has moved.
    rect = el.getBoundingClientRect();
    assert.equal(rect.x, 1);
    assert.equal(rect.y, 0);

    // Stop dragging the element with keyboard.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    await wait(50);

    // Make sure the drag has stopped.
    assert.equal(draggable.drag, null);

    await wait(50);

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

    await wait(50);

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
      transform: 'scale(1.2) translate(-5px, -6px) rotate(33deg) skew(30deg, -40deg)',
      transformOrigin: '21px 22px',
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
    const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
    const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

    // Add the element to a container.
    container1.appendChild(container2);
    container2.appendChild(container3);
    container3.appendChild(el);

    const startRect = el.getBoundingClientRect();

    // Drag element 1px right and down.
    focusElement(el);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

    await wait(50);

    // Make sure the element has moved 1px, approximately.
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
  });

  describe('options', () => {
    describe('startPredicate', () => {
      it('should be called only on start and move events of the sensors', async () => {
        let callCount = 0;
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          startPredicate: () => {
            ++callCount;
            return undefined;
          },
        });

        // Should be called on start.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(callCount, 1);
        callCount = 0;

        // Should be called on move.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.equal(callCount, 1);
        callCount = 0;

        // Should be called on another move.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.equal(callCount, 1);
        callCount = 0;

        // Should not be called on end.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(callCount, 0);

        // Should be called again on new start.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(callCount, 1);
        callCount = 0;

        // Should not be called on cancel.
        keyboardSensor.cancel();
        assert.equal(callCount, 0);

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
      });

      it('should receive the correct arguments', async () => {
        let callCount = 0;
        let keyboardEvent: any = null;
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          startPredicate: (args) => {
            ++callCount;
            assert.equal(Object.keys(args).length, 3);
            assert.equal(args.draggable, draggable);
            assert.equal(args.sensor, keyboardSensor);
            assert.equal(typeof args.event.x, 'number');
            assert.equal(typeof args.event.y, 'number');
            assert.ok(['move', 'start'].includes(args.event.type));
            assert.equal(args.event.srcEvent, keyboardEvent);
            return undefined;
          },
        });

        focusElement(el);
        keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(keyboardEvent);
        assert.equal(callCount, 1);

        keyboardEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
        document.dispatchEvent(keyboardEvent);
        assert.equal(callCount, 2);

        keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
        document.dispatchEvent(keyboardEvent);
        assert.equal(callCount, 2);

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
      });

      it('should remain in pending state when `undefined` is returned', async () => {
        let callCount = 0;
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          startPredicate: () => {
            ++callCount;
            return undefined;
          },
        });

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(callCount, 1);
        assert.equal(draggable.drag, null);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.equal(callCount, 2);
        assert.equal(draggable.drag, null);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.equal(callCount, 3);
        assert.equal(draggable.drag, null);

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(callCount, 3);
        assert.equal(draggable.drag, null);

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
      });

      it('should resolve when `true` is returned', async () => {
        let callCount = 0;
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          startPredicate: () => {
            ++callCount;
            return true;
          },
        });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // The drag should start immediately.
        assert.equal(callCount, 1);
        assert.notEqual(draggable.drag, null);

        // Move sensor.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        // The drag should continue to be active, but there should not be any
        // additional calls to the predicate.
        assert.equal(callCount, 1);
        assert.notEqual(draggable.drag, null);

        // End drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // The drag should stop immediately, but there should not be any
        // additional calls to the predicate.
        assert.equal(draggable.drag, null);
        assert.equal(callCount, 1);

        // Start the drag again.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // The drag should start immediately again, and there should be one
        // additional call to the predicate
        assert.equal(callCount, 2);
        assert.notEqual(draggable.drag, null);

        // Move sensor.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        // The drag should continue to be active, but there should not be any
        // additional calls to the predicate.
        assert.equal(callCount, 2);
        assert.notEqual(draggable.drag, null);

        // End drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // The drag should stop immediately, but there should not be any
        // additional calls to the predicate.
        assert.equal(callCount, 2);
        assert.equal(draggable.drag, null);

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
      });

      it('should reject when `false` is returned', async () => {
        let callCount = 0;
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          startPredicate: () => {
            ++callCount;
            return false;
          },
        });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // The drag should not start.
        assert.equal(callCount, 1);
        assert.equal(draggable.drag, null);

        // Move sensor.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        // The drag should not start, and there should not be any additional
        // calls to the predicate.
        assert.equal(callCount, 1);
        assert.equal(draggable.drag, null);

        // End drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // There should not be any additional calls to the predicate.
        assert.equal(callCount, 1);

        // Start the drag again.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // The drag should not start, and there should be one additional call
        // to the predicate.
        assert.equal(callCount, 2);
        assert.equal(draggable.drag, null);

        // Move sensor.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        // The drag should not start, and there should not be any additional
        // calls to the predicate.
        assert.equal(callCount, 2);
        assert.equal(draggable.drag, null);

        // End drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // There should not be any additional calls to the predicate.
        assert.equal(callCount, 2);
        assert.equal(draggable.drag, null);

        // Reset stuff.
        draggable.destroy();
        keyboardSensor.destroy();
        el.remove();
      });
    });

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

        await wait(50);

        // Make sure the drag started.
        assert.notEqual(draggable.drag, null);

        // Make sure the element has been moved within the container.
        assert.ok(container.contains(el));

        // Make sure the element's current parent is the container.
        assert.equal(el.parentElement, container);

        // End the drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        await wait(50);

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

            await wait(50);

            // Make sure the element has been moved within the container.
            assert.ok(container.contains(el), '3: ' + assertMsg);

            // Make sure the element's client position has not changed.
            let rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x, '4: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '5: ' + assertMsg);

            // Move the element to the right.
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

            await wait(50);

            // Make sure the element has moved.
            rect = el.getBoundingClientRect();
            assert.equal(rect.x, elRect.x + 1, '6: ' + assertMsg);
            assert.equal(rect.y, elRect.y, '7: ' + assertMsg);

            // End the drag.
            document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

            await wait(50);

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

        await wait(50);

        // Scroll the container 50px down and 25px right.
        scrollContainer.scrollBy(25, 50);

        await wait(50);

        // Make sure the element has moved 1px, approximately.
        const moveRect = el.getBoundingClientRect();
        assert.equal(roundNumber(moveRect.x - startRect.x, 3), 1, 'x');
        assert.equal(roundNumber(moveRect.y - startRect.y, 3), 1, 'y');

        // Drop the element.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        await wait(50);

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

    describe('elements', () => {
      it('should be a function that returns an array of the dragged elements', async () => {
        const elA = createTestElement();
        const elB = createTestElement();
        const elC = createTestElement();
        const keyboardSensor = new KeyboardSensor(elA, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [elB, elC],
        });

        // Start dragging the element with keyboard.
        focusElement(elA);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        await wait(50);

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

    describe('positionModifiers', () => {
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

        await wait(50);

        // Make sure the start modifiers have been called.
        rect = el.getBoundingClientRect();
        assert.equal(rect.x, 1);
        assert.equal(rect.y, 1);

        // Move the element to the right.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        await wait(50);

        // Make sure the move modifiers have been called.
        rect = el.getBoundingClientRect();
        assert.equal(rect.x, 4);
        assert.equal(rect.y, 3);

        // Move the element down.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        await wait(50);

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

    describe('callbacks', () => {
      it('should call the provided callbacks in correct order with the right arguments', async () => {
        let events: string[] = [];
        const el = createTestElement();
        const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
        const draggable = new Draggable([keyboardSensor], {
          elements: () => [el],
          onPrepareStart(drag, draggable) {
            assert.equal(draggable, draggable);
            assert.equal(drag, draggable.drag);
            events.push('onPrepareStart');
          },
          onStart(drag, draggable) {
            assert.equal(draggable, draggable);
            assert.equal(drag, draggable.drag);
            events.push('onStart');
          },
          onPrepareMove(drag, draggable) {
            assert.equal(draggable, draggable);
            assert.equal(drag, draggable.drag);
            events.push('onPrepareMove');
          },
          onMove(drag, draggable) {
            assert.equal(draggable, draggable);
            assert.equal(drag, draggable.drag);
            events.push('onMove');
          },
          onEnd(drag, draggable) {
            assert.equal(draggable, draggable);
            assert.equal(drag, draggable.drag);
            events.push('onEnd');
          },
          onDestroy(draggable) {
            assert.equal(draggable, draggable);
            events.push('onDestroy');
          },
        });

        draggable.on('preparestart', () => events.push('preparestart'));
        draggable.on('start', () => events.push('start'));
        draggable.on('preparemove', () => events.push('preparemove'));
        draggable.on('move', () => events.push('move'));
        draggable.on('end', () => events.push('end'));
        draggable.on('destroy', () => events.push('destroy'));

        // Start dragging the element with keyboard.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        await wait(50);

        // Make sure the callbacks and events are called in the correct order.
        assert.deepEqual(events, ['preparestart', 'onPrepareStart', 'start', 'onStart']);

        // Reset events.
        events.length = 0;

        // Move the element to the right.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        await wait(50);

        // Make sure the callbacks and events are called in the correct order.
        assert.deepEqual(events, ['preparemove', 'onPrepareMove', 'move', 'onMove']);

        // Reset events.
        events.length = 0;

        // End the drag.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure the callbacks and events are called in the correct order.
        assert.deepEqual(events, ['end', 'onEnd']);

        // Reset events.
        events.length = 0;

        // Destroy the draggable.
        draggable.destroy();

        // Make sure the callbacks and events are called in the correct order.
        assert.deepEqual(events, ['destroy', 'onDestroy']);

        // Reset stuff.
        keyboardSensor.destroy();
        el.remove();
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
