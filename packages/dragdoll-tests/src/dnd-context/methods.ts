import { DndContext } from 'dragdoll/dnd-context';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
import { focusElement } from '../utils/focus-element.js';
import { startDrag } from '../utils/keyboard-helpers.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export default () => {
  describe('methods', () => {
    defaultSetup();

    it('on/off should add and remove listeners by id', async () => {
      const calls: string[] = [];

      const dragElement = createTestElement();
      const dropElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '40px',
        height: '40px',
      });

      const sensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([sensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropElement, { accept: new Set(['g']) });
      const ctx = new DndContext();

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      const id1 = ctx.on('start', () => calls.push('a'));
      ctx.on('start', () => calls.push('b'));

      // Remove the first listener
      ctx.off('start', id1);

      await startDrag(dragElement);

      expect(calls).toStrictEqual(['b']);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('detectCollisions(draggable) should queue collisions for a single drag', async () => {
      const events: string[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '40px',
        height: '40px',
      });
      const dropElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '40px',
        height: '40px',
      });

      const sensor = new KeyboardSensor(dragElement, { moveDistance: 1 });
      const draggable = new Draggable([sensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropElement, { accept: new Set(['g']) });
      const ctx = new DndContext();

      ctx.on('collide', () => events.push('collide'));

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      // Start drag without moving; explicitly trigger detection for this draggable
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();
      events.length = 0; // ignore initial events

      ctx.detectCollisions(draggable);
      await waitNextFrame();

      expect(events.includes('collide')).toBe(true);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('detectCollisions() without args should queue for all active drags', async () => {
      const events: { d: Draggable }[] = [];

      const dragEl1 = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dragEl2 = createTestElement({
        left: '0px',
        top: '50px',
        width: '40px',
        height: '40px',
      });
      const dropEl1 = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropEl2 = createTestElement({
        left: '0px',
        top: '50px',
        width: '40px',
        height: '40px',
      });

      const s1 = new KeyboardSensor(dragEl1, { moveDistance: 1 });
      const s2 = new KeyboardSensor(dragEl2, { moveDistance: 1 });
      const dr1 = new Draggable([s1], { elements: () => [dragEl1], dndGroups: new Set(['g']) });
      const dr2 = new Draggable([s2], { elements: () => [dragEl2], dndGroups: new Set(['g']) });
      const dp1 = new Droppable(dropEl1, { accept: new Set(['g']) });
      const dp2 = new Droppable(dropEl2, { accept: new Set(['g']) });
      const ctx = new DndContext();

      ctx.on('collide', ({ draggable }) => events.push({ d: draggable }));

      ctx.addDraggables([dr1, dr2]);
      ctx.addDroppables([dp1, dp2]);

      // Start both drags
      focusElement(dragEl1);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      focusElement(dragEl2);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();
      events.length = 0; // ignore initial events

      // Call without args: should schedule detection for both active drags
      ctx.detectCollisions();
      await waitNextFrame();

      // We should observe collide for at least one, commonly both if overlapping
      expect(events.length >= 1).toBe(true);

      ctx.destroy();
      dr1.destroy();
      dr2.destroy();
      dp1.destroy();
      dp2.destroy();
      s1.destroy();
      s2.destroy();
      dragEl1.remove();
      dragEl2.remove();
      dropEl1.remove();
      dropEl2.remove();
    });
    it('updateDroppableClientRects should refresh cached rects', async () => {
      const el = createTestElement({ left: '0px', top: '0px', width: '50px', height: '50px' });
      const droppable = new Droppable(el, { accept: new Set(['x']) });
      const ctx = new DndContext();
      ctx.addDroppables([droppable]);

      // Read initial rect
      const before = droppable.getClientRect();

      // Change position
      el.style.left = '100px';
      el.style.top = '150px';

      // Let layout apply and then refresh cached rects
      await waitNextFrame();
      const expected = el.getBoundingClientRect();
      ctx.updateDroppableClientRects();
      const after = droppable.getClientRect();

      // Validate updated values match the DOM
      expect(after.x).toBe(expected.x);
      expect(after.y).toBe(expected.y);
      expect(after.width).toBe(before.width);
      expect(after.height).toBe(before.height);

      ctx.destroy();
      droppable.destroy();
      el.remove();
    });
  });

  describe('protected methods', () => {
    it('_isMatch should return false when dragged element equals droppable.element', async () => {
      const el = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const sensor = new KeyboardSensor(el, { moveDistance: 10 });
      const draggable = new Draggable([sensor], {
        elements: () => [el],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(el, { accept: new Set(['g']) });
      const ctx = new DndContext();

      // When not dragging, isMatch may be true; start drag so internal items exist
      focusElement(el);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      expect(ctx['_isMatch'](draggable, droppable)).toBe(false);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      el.remove();
    });

    it('_isMatch should respect droppable.accept function', async () => {
      const dragEl = createTestElement();
      const dropEl = createTestElement();
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], {
        elements: () => [dragEl],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropEl, { accept: () => false });
      const ctx = new DndContext();

      expect(ctx['_isMatch'](draggable, droppable)).toBe(false);

      droppable.accept = () => true;
      expect(ctx['_isMatch'](draggable, droppable)).toBe(true);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
  });
};
