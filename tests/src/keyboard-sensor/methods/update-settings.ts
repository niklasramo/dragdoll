import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function methodUpdateSettings() {
  describe('updateSettings', () => {
    it(`should update settings`, function () {
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
      assert.equal(s.moveDistance.x, initSettings.moveDistance);
      assert.equal(s.moveDistance.y, initSettings.moveDistance);
      assert.equal(s['_cancelOnBlur'], initSettings.cancelOnBlur);
      assert.equal(s['_cancelOnVisibilityChange'], initSettings.cancelOnVisibilityChange);
      assert.equal(s['_startPredicate'], initSettings.startPredicate);
      assert.equal(s['_movePredicate'], initSettings.movePredicate);
      assert.equal(s['_cancelPredicate'], initSettings.cancelPredicate);
      assert.equal(s['_endPredicate'], initSettings.endPredicate);

      s.updateSettings(updatedSettings);
      assert.equal(s.moveDistance.x, updatedSettings.moveDistance);
      assert.equal(s.moveDistance.y, updatedSettings.moveDistance);
      assert.equal(s['_cancelOnBlur'], updatedSettings.cancelOnBlur);
      assert.equal(s['_cancelOnVisibilityChange'], updatedSettings.cancelOnVisibilityChange);
      assert.equal(s['_startPredicate'], updatedSettings.startPredicate);
      assert.equal(s['_movePredicate'], updatedSettings.movePredicate);
      assert.equal(s['_cancelPredicate'], updatedSettings.cancelPredicate);
      assert.equal(s['_endPredicate'], updatedSettings.endPredicate);

      s.destroy();
      el.remove();
    });
  });
}
