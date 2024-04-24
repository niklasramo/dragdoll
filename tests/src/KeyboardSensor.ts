import { assert } from 'chai';
import { createTestElement } from './utils/createTestElement.js';
import { focusElement } from './utils/focusElement.js';
import { blurElement } from './utils/blurElement.js';
import { wait } from './utils/wait.js';
import { addDefaultPageStyles, removeDefaultPageStyles } from './utils/defaultPageStyles.js';
import { KeyboardSensor } from '../../src/index.js';

// TODO:
// - Make sure you change settings on the fly during drag.
// - Make sure you can define moveDistance as a point object also.
// - Make sure destroy method works correctly.

describe('KeyboardSensor', () => {
  beforeEach(() => {
    addDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  afterEach(() => {
    removeDefaultPageStyles(document);
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  describe('settings', () => {
    describe('moveDistance', () => {
      it('should define the drag movement distance', () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { moveDistance: { x: 7, y: 9 } });

        // Make sure the moveDistance property is set correctly.
        assert.deepEqual(s.moveDistance, { x: 7, y: 9 });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure drag position is at 0,0.
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        // Move to the right.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

        // Make sure drag position is at 7,0.
        assert.deepEqual(s.drag, { x: 7, y: 0 });

        // Move down.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));

        // Make sure drag position is at 7,9.
        assert.deepEqual(s.drag, { x: 7, y: 9 });

        // Move left.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));

        // Make sure drag position is at 0,9.
        assert.deepEqual(s.drag, { x: 0, y: 9 });

        // Move up.
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));

        // Make sure drag position is at 0,0.
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        el.remove();
        s.destroy();
      });
    });

    describe('cancelOnBlur', () => {
      it('should cancel drag on blur when true', async () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { cancelOnBlur: true });

        // Make sure the cancelOnBlur property is set correctly.
        assert.equal(s['_cancelOnBlur'], true);

        // Count cancel events.
        let cancelEvents = 0;
        s.on('cancel', () => {
          ++cancelEvents;
        });

        // Count end events.
        let endEvents = 0;
        s.on('end', () => {
          ++endEvents;
        });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure drag is started.
        assert.notEqual(s.drag, null);

        // Blur the sensor element.
        blurElement(el);

        // The blur canceling is done asynchronously. We need to wait a bit.
        await wait(1);

        // Make sure drag is canceled, not ended.
        assert.equal(s.drag, null);
        assert.equal(cancelEvents, 1);
        assert.equal(endEvents, 0);

        el.remove();
        s.destroy();
      });
      it('should not cancel drag on blur when false', () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { cancelOnBlur: false });

        // Make sure the cancelOnBlur property is set correctly.
        assert.equal(s['_cancelOnBlur'], false);

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure drag is started.
        assert.notEqual(s.drag, null);

        // Blur the sensor element.
        blurElement(el);

        // Make sure drag is not canceled.
        assert.notEqual(s.drag, null);

        el.remove();
        s.destroy();
      });
    });

    describe('startPredicate', () => {
      it('should define the start predicate', () => {
        let returnValue: undefined | null | { x: number; y: number } = null;
        const el = createTestElement();
        const s = new KeyboardSensor(el, {
          startPredicate: (e, sensor) => {
            assert.equal(e.type, 'keydown');
            assert.equal(sensor, s);
            return returnValue;
          },
        });

        // Make sure the drag does not start if the predicate returns null.
        returnValue = null;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(s.drag, null);

        // Make sure the drag does not start if the predicate returns undefined.
        returnValue = undefined;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(s.drag, null);

        // Make sure the drag starts if the predicate returns a point.
        returnValue = { x: 10, y: 20 };
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.deepEqual(s.drag, { x: 10, y: 20 });

        el.remove();
        s.destroy();
      });

      it(`should start drag with Enter and Space by default when the target element is focused`, function () {
        ['Enter', ' '].forEach((key) => {
          const el = createTestElement();
          const elDecoy = createTestElement();
          const s = new KeyboardSensor(el);
          const srcEvent = new KeyboardEvent('keydown', { key });

          // Drag should not start if there is no focused element.
          document.dispatchEvent(srcEvent);
          assert.equal(s.drag, null);

          // Drag should not start if any other element than sensor element is
          // focused.
          focusElement(elDecoy);
          document.dispatchEvent(srcEvent);
          assert.equal(s.drag, null);

          // Drag should start if the sensor element is focused.
          focusElement(el);
          document.dispatchEvent(srcEvent);
          assert.deepEqual(s.drag, { x: 0, y: 0 });

          s.destroy();
          el.remove();
          elDecoy.remove();
        });
      });
    });

    describe('movePredicate', () => {
      it('should define the move predicate', () => {
        let returnValue: undefined | null | { x: number; y: number } = null;
        const el = createTestElement();
        const s = new KeyboardSensor(el, {
          movePredicate: (e, sensor) => {
            assert.equal(e.type, 'keydown');
            assert.equal(sensor, s);
            return returnValue;
          },
        });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure the drag does not move if the predicate returns null.
        returnValue = null;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        // Make sure the drag does not move if the predicate returns undefined.
        returnValue = undefined;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        // Make sure the drag moves if the predicate returns a point.
        returnValue = { x: 1, y: 1 };
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.deepEqual(s.drag, returnValue);

        el.remove();
        s.destroy();
      });

      it(`should move drag with arrow keys by default`, function () {
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].forEach((key) => {
          const el = createTestElement();
          const s = new KeyboardSensor(el, { moveDistance: 1 });
          const srcEvent = new KeyboardEvent('keydown', { key });

          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          document.dispatchEvent(srcEvent);

          switch (key) {
            case 'ArrowLeft':
              assert.deepEqual(s.drag, { x: -1, y: 0 });
              break;
            case 'ArrowRight':
              assert.deepEqual(s.drag, { x: 1, y: 0 });
              break;
            case 'ArrowUp':
              assert.deepEqual(s.drag, { x: 0, y: -1 });
              break;
            case 'ArrowDown':
              assert.deepEqual(s.drag, { x: 0, y: 1 });
              break;
          }

          s.destroy();
          el.remove();
        });
      });
    });

    describe('cancelPredicate', () => {
      it('should define the cancel predicate', () => {
        let returnValue: undefined | null | { x: number; y: number } = null;
        const el = createTestElement();
        const s = new KeyboardSensor(el, {
          cancelPredicate: (e, sensor) => {
            assert.equal(e.type, 'keydown');
            assert.equal(sensor, s);
            return returnValue;
          },
        });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure the drag is not canceled if the predicate returns null.
        returnValue = null;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        assert.notEqual(s.drag, null);

        // Make sure the drag is not canceled if the predicate returns undefined.
        returnValue = undefined;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        assert.notEqual(s.drag, null);

        // Make sure the drag is canceled if the predicate returns a point.
        returnValue = { x: 1, y: 1 };
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
        assert.equal(s.drag, null);

        el.remove();
        s.destroy();
      });

      it(`should cancel drag with Escape by default`, function () {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        const srcEvent = new KeyboardEvent('keydown', { key: 'Escape' });

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        document.dispatchEvent(srcEvent);
        assert.equal(s.drag, null);

        s.destroy();
        el.remove();
      });
    });

    describe('endPredicate', () => {
      it('should define the end predicate', () => {
        let returnValue: undefined | null | { x: number; y: number } = null;
        const el = createTestElement();
        const s = new KeyboardSensor(el, {
          endPredicate: (e, sensor) => {
            assert.equal(e.type, 'keydown');
            assert.equal(sensor, s);
            return returnValue;
          },
        });

        // Start drag.
        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        // Make sure the drag is not ended if the predicate returns null.
        returnValue = null;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.notEqual(s.drag, null);

        // Make sure the drag is not ended if the predicate returns undefined.
        returnValue = undefined;
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.notEqual(s.drag, null);

        // Make sure the drag is ended if the predicate returns a point.
        returnValue = { x: 1, y: 1 };
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.equal(s.drag, null);

        el.remove();
        s.destroy();
      });

      it(`should end drag with Enter and Space by default when the target element is focused`, function () {
        ['Enter', ' '].forEach((key) => {
          const el = createTestElement();
          const s = new KeyboardSensor(el);

          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          assert.deepEqual(s.drag, { x: 0, y: 0 });

          document.dispatchEvent(new KeyboardEvent('keydown', { key }));
          assert.equal(s.drag, null);

          s.destroy();
          el.remove();
        });
      });
    });
  });

  describe('properties', () => {
    describe('drag', () => {
      it(`should be null on init`, function () {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        assert.equal(s.drag, null);
        el.remove();
        s.destroy();
      });

      it(`should be null after destroy method is called`, function () {
        const el = createTestElement();
        const s = new KeyboardSensor(el);

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.notEqual(s.drag, null);

        s.destroy();
        assert.equal(s.drag, null);

        el.remove();
      });

      it(`should match the current drag position`, function () {
        const el = createTestElement();
        const s = new KeyboardSensor(el, { moveDistance: 1 });

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        assert.deepEqual(s.drag, { x: 1, y: 0 });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
        assert.deepEqual(s.drag, { x: 1, y: 1 });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
        assert.deepEqual(s.drag, { x: 0, y: 1 });

        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        assert.deepEqual(s.drag, { x: 0, y: 0 });

        s.destroy();
        el.remove();
      });
    });

    describe('isDestroyed', () => {
      it(`should be false on init`, function () {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        assert.equal(s.isDestroyed, false);
        el.remove();
        s.destroy();
      });

      it(`should be true after destroy method is called`, function () {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        s.destroy();
        assert.equal(s.isDestroyed, true);
        el.remove();
      });
    });
  });

  describe('events', () => {
    describe('start', () => {
      it(`should be triggered on drag start`, function () {
        const el = createTestElement({ left: '10px', top: '20px' });
        const s = new KeyboardSensor(el);
        const expectedEvent = {
          type: 'start',
          x: 10,
          y: 20,
          srcEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
        };

        let startEventCount = 0;

        s.on('start', (e) => {
          assert.deepEqual(e, expectedEvent);
          ++startEventCount;
        });

        focusElement(el);
        document.dispatchEvent(expectedEvent.srcEvent);

        assert.equal(startEventCount, 1);

        el.remove();
        s.destroy();
      });

      describe('move', () => {
        it('should be triggered on drag move', () => {
          const el = createTestElement();
          const s = new KeyboardSensor(el, { moveDistance: 1 });

          let expectedEvent: { type: 'move'; x: number; y: number; srcEvent: KeyboardEvent };
          let moveEventCount = 0;

          s.on('move', (e) => {
            assert.deepEqual(e, expectedEvent);
            ++moveEventCount;
            return;
          });

          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

          expectedEvent = {
            type: 'move',
            x: -1,
            y: 0,
            srcEvent: new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
          };
          document.dispatchEvent(expectedEvent.srcEvent);

          expectedEvent = {
            type: 'move',
            x: 0,
            y: 0,
            srcEvent: new KeyboardEvent('keydown', { key: 'ArrowRight' }),
          };
          document.dispatchEvent(expectedEvent.srcEvent);

          expectedEvent = {
            type: 'move',
            x: 0,
            y: -1,
            srcEvent: new KeyboardEvent('keydown', { key: 'ArrowUp' }),
          };
          document.dispatchEvent(expectedEvent.srcEvent);

          expectedEvent = {
            type: 'move',
            x: 0,
            y: 0,
            srcEvent: new KeyboardEvent('keydown', { key: 'ArrowDown' }),
          };
          document.dispatchEvent(expectedEvent.srcEvent);

          assert.equal(moveEventCount, 4);

          el.remove();
          s.destroy();
        });
      });

      describe('cancel', () => {
        it('should be triggered on drag cancel', () => {
          const el = createTestElement();
          const s = new KeyboardSensor(el);
          const cancelEvent = {
            type: 'cancel',
            x: 0,
            y: 0,
            srcEvent: new KeyboardEvent('keydown', { key: 'Escape' }),
          };

          let cancelEventCount = 0;

          s.on('cancel', (e) => {
            assert.deepEqual(e, cancelEvent);
            ++cancelEventCount;
          });

          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          document.dispatchEvent(cancelEvent.srcEvent);

          assert.equal(cancelEventCount, 1);

          el.remove();
          s.destroy();
        });
      });

      describe('end', () => {
        it('should be triggered on drag end', () => {
          const el = createTestElement();
          const s = new KeyboardSensor(el);
          const endEvent = {
            type: 'end',
            x: 0,
            y: 0,
            srcEvent: new KeyboardEvent('keydown', { key: 'Enter' }),
          };

          let endEventCount = 0;

          s.on('end', (e) => {
            assert.deepEqual(e, endEvent);
            ++endEventCount;
          });

          focusElement(el);
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
          document.dispatchEvent(endEvent.srcEvent);

          assert.equal(endEventCount, 1);

          el.remove();
          s.destroy();
        });
      });
    });
  });

  describe('methods', () => {
    describe('on', () => {
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

        focusElement(el);
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

        focusElement(el);
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

    describe('off', () => {
      it('should remove an event listener based on id', () => {
        const el = createTestElement();
        const s = new KeyboardSensor(el);
        let msg = '';

        const idA = s.on('start', () => void (msg += 'a'));
        s.on('start', () => void (msg += 'b'));
        s.off('start', idA);

        focusElement(el);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

        assert.equal(msg, 'b');
      });
    });

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
  });
});
