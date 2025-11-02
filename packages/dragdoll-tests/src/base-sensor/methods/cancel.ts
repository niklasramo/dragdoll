import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('cancel', () => {
    defaultSetup();

    it(`should reset drag data`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      s.cancel();
      expect(s.drag).toBe(null);
      s.destroy();
    });

    it(`should not modify isDestroyed property`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      expect(s.isDestroyed).toBe(false);
      s.cancel();
      expect(s.isDestroyed).toBe(false);
      s.destroy();
    });

    it(`should emit "cancel" event with correct arguments after updating instance properties`, () => {
      const s = new BaseSensor();
      let emitCount = 0;
      s.on('cancel', (data) => {
        expect(s.drag).toStrictEqual({ x: data.x, y: data.y });
        expect(s.isDestroyed).toBe(false);
        expect(data).toStrictEqual({
          type: 'cancel',
          x: 1,
          y: 2,
        });
        ++emitCount;
      });
      s['_start']({ type: 'start', x: 1, y: 2 });
      s.cancel();
      expect(emitCount).toBe(1);
      s.destroy();
    });

    it(`should not do anything if drag is not active`, () => {
      const s = new BaseSensor();
      const { drag, isDestroyed } = s;
      let emitCount = 0;
      s.on('cancel', () => void ++emitCount);
      s.cancel();
      expect(s.drag).toStrictEqual(drag);
      expect(s.isDestroyed).toBe(isDestroyed);
      expect(emitCount).toBe(0);
      s.destroy();
    });
  });
};
