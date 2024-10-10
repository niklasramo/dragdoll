import { assert } from 'chai';
import { BaseSensor } from '../../../../src/index.js';

export function methodOff() {
  describe('off', () => {
    it('should remove an event listener based on id', () => {
      const s = new BaseSensor();
      let msg = '';
      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(msg, 'b');
      s.destroy();
    });
  });
}
