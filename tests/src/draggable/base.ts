import { assert } from 'chai';
import { createFakeDrag } from '../utils/create-fake-drag.js';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { roundNumber } from '../utils/round-number.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { Draggable, PointerSensor, KeyboardSensor } from '../../../src/index.js';

export function base() {
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

    await waitNextFrame();

    // Make sure the element has moved.
    rect = el.getBoundingClientRect();
    assert.equal(rect.x, 1);
    assert.equal(rect.y, 0);

    // Stop dragging the element with keyboard.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    // Make sure the drag has stopped.
    assert.equal(draggable.drag, null);

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

    await waitNextFrame();

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

    await waitNextFrame();

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
}
