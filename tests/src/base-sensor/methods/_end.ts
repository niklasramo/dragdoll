import { assert } from 'chai';
import { BaseSensor } from '../../../../src/index.js';

export function methodProtectedEnd() {
  describe('_end', () => {
    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_end']({ type: 'end', x: 5, y: 6 });
      assert.equal(s.drag, null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s['_end']({ type: 'end', x: 5, y: 6 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "end" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const endArgs = { type: 'end', x: 5, y: 6 } as const;
      let emitCount = 0;
      s.on('end', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, endArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_end'](endArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('end', () => void ++emitCount);
      s['_end']({ type: 'end', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}
