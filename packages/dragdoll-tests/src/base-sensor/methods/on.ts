import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('on', () => {
    defaultSetup();

    it('should return a unique symbol by default', () => {
      const s = new BaseSensor();
      const idA = s.on('start', () => {});
      const idB = s.on('start', () => {});
      expect(typeof idA).toBe('symbol');
      expect(idA).not.toBe(idB);
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
      expect(counter).toBe(2);
      s.destroy();
    });

    it('should remove the existing listener and add the new one if the same id is used', () => {
      const s = new BaseSensor();
      let msg = '';
      s.on('start', () => void (msg += 'a'), 1);
      s.on('start', () => void (msg += 'b'), 2);
      s.on('start', () => void (msg += 'c'), 1);
      s['_start']({ type: 'start', x: 1, y: 2 });
      expect(msg).toBe('bc');
      s.destroy();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const s = new BaseSensor();

      const idA = Symbol();
      expect(s.on('start', () => {}, idA)).toBe(idA);

      const idB = 1;
      expect(s.on('start', () => {}, idB)).toBe(idB);

      const idC = 'foo';
      expect(s.on('start', () => {}, idC)).toBe(idC);

      s.destroy();
    });
  });
};
