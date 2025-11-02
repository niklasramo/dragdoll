import { PointerSensor } from 'dragdoll/sensors/pointer';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('startPredicate', () => {
    defaultSetup();

    it('should allow start only when e.button is 0 by default', () => {
      const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });

      document.body.dispatchEvent(new MouseEvent('mousedown', { button: 1 }));
      expect(s.drag).toBe(null);

      document.body.dispatchEvent(new MouseEvent('mousedown', { button: 0 }));
      expect(s.drag).not.toBe(null);

      s.destroy();
    });

    it('should allow start when true is returned and prevent start when false is returned', () => {
      const s1 = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => true,
      });
      const s2 = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s1.drag).not.toBe(null);
      expect(s2.drag).toBe(null);

      s1.destroy();
      s2.destroy();
    });
  });
};
