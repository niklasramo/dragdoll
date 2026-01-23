import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { focusElement } from '../../utils/focus-element.js';

export default () => {
  describe('move', () => {
    defaultSetup();

    it('should be triggered on drag move', () => {
      const el = createTestElement();
      const s = new KeyboardSensor(el, { moveDistance: 1 });

      let expectedEvent: {
        type: 'move';
        startX: number;
        startY: number;
        x: number;
        y: number;
        deltaX: number;
        deltaY: number;
        srcEvent: KeyboardEvent;
      };
      let moveEventCount = 0;

      s.on('move', (e) => {
        expect(e).toStrictEqual(expectedEvent);
        ++moveEventCount;
        return;
      });

      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expectedEvent = {
        type: 'move',
        startX: 0,
        startY: 0,
        x: -1,
        y: 0,
        deltaX: -1,
        deltaY: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
      };
      document.dispatchEvent(expectedEvent.srcEvent);

      expectedEvent = {
        type: 'move',
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 1,
        deltaY: 0,
        srcEvent: new KeyboardEvent('keydown', { key: 'ArrowRight' }),
      };
      document.dispatchEvent(expectedEvent.srcEvent);

      expectedEvent = {
        type: 'move',
        startX: 0,
        startY: 0,
        x: 0,
        y: -1,
        deltaX: 0,
        deltaY: -1,
        srcEvent: new KeyboardEvent('keydown', { key: 'ArrowUp' }),
      };
      document.dispatchEvent(expectedEvent.srcEvent);

      expectedEvent = {
        type: 'move',
        startX: 0,
        startY: 0,
        x: 0,
        y: 0,
        deltaX: 0,
        deltaY: 1,
        srcEvent: new KeyboardEvent('keydown', { key: 'ArrowDown' }),
      };
      document.dispatchEvent(expectedEvent.srcEvent);

      expect(moveEventCount).toBe(4);

      el.remove();
      s.destroy();
    });
  });
};
