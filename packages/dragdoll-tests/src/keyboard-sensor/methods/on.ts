import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('on', () => {
    defaultSetup();

    it('should return a unique symbol by default', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const idA = s.on('start', () => {});
      const idB = s.on('start', () => {});
      expect(typeof idA).toBe('symbol');
      expect(idA).not.toBe(idB);
      el.remove();
      s.destroy();
    });

    it('should allow duplicate event listeners', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let counter = 0;
      const listener = () => {
        ++counter;
      };

      s.on('start', listener);
      s.on('start', listener);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(counter).toBe(2);

      el.remove();
      s.destroy();
    });

    it('should remove the existing listener and add the new one if the same id is used', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let msg = '';

      s.on('start', () => void (msg += 'a'), 1);
      s.on('start', () => void (msg += 'b'), 2);
      s.on('start', () => void (msg += 'c'), 1);

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(msg).toBe('bc');

      el.remove();
      s.destroy();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

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
