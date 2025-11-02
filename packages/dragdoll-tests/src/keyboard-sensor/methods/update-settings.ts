import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';

export default () => {
  describe('updateSettings', () => {
    defaultSetup();

    it(`should update settings`, () => {
      const initSettings = {
        moveDistance: 25,
        cancelOnBlur: false,
        cancelOnVisibilityChange: false,
        startPredicate: () => null,
        movePredicate: () => null,
        cancelPredicate: () => null,
        endPredicate: () => null,
      };
      const updatedSettings = {
        moveDistance: 50,
        cancelOnBlur: true,
        cancelOnVisibilityChange: true,
        startPredicate: () => undefined,
        movePredicate: () => undefined,
        cancelPredicate: () => undefined,
        endPredicate: () => undefined,
      };

      const el = createTestElement();
      const s = new KeyboardSensor(el, initSettings);
      expect(s.moveDistance.x).toBe(initSettings.moveDistance);
      expect(s.moveDistance.y).toBe(initSettings.moveDistance);
      expect(s['_cancelOnBlur']).toBe(initSettings.cancelOnBlur);
      expect(s['_cancelOnVisibilityChange']).toBe(initSettings.cancelOnVisibilityChange);
      expect(s['_startPredicate']).toBe(initSettings.startPredicate);
      expect(s['_movePredicate']).toBe(initSettings.movePredicate);
      expect(s['_cancelPredicate']).toBe(initSettings.cancelPredicate);
      expect(s['_endPredicate']).toBe(initSettings.endPredicate);

      s.updateSettings(updatedSettings);
      expect(s.moveDistance.x).toBe(updatedSettings.moveDistance);
      expect(s.moveDistance.y).toBe(updatedSettings.moveDistance);
      expect(s['_cancelOnBlur']).toBe(updatedSettings.cancelOnBlur);
      expect(s['_cancelOnVisibilityChange']).toBe(updatedSettings.cancelOnVisibilityChange);
      expect(s['_startPredicate']).toBe(updatedSettings.startPredicate);
      expect(s['_movePredicate']).toBe(updatedSettings.movePredicate);
      expect(s['_cancelPredicate']).toBe(updatedSettings.cancelPredicate);
      expect(s['_endPredicate']).toBe(updatedSettings.endPredicate);

      s.destroy();
      el.remove();
    });
  });
};
