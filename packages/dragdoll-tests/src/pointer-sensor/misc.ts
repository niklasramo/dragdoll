import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';

export default () => {
  describe('misc', () => {
    defaultSetup();

    describe('target element parameter', () => {
      it('should accept document.documentElement', () => {
        const s = new PointerSensor(document.documentElement, { sourceEvents: 'mouse' });
        document.documentElement.dispatchEvent(new MouseEvent('mousedown'));
        expect(s.drag).not.toBe(null);
        s.destroy();
      });

      it('should accept document.body', () => {
        const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });
        document.body.dispatchEvent(new MouseEvent('mousedown'));
        expect(s.drag).not.toBe(null);
        s.destroy();
      });

      it('should accept a descendant of document.body', () => {
        const el = createTestElement();
        const s = new PointerSensor(el, { sourceEvents: 'mouse' });
        el.dispatchEvent(new MouseEvent('mousedown'));
        expect(s.drag).not.toBe(null);
        el.remove();
        s.destroy();
      });
    });
  });
};
