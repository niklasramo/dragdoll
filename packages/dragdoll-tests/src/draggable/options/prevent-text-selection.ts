import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

function selectElementText(el: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = document.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

function getSelectionRangeCount() {
  return document.getSelection()?.rangeCount ?? 0;
}

export default () => {
  describe('preventTextSelection', () => {
    defaultSetup();

    it('should clear text selection when drag starts (default: true)', async () => {
      const el = createTestElement();
      el.textContent = 'Selectable text';
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], { elements: () => [el] });

      focusElement(el);
      selectElementText(el);
      expectWithContext(getSelectionRangeCount(), 'selection before drag').toBe(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      expectWithContext(getSelectionRangeCount(), 'selection cleared after drag start').toBe(0);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });

    it('should not clear text selection when preventTextSelection is false', async () => {
      const el = createTestElement();
      el.textContent = 'Selectable text';
      const keyboardSensor = new KeyboardSensor(el, { moveDistance: 1 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [el],
        preventTextSelection: false,
      });

      focusElement(el);
      selectElementText(el);
      expectWithContext(getSelectionRangeCount(), 'selection before drag').toBe(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      expectWithContext(
        getSelectionRangeCount(),
        'selection persists when preventTextSelection false',
      ).toBe(1);

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      draggable.destroy();
      keyboardSensor.destroy();
      el.remove();
    });
  });
};
