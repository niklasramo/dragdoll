import { assert } from 'chai';
import { IS_BROWSER } from '../../src/constants';
import { createTestElement } from './utils/createTestElement';
import { addDefaultPageStyles, removeDefaultPageStyles } from './utils/defaultPageStyles';
import { KeyboardSensor, KeyboardSensorStartEvent } from '../../src/index';

// PointerSensor

describe('KeyboardSensor', () => {
  beforeEach(() => {
    if (IS_BROWSER) {
      addDefaultPageStyles(document);
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    return;
  });

  afterEach(() => {
    if (IS_BROWSER) {
      removeDefaultPageStyles(document);
      return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    return;
  });

  describe('drag property', () => {
    it(`should be null on init`, function () {
      const s = new KeyboardSensor();
      assert.equal(s.drag, null);
      s.destroy();
    });
  });

  describe('isDestroyed property', () => {
    it(`should be false on init`, function () {
      const s = new KeyboardSensor();
      assert.equal(s.isDestroyed, false);
      s.destroy();
    });
  });

  describe('start event', () => {
    it(`should be triggered correctly on Enter`, function () {
      if (!IS_BROWSER) this.skip();

      const el = createTestElement({ left: '10px', top: '20px' });
      const s = new KeyboardSensor();

      let startEvent: KeyboardSensorStartEvent | null = null;
      s.on('start', (e) => {
        if (startEvent === null) {
          startEvent = e;
        } else {
          assert.fail('start event listener called twice');
        }
      });

      const srcEvent = new KeyboardEvent('keydown', { key: 'Enter' });

      // Drag should not start if there is no focused element.
      document.dispatchEvent(srcEvent);
      assert.equal(s.drag, null);

      // Drag should start if there is focused element.
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
    });
  });
});
