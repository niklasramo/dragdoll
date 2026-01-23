import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('_move', () => {
    defaultSetup();

    it(`should update drag data to reflect the provided coordinates`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_move']({ type: 'move', x: 3, y: 4 });
      expect(s.drag).toStrictEqual({
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
      expect(s.isDestroyed).toBe(false);
      s['_move']({ type: 'move', x: 3, y: 4 });
      expect(s.isDestroyed).toBe(false);
      s.destroy();
    });

    it(`should emit "move" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const moveArgs = { type: 'move', x: 3, y: 4 } as const;
      let emitCount = 0;
      s.on('move', (data) => {
        expect(s.drag).toStrictEqual({
          startX: data.startX,
          startY: data.startY,
          x: data.x,
          y: data.y,
          deltaX: data.deltaX,
          deltaY: data.deltaY,
        });
        expect(s.isDestroyed).toBe(false);
        expect(data).toStrictEqual({
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
      expect(emitCount).toBe(1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('move', () => void ++emitCount);
      s['_move']({ type: 'move', x: 3, y: 4 });
      expect(s.drag).toStrictEqual(drag);
      expect(s.isDestroyed).toBe(isDestroyed);
      expect(emitCount).toBe(0);
      s.destroy();
    });
  });
};
