import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('off', () => {
    defaultSetup();

    it('should remove an event listener based on id', () => {
      const s = new BaseSensor();
      let msg = '';
      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);
      s['_start']({ type: 'start', x: 1, y: 2 });
      expect(msg).toBe('b');
      s.destroy();
    });
  });
};
