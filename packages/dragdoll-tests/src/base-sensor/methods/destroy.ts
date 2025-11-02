import { BaseSensor } from 'dragdoll/sensors/base';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('destroy', () => {
    defaultSetup();

    it(`should (if drag is active):
       1. set isDestroyed property to true
       2. emit "cancel" event with the current x/y coordinates
       3. reset drag data
       4. emit "destroy" event
       5. remove all listeners from the internal emitter`, () => {
      const s = new BaseSensor();
      s['_start']({ type: 'start', x: 1, y: 2 });
      const msgs: string[] = [];
      s.on('cancel', () => void msgs.push('cancel'));
      s.on('destroy', () => void msgs.push('destroy'));
      s.destroy();
      expect(s.isDestroyed).toBe(true);
      expect(s.drag).toBe(null);
      expect(msgs).toStrictEqual(['cancel', 'destroy']);
    });

    it(`should (if drag is not active):
       1. set isDestroyed property to true
       2. emit "destroy" event
       3. remove all listeners from the internal emitter`, () => {
      const s = new BaseSensor();
      const msgs: string[] = [];
      s.on('cancel', () => void msgs.push('cancel'));
      s.on('destroy', () => void msgs.push('destroy'));
      s.destroy();
      expect(s.isDestroyed).toBe(true);
      expect(s.drag).toBe(null);
      expect(msgs).toStrictEqual(['destroy']);
    });

    it(`should not do anything if the sensor is already destroyed`, () => {
      const s = new BaseSensor();
      s.destroy();
      const { drag, isDestroyed } = s;
      s.destroy();
      expect(s.drag).toStrictEqual(drag);
      expect(s.isDestroyed).toBe(isDestroyed);
    });
  });
};
