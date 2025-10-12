import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function methodProtectedCancel() {
  describe('_cancel', () => {
    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_cancel']({ type: 'cancel', x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s['_cancel']({ type: 'cancel', x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const cancelArgs = { type: 'cancel', x: 5, y: 6 } as const;
      let emitCount = 0;
      s.on('cancel', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, cancelArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_cancel'](cancelArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s['_cancel']({ type: 'cancel', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}
