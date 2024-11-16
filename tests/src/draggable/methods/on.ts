import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { Draggable, KeyboardSensor } from '../../../../src/index.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export function methodOn() {
  describe('on', () => {
    it('should return a unique symbol by default', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const idA = draggable.on('start', () => {});
      const idB = draggable.on('start', () => {});

      assert.equal(typeof idA, 'symbol');
      assert.notEqual(idA, idB);

      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });

    it('should allow duplicate event listeners', async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let counter = 0;
      const listener = () => {
        ++counter;
      };

      draggable.on('start', listener);
      draggable.on('start', listener);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      assert.equal(counter, 2);

      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });

    it('should remove the existing listener and add the new one if the same id is used', async () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      let msg = '';

      draggable.on('start', () => void (msg += 'a'), 1);
      draggable.on('start', () => void (msg += 'b'), 2);
      draggable.on('start', () => void (msg += 'c'), 1);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      assert.equal(msg, 'bc');

      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const idA = Symbol();
      assert.equal(
        draggable.on('start', () => {}, idA),
        idA,
      );

      const idB = 1;
      assert.equal(
        draggable.on('start', () => {}, idB),
        idB,
      );

      const idC = 'foo';
      assert.equal(
        draggable.on('start', () => {}, idC),
        idC,
      );

      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });
  });
}
