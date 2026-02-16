import { createSnapModifier } from 'dragdoll';
import { Draggable } from 'dragdoll/draggable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../../utils/create-test-element.js';
import { defaultSetup } from '../../utils/default-setup.js';
import { expectWithContext } from '../../utils/expect-with-context.js';
import { focusElement } from '../../utils/focus-element.js';
import { waitNextFrame } from '../../utils/wait-next-frame.js';

function pressKey(key: string) {
  document.dispatchEvent(new KeyboardEvent('keydown', { key }));
}

export default () => {
  describe('createSnapModifier', () => {
    defaultSetup();

    it('should not move until movement reaches one grid cell', async () => {
      const el = createTestElement();
      const sensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        positionModifiers: [createSnapModifier(40, 40)],
      });

      focusElement(el);
      pressKey('Enter');
      await waitNextFrame();

      // 3 presses = 30px, less than 40px cell -> no snap.
      for (let i = 0; i < 3; i++) {
        pressKey('ArrowRight');
        await waitNextFrame();
      }
      expectWithContext(el.getBoundingClientRect().x, 'no snap at 30px').toBe(0);

      // 1 more press = 40px total -> snaps to first cell.
      pressKey('ArrowRight');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'snaps at 40px').toBe(40);

      pressKey('Enter');
      draggable.destroy();
      sensor.destroy();
      el.remove();
    });

    it('should snap to consecutive grid cells', async () => {
      const el = createTestElement();
      const sensor = new KeyboardSensor(el, { moveDistance: 40 });
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        positionModifiers: [createSnapModifier(40, 40)],
      });

      focusElement(el);
      pressKey('Enter');
      await waitNextFrame();

      pressKey('ArrowRight');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'cell 1').toBe(40);

      pressKey('ArrowRight');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'cell 2').toBe(80);

      pressKey('ArrowRight');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'cell 3').toBe(120);

      pressKey('Enter');
      draggable.destroy();
      sensor.destroy();
      el.remove();
    });

    it('should work with non-square grid cells', async () => {
      const el = createTestElement();
      const sensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        positionModifiers: [createSnapModifier(40, 20)],
      });

      focusElement(el);
      pressKey('Enter');
      await waitNextFrame();

      // X: 4 presses (40px) to snap one cell.
      for (let i = 0; i < 4; i++) {
        pressKey('ArrowRight');
        await waitNextFrame();
      }
      let rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'x snaps at 40px').toBe(40);
      expectWithContext(rect.y, 'y unchanged').toBe(0);

      // Y: 2 presses (20px) to snap one cell.
      for (let i = 0; i < 2; i++) {
        pressKey('ArrowDown');
        await waitNextFrame();
      }
      rect = el.getBoundingClientRect();
      expectWithContext(rect.x, 'x still 40').toBe(40);
      expectWithContext(rect.y, 'y snaps at 20px').toBe(20);

      pressKey('Enter');
      draggable.destroy();
      sensor.destroy();
      el.remove();
    });

    it('should handle bidirectional movement', async () => {
      const el = createTestElement();
      const sensor = new KeyboardSensor(el, { moveDistance: 40 });
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        positionModifiers: [createSnapModifier(40, 40)],
      });

      focusElement(el);
      pressKey('Enter');
      await waitNextFrame();

      // Move right 2 cells.
      pressKey('ArrowRight');
      await waitNextFrame();
      pressKey('ArrowRight');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'right 2 cells').toBe(80);

      // Move left 1 cell.
      pressKey('ArrowLeft');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'left 1 cell').toBe(40);

      // Move left 1 more cell -> back to start.
      pressKey('ArrowLeft');
      await waitNextFrame();
      expectWithContext(el.getBoundingClientRect().x, 'back to start').toBe(0);

      pressKey('Enter');
      draggable.destroy();
      sensor.destroy();
      el.remove();
    });
  });
};
