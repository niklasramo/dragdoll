import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function propDrag() {
  describe('drag', () => {
    it(`should be null on init`, () => {
      const s = new BaseSensor();
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should contain drag data during drag`, () => {
      const s = new BaseSensor();

      s['_start']({
        type: 'start',
        x: 0,
        y: 0,
      });

      assert.deepEqual(s.drag, { x: 0, y: 0 });

      s.destroy();
    });
  });
}
