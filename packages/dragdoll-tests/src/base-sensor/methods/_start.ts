import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('_start', () => {
    defaultSetup();

    it(`should create drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      expect(s.drag).toStrictEqual({ x: 1, y: 2 });
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      expect(s.isDestroyed).toBe(false);
      s['_start']({ type: 'start', x: 1, y: 2 });
      expect(s.isDestroyed).toBe(false);
      s.destroy();
    });

    it(`should emit "start" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      const startArgs = { type: 'start', x: 1, y: 2 } as const;
      let emitCount = 0;
      s.on('start', (data) => {
        expect(s.drag).toStrictEqual({ x: data.x, y: data.y });
        expect(s.isDestroyed).toBe(false);
        expect(data).toStrictEqual(startArgs);
        ++emitCount;
      });
      s['_start'](startArgs);
      expect(emitCount).toBe(1);
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
      expect(s.drag).toStrictEqual(drag);
      expect(s.isDestroyed).toBe(isDestroyed);
      expect(emitCount).toBe(1);
      s.destroy();
    });

    it(`should not do anything if instance is destroyed (isDestroyed is true)`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('start', () => void ++emitCount);
      s.destroy();
      const { drag, isDestroyed } = s;
      s['_start']({ type: 'start', x: 3, y: 4 });
      expect(s.drag).toStrictEqual(drag);
      expect(s.isDestroyed).toBe(isDestroyed);
      expect(emitCount).toBe(0);
      s.destroy();
    });
  });
};
