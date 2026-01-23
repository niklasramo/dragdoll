import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('drag', () => {
    defaultSetup();

    it(`should be null on init`, () => {
      const s = new BaseSensor();
      expectWithContext(s.drag, 'drag is null on init').toBe(null);
      s.destroy();
    });

    it(`should contain drag data during drag`, () => {
      const s = new BaseSensor();

      s['_start']({
        type: 'start',
        x: 0,
        y: 0,
      });

      expectWithContext(s.drag, 'drag data during drag').toStrictEqual({
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 0,
      });

      s.destroy();
    });
  });
};
