import { PointerSensor } from 'dragdoll/sensors/pointer';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('updateSettings', () => {
    defaultSetup();

    it(`should update startPredicate setting`, () => {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'mouse',
        startPredicate: () => false,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).toBe(null);

      s.updateSettings({ startPredicate: () => true });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).not.toBe(null);
    });

    it(`should update sourceEvents setting`, () => {
      const s = new PointerSensor(document.body, {
        sourceEvents: 'pointer',
        startPredicate: () => true,
      });

      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).toBe(null);

      s.updateSettings({ sourceEvents: 'mouse' });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      expect(s.drag).not.toBe(null);
    });
  });
};
