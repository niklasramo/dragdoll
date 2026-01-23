import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('_move', () => {
    defaultSetup();

    it(`should update drag data to reflect the provided coordinates`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move']({ type: 'move', x: 3, y: 4 });
      expectWithContext(s.drag, 'drag data updated').toStrictEqual({
        startX: 1,
        startY: 2,
        x: 3,
        y: 4,
        deltaX: 2,
        deltaY: 2,
      });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      expectWithContext(s.isDestroyed, 'isDestroyed before move').toBe(false);
      s['_move']({ type: 'move', x: 3, y: 4 });
      expectWithContext(s.isDestroyed, 'isDestroyed after move').toBe(false);
      s.destroy();
    });

    it(`should emit "move" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const moveArgs = { type: 'move', x: 3, y: 4 } as const;
      let emitCount = 0;
      s.on('move', (data) => {
        expectWithContext(s.drag, 'drag matches event data').toStrictEqual({
          startX: data.startX,
          startY: data.startY,
          x: data.x,
          y: data.y,
          deltaX: data.deltaX,
          deltaY: data.deltaY,
        });
        expectWithContext(s.isDestroyed, 'isDestroyed in callback').toBe(false);
        expectWithContext(data, 'event data').toStrictEqual({
          ...moveArgs,
          startX: 1,
          startY: 2,
          deltaX: 2,
          deltaY: 2,
        });
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move'](moveArgs);
      expectWithContext(emitCount, 'emit count').toBe(1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('move', () => void ++emitCount);
      s['_move']({ type: 'move', x: 3, y: 4 });
      expectWithContext(s.drag, 'drag unchanged').toStrictEqual(drag);
      expectWithContext(s.isDestroyed, 'isDestroyed unchanged').toBe(isDestroyed);
      expectWithContext(emitCount, 'no events emitted').toBe(0);
      s.destroy();
    });
  });
};
