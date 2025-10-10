import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function methodProtectedStart() {
  describe('_start', () => {
    it(`should create drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.deepEqual(s.drag, { x: 1, y: 2 });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      assert.equal(s.isDestroyed, false);
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "start" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const startArgs = { type: 'start', x: 1, y: 2 } as const;
      let emitCount = 0;
      s.on('start', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, startArgs);
        ++emitCount;
      });
      s['_start'](startArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is already active`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s['_start']({ type: 'start', x: 1, y: 2 });
      const isDestroyed = s.isDestroyed;
      const { drag } = s;
      s['_start']({ type: 'start', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if instance is destroyed (isDestroyed is true)`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s.destroy();
      const { drag, isDestroyed } = s;
      s['_start']({ type: 'start', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}
