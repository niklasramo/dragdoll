import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('drag', () => {
    defaultSetup();

    it(`should be null on init`, () => {
      const s = new BaseSensor();
      expect(s.drag).toBe(null);
      s.destroy();
    });

    it(`should contain drag data during drag`, () => {
      const s = new BaseSensor();

      s['_start']({
        type: 'start',
        x: 0,
        y: 0,
      });

      expect(s.drag).toStrictEqual({ x: 0, y: 0 });

      s.destroy();
    });
  });
};
