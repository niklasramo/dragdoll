import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { PointerSensor } from '../../../../src/index.js';

export function methodOn() {
  describe('on', () => {
    it('should return a unique symbol by default', () => {
      const el = createTestElement();
      const s = new PointerSensor(el);
      const idA = s.on('start', () => {});
      const idB = s.on('start', () => {});
      assert.equal(typeof idA, 'symbol');
      assert.notEqual(idA, idB);
      el.remove();
      s.destroy();
    });

    it('should allow duplicate event listeners', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let counter = 0;
      const listener = () => {
        ++counter;
      };

      s.on('start', listener);
      s.on('start', listener);

      el.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );

      assert.equal(counter, 2);

      el.remove();
      s.destroy();
    });

    it('should remove the existing listener and add the new one if the same id is used', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let msg = '';

      s.on('start', () => void (msg += 'a'), 1);
      s.on('start', () => void (msg += 'b'), 2);
      s.on('start', () => void (msg += 'c'), 1);

      el.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );

      assert.equal(msg, 'bc');

      el.remove();
      s.destroy();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const el = createTestElement();
      const s = new PointerSensor(el);

      const idA = Symbol();
      assert.equal(
        s.on('start', () => {}, idA),
        idA,
      );

      const idB = 1;
      assert.equal(
        s.on('start', () => {}, idB),
        idB,
      );

      const idC = 'foo';
      assert.equal(
        s.on('start', () => {}, idC),
        idC,
      );

      el.remove();
      s.destroy();
    });
  });
}
