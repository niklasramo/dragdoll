import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';

export default () => {
  describe('_start', () => {
    defaultSetup();

    it(`should create drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      expectWithContext(s.drag, 'drag data created').toStrictEqual({
        startX: 1,
        startY: 2,
        x: 1,
        y: 2,
        deltaX: 0,
        deltaY: 0,
      });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      expectWithContext(s.isDestroyed, 'isDestroyed before start').toBe(false);
      s['_start']({ type: 'start', x: 1, y: 2 });
      expectWithContext(s.isDestroyed, 'isDestroyed after start').toBe(false);
      s.destroy();
    });

    it(`should emit "start" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const startArgs = { type: 'start', x: 1, y: 2 } as const;
      let emitCount = 0;
      s.on('start', (data) => {
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
          ...startArgs,
          startX: startArgs.x,
          startY: startArgs.y,
          deltaX: 0,
          deltaY: 0,
        });
        ++emitCount;
      });
      s['_start'](startArgs);
      expectWithContext(emitCount, 'emit count').toBe(1);
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
      expectWithContext(s.drag, 'drag unchanged').toStrictEqual(drag);
      expectWithContext(s.isDestroyed, 'isDestroyed unchanged').toBe(isDestroyed);
      expectWithContext(emitCount, 'emit count still 1').toBe(1);
      s.destroy();
    });

    it(`should not do anything if instance is destroyed (isDestroyed is true)`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s.destroy();
      const { drag, isDestroyed } = s;
      s['_start']({ type: 'start', x: 3, y: 4 });
      expectWithContext(s.drag, 'drag unchanged after destroy').toStrictEqual(drag);
      expectWithContext(s.isDestroyed, 'isDestroyed still true').toBe(isDestroyed);
      expectWithContext(emitCount, 'no events emitted').toBe(0);
      s.destroy();
    });
  });
};
