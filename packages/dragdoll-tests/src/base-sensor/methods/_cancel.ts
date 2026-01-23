import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('_cancel', () => {
    defaultSetup();

    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_cancel']({ type: 'cancel', x: 5, y: 6 });
      expectWithContext(s.drag, 'drag reset to null').toBe(null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      expectWithContext(s.isDestroyed, 'isDestroyed before cancel').toBe(false);
      s['_cancel']({ type: 'cancel', x: 5, y: 6 });
      expectWithContext(s.isDestroyed, 'isDestroyed after cancel').toBe(false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const cancelArgs = { type: 'cancel', x: 5, y: 6 } as const;
      let emitCount = 0;
      s.on('cancel', (data) => {
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
          ...cancelArgs,
          startX: 1,
          startY: 2,
          deltaX: 4,
          deltaY: 4,
        });
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_cancel'](cancelArgs);
      expectWithContext(emitCount, 'emit count').toBe(1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s['_cancel']({ type: 'cancel', x: 3, y: 4 });
      expectWithContext(s.drag, 'drag unchanged').toStrictEqual(drag);
      expectWithContext(s.isDestroyed, 'isDestroyed unchanged').toBe(isDestroyed);
      expectWithContext(emitCount, 'no events emitted').toBe(0);
      s.destroy();
    });
  });
};
