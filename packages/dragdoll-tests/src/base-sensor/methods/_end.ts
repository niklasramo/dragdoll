import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('_end', () => {
    defaultSetup();

    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_end']({ type: 'end', x: 5, y: 6 });
      expect(s.drag).toBe(null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      expect(s.isDestroyed).toBe(false);
      s['_end']({ type: 'end', x: 5, y: 6 });
      expect(s.isDestroyed).toBe(false);
      s.destroy();
    });

    it(`should emit "end" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const endArgs = { type: 'end', x: 5, y: 6 } as const;
      let emitCount = 0;
      s.on('end', (data) => {
        expect(s.drag).toStrictEqual({ x: data.x, y: data.y });
        expect(s.isDestroyed).toBe(false);
        expect(data).toStrictEqual(endArgs);
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s['_end'](endArgs);
      expect(emitCount).toBe(1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('end', () => void ++emitCount);
      s['_end']({ type: 'end', x: 3, y: 4 });
      expect(s.drag).toStrictEqual(drag);
      expect(s.isDestroyed).toBe(isDestroyed);
      expect(emitCount).toBe(0);
      s.destroy();
    });
  });
};
