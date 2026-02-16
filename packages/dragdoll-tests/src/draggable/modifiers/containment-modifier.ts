import { createContainmentModifier, createSnapModifier } from 'dragdoll';
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

// Element: 100x100 at (0, 0).
// Container: 250x250 at (0, 0).
// Max position: x=150, y=150 (250 - 100).
const CONTAINER = { x: 0, y: 0, width: 250, height: 250 };

export default () => {
  describe('createContainmentModifier', () => {
    defaultSetup();

    describe('without snap options', () => {
      it('should clamp movement at right and bottom edges', async () => {
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 200 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [createContainmentModifier(() => CONTAINER)],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        // Move right 200px, should clamp to 150 (250 - 100).
        pressKey('ArrowRight');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'clamped at right edge').toBe(150);

        // Move down 200px, should clamp to 150.
        pressKey('ArrowDown');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().y, 'clamped at bottom edge').toBe(150);

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });

      it('should clamp movement at left and top edges', async () => {
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 50 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [createContainmentModifier(() => CONTAINER)],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        // Element starts at (0, 0), move left -> should stay at 0.
        pressKey('ArrowLeft');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'clamped at left edge').toBe(0);

        // Move up -> should stay at 0.
        pressKey('ArrowUp');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().y, 'clamped at top edge').toBe(0);

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });

      it('should allow free movement within bounds', async () => {
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 30 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [createContainmentModifier(() => CONTAINER)],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        // Move right 30px (within bounds).
        pressKey('ArrowRight');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'moved right 30px').toBe(30);

        // Move down 30px (within bounds).
        pressKey('ArrowDown');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().y, 'moved down 30px').toBe(30);

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });
    });

    describe('with snapX/snapY options (grid-aware)', () => {
      it('should snap to grid cells within bounds', async () => {
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 40 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [
            createContainmentModifier(() => CONTAINER, {
              snapX: 40,
              snapY: 40,
            }),
          ],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        // Move right 1 cell.
        pressKey('ArrowRight');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'snapped to 40').toBe(40);

        // Move right 1 more cell.
        pressKey('ArrowRight');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'snapped to 80').toBe(80);

        // Move down 1 cell.
        pressKey('ArrowDown');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().y, 'snapped to 40').toBe(40);

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });

      it('should clip to the last full grid cell at boundary', async () => {
        // Container: 250x250, element: 100x100, grid: 40x40.
        // maxSnapX = floor((250 - 100) / 40) * 40 = 120.
        // At x=120, element right = 220 <= 250. Fully inside.
        // At x=160, element right = 260 > 250. Partially outside.
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 40 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [
            createContainmentModifier(() => CONTAINER, {
              snapX: 40,
              snapY: 40,
            }),
          ],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        // Move right 3 cells -> x=120 (last full cell).
        for (let i = 0; i < 3; i++) {
          pressKey('ArrowRight');
          await waitNextFrame();
        }
        expectWithContext(el.getBoundingClientRect().x, 'at last full cell x=120').toBe(120);

        // Move right 1 more -> should NOT move (would clip).
        pressKey('ArrowRight');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'stays at 120 (no partial cell)').toBe(120);

        // Move down 3 cells -> y=120 (last full cell).
        for (let i = 0; i < 3; i++) {
          pressKey('ArrowDown');
          await waitNextFrame();
        }
        expectWithContext(el.getBoundingClientRect().y, 'at last full cell y=120').toBe(120);

        // Move down 1 more -> should NOT move.
        pressKey('ArrowDown');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().y, 'stays at 120 (no partial cell)').toBe(120);

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });

      it('should clip to the nearest full grid cell at left edge', async () => {
        // Element at (120, 0), container at (10, 0, 400, 400).
        // minSnapX = ceil((10 - 120) / 40) * 40 = ceil(-2.75) * 40
        //          = -2 * 40 = -80.
        // At snapX=-80, element x = 120-80 = 40 >= 10. Fully inside.
        // At snapX=-120, element x = 120-120 = 0 < 10. Partially
        // outside.
        const el = createTestElement({ left: '120px' });
        const sensor = new KeyboardSensor(el, { moveDistance: 40 });
        const container = {
          x: 10,
          y: 0,
          width: 400,
          height: 400,
        };
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [
            createContainmentModifier(() => container, {
              snapX: 40,
            }),
          ],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        // Move left 2 cells -> snapX=-80, x=40. Fully inside.
        pressKey('ArrowLeft');
        await waitNextFrame();
        expectWithContext(el.getBoundingClientRect().x, 'moved to x=80').toBe(80);

        pressKey('ArrowLeft');
        await waitNextFrame();
        expectWithContext(
          el.getBoundingClientRect().x,
          'moved to x=40 (last full cell at left edge)',
        ).toBe(40);

        // Move left 1 more -> should NOT move (would clip).
        pressKey('ArrowLeft');
        await waitNextFrame();
        expectWithContext(
          el.getBoundingClientRect().x,
          'stays at 40 (no partial cell at left edge)',
        ).toBe(40);

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });
    });

    describe('chained snap + containment vs grid-aware', () => {
      it('chained: element lands at non-grid-aligned position', async () => {
        // Chaining [snapModifier, containmentModifier] separately.
        // Container: 250x250, element: 100x100, grid: 40x40.
        // Move right 4 cells:
        //   snap outputs 160, containment clamps to 150 (250-100).
        //   150 is NOT a multiple of 40 -> non-grid-aligned!
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 40 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [
            createSnapModifier(40, 40),
            createContainmentModifier(() => CONTAINER),
          ],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        for (let i = 0; i < 4; i++) {
          pressKey('ArrowRight');
          await waitNextFrame();
        }

        const x = el.getBoundingClientRect().x;
        expectWithContext(x, 'chained: position is 150 (non-grid-aligned)').toBe(150);
        expectWithContext(x % 40 !== 0, 'chained: position is NOT a multiple of grid cell').toBe(
          true,
        );

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });

      it('grid-aware: element always lands on a full grid cell', async () => {
        // Using containment modifier with snapX/snapY options.
        // Same setup as chained test.
        // Move right 4 cells:
        //   maxSnapX = floor((250-100)/40)*40 = 120.
        //   Element clips to 120, which IS grid-aligned.
        const el = createTestElement();
        const sensor = new KeyboardSensor(el, { moveDistance: 40 });
        const draggable = new Draggable([sensor], {
          elements: () => [el],
          positionModifiers: [
            createContainmentModifier(() => CONTAINER, {
              snapX: 40,
              snapY: 40,
            }),
          ],
        });

        focusElement(el);
        pressKey('Enter');
        await waitNextFrame();

        for (let i = 0; i < 4; i++) {
          pressKey('ArrowRight');
          await waitNextFrame();
        }

        const x = el.getBoundingClientRect().x;
        expectWithContext(x, 'grid-aware: position is 120 (grid-aligned)').toBe(120);
        expectWithContext(x % 40 === 0, 'grid-aware: position IS a multiple of grid cell').toBe(
          true,
        );

        pressKey('Enter');
        draggable.destroy();
        sensor.destroy();
        el.remove();
      });
    });
  });
};
