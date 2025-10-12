import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function methodOn() {
  describe('on', () => {
    it('should return a unique symbol by default', () => {
      const s = new BaseSensor();
      const idA = s.on('start', () => {});
      const idB = s.on('start', () => {});
      assert.equal(typeof idA, 'symbol');
      assert.notEqual(idA, idB);
      s.destroy();
    });

    it('should allow duplicate event listeners', () => {
      const s = new BaseSensor();
      let counter = 0;
      const listener = () => {
        ++counter;
      };
      s.on('start', listener);
      s.on('start', listener);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(counter, 2);
      s.destroy();
    });

    it('should remove the existing listener and add the new one if the same id is used', () => {
      const s = new BaseSensor();
      let msg = '';
      s.on('start', () => void (msg += 'a'), 1);
      s.on('start', () => void (msg += 'b'), 2);
      s.on('start', () => void (msg += 'c'), 1);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(msg, 'bc');
      s.destroy();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const s = new BaseSensor();

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

      s.destroy();
    });
  });
}
