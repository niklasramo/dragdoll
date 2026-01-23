import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

export default () => {
  describe('on', () => {
    defaultSetup();

    it('should return a unique symbol by default', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });
      const idA = draggable.on('start', () => {});
      const idB = draggable.on('start', () => {});

      expectWithContext(typeof idA, 'idA is symbol').toBe('symbol');
      expectWithContext(idA, 'idA != idB').not.toBe(idB);

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

      expectWithContext(counter, 'counter called twice').toBe(2);

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

      expectWithContext(msg, 'msg order').toBe('bc');

      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const el = createTestElement();
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      const idA = Symbol();
      expectWithContext(
        draggable.on('start', () => {}, idA),
        'returns symbol id',
      ).toBe(idA);

      const idB = 1;
      expectWithContext(
        draggable.on('start', () => {}, idB),
        'returns number id',
      ).toBe(idB);

      const idC = 'foo';
      expectWithContext(
        draggable.on('start', () => {}, idC),
        'returns string id',
      ).toBe(idC);

      keyboardSensor.destroy();
      draggable.destroy();
      el.remove();
    });
  });
};
