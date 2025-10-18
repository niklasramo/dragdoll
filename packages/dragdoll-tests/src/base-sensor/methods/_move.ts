import { assert } from 'chai';
import { BaseSensor } from 'dragdoll/sensors/base';

export function methodProtectedMove() {
  describe('_move', () => {
    it(`should update drag data to reflect the provided coordinates`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move']({ type: 'move', x: 3, y: 4 });
      assert.deepEqual(s.drag, { x: 3, y: 4 });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      assert.equal(s.isDestroyed, false);
      s['_move']({ type: 'move', x: 3, y: 4 });
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });

    it(`should emit "move" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const moveArgs = { type: 'move', x: 3, y: 4 } as const;
      let emitCount = 0;
      s.on('move', (data) => {
        assert.deepEqual(s.drag, { x: data.x, y: data.y });
        assert.equal(s.isDestroyed, false);
        assert.deepEqual(data, moveArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move'](moveArgs);
      assert.equal(emitCount, 1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('move', () => void ++emitCount);
      s['_move']({ type: 'move', x: 3, y: 4 });
      assert.deepEqual(s.drag, drag);
      assert.equal(s.isDestroyed, isDestroyed);
      assert.equal(emitCount, 0);
      s.destroy();
    });
  });
}
