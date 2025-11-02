import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('on', () => {
    defaultSetup();

    it('should return a unique symbol by default', () => {
      const el = createTestElement();
      const s = new PointerSensor(el);
      const idA = s.on('start', () => {});
      const idB = s.on('start', () => {});
      expect(typeof idA).toBe('symbol');
      expect(idA).not.toBe(idB);
      el.remove();
      s.destroy();
    });

    it('should allow duplicate event listeners', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let counter = 0;
      const listener = () => {
        ++counter;
      };

      s.on('start', listener);
      s.on('start', listener);

      el.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );

      expect(counter).toBe(2);

      el.remove();
      s.destroy();
    });

    it('should remove the existing listener and add the new one if the same id is used', () => {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      let msg = '';

      s.on('start', () => void (msg += 'a'), 1);
      s.on('start', () => void (msg += 'b'), 2);
      s.on('start', () => void (msg += 'c'), 1);

      el.dispatchEvent(
        new MouseEvent('mousedown', {
          clientX: 0,
          clientY: 0,
          bubbles: true,
          cancelable: true,
          view: window,
        }),
      );

      expect(msg).toBe('bc');

      el.remove();
      s.destroy();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const el = createTestElement();
      const s = new PointerSensor(el);

      const idA = Symbol();
      expect(s.on('start', () => {}, idA)).toBe(idA);

      const idB = 1;
      expect(s.on('start', () => {}, idB)).toBe(idB);

      const idC = 'foo';
      expect(s.on('start', () => {}, idC)).toBe(idC);

      el.remove();
      s.destroy();
    });
  });
};
