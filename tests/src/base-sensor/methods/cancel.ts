import { assert } from 'chai';
import { BaseSensor } from '../../../../src/index.js';

export function methodCancel() {
  describe('cancel', () => {
    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s.cancel();
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.cancel();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('cancel', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, {
          type: 'cancel',
          x: 1,
          y: 2,
        } as const);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s.cancel();
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s.cancel();
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}
