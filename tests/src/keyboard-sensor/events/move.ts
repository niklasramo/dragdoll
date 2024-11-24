import { assert } from 'chai';
import { createTestElement } from '../../utils/create-test-element.js';
import { focusElement } from '../../utils/focus-element.js';
import { KeyboardSensor } from '../../../../src/index.js';

export function eventMove() {
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
}
