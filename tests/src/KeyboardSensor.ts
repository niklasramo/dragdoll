import { assert } from 'chai';
import { createTestElement } from './utils/createTestElement.js';
import { addDefaultPageStyles, removeDefaultPageStyles } from './utils/defaultPageStyles.js';
import { KeyboardSensor, KeyboardSensorStartEvent } from '../../src/index.js';

describe('KeyboardSensor', () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  describe('drag property', () => {
    it(`should be null on init`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.drag, null);
      el.remove();
      s.destroy();
    });
  });

  describe('isDestroyed property', () => {
    it(`should be false on init`, function () {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      assert.equal(s.isDestroyed, false);
      el.remove();
      s.destroy();
    });
  });

  describe('start event', () => {
    it(`should be triggered on Enter and Space when sensor element is focused`, function () {
      ['Enter', ' '].forEach((key) => {
        const el = createTestElement({ left: '10px', top: '20px' });
        const elDecoy = createTestElement({ left: '10px', top: '20px' });
        const s = new KeyboardSensor(el);

        let startEvent: KeyboardSensorStartEvent | null = null;
        s.on('start', (e) => {
          if (startEvent === null) {
            startEvent = e;
          } else {
            assert.fail('start event listener called twice');
          }
        });

        const srcEvent = new KeyboardEvent('keydown', { key });

        // Drag should not start if there is no focused element.
        document.dispatchEvent(srcEvent);
        assert.equal(s.drag, null);

        // Drag should not start if any other element than sensor element is
        // focused.
        elDecoy.focus();
        document.dispatchEvent(srcEvent);
        assert.equal(s.drag, null);

        // Drag should start if the sensor element is focused.
        el.focus();
        document.dispatchEvent(srcEvent);
        assert.deepEqual(startEvent, {
          type: 'start',
          srcEvent: srcEvent,
          x: 10,
          y: 20,
        });

        s.destroy();
        el.remove();
        elDecoy.remove();
      });
    });
  });

  describe('on method', () => {
    it('should return a unique symbol by default', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      const idA = s.on('start', () => {});
      const idB = s.on('start', () => {});
      assert.equal(typeof idA, 'symbol');
      assert.notEqual(idA, idB);
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

      el.focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      assert.equal(counter, 2);

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

      el.focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      assert.equal(msg, 'bc');

      el.remove();
      s.destroy();
    });

    it('should allow defining a custom id (string/symbol/number) for the event listener via third argument', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);

      const idA = Symbol();
      assert.equal(
        s.on('start', () => {}, idA),
        idA,
      );

      const idB = 1;
      assert.equal(
        s.on('start', () => {}, idB),
        idB,
      );

      const idC = 'foo';
      assert.equal(
        s.on('start', () => {}, idC),
        idC,
      );

      el.remove();
      s.destroy();
    });
  });

  describe('off method', () => {
    it('should remove an event listener based on id', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el);
      let msg = '';

      const idA = s.on('start', () => void (msg += 'a'));
      s.on('start', () => void (msg += 'b'));
      s.off('start', idA);

      el.focus();
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      assert.equal(msg, 'b');
    });
  });

  describe('updateSettings method', () => {
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
});
