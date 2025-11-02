import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('isDestroyed', () => {
    defaultSetup();

    it(`should be false on init`, () => {
      const s = new BaseSensor();
      expect(s.isDestroyed).toBe(false);
      s.destroy();
    });

    it(`should be true after destroy method is called`, () => {
      const s = new BaseSensor();
      s.destroy();
      expect(s.isDestroyed).toBe(true);
    });
  });
};
