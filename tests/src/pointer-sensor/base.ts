import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { PointerSensor } from '../../../src/index.js';

export function base() {
  describe('target element parameter', () => {
    it('should accept document.documentElement', function () {
      const s = new PointerSensor(document.documentElement, { sourceEvents: 'mouse' });
      document.documentElement.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
      s.destroy();
    });

    it('should accept document.body', function () {
      const s = new PointerSensor(document.body, { sourceEvents: 'mouse' });
      document.body.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
      s.destroy();
    });

    it('should accept a descendant of document.body', function () {
      const el = createTestElement();
      const s = new PointerSensor(el, { sourceEvents: 'mouse' });
      el.dispatchEvent(new MouseEvent('mousedown'));
      assert.notEqual(s.drag, null);
      el.remove();
      s.destroy();
    });
  });
}
