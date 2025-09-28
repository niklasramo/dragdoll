import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { focusElement } from '../utils/focus-element.js';
import {
  DndContext,
  Draggable,
  Droppable,
  KeyboardSensor,
  AdvancedCollisionDetector,
  AdvancedCollisionData,
} from '../../../src/index.js';

export function advancedCollisionDetection() {
  describe('advanced collision detection', () => {
    it('should compute collisions based on visible rects (clipped)', async () => {
      const collisionEvents: any[] = [];

      // Scrollable/clipping container
      const container = createTestElement({
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
      });

      // Draggable partially outside container, but element will be inside container DOM-wise.
      const drag = createTestElement({ left: '80px', top: '80px', width: '50px', height: '50px' });
      container.appendChild(drag);

      // Droppable fully inside container
      const drop = createTestElement({ left: '60px', top: '60px', width: '50px', height: '50px' });
      container.appendChild(drop);

      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: 'g' });
      const droppable = new Droppable(drop, { accept: ['g'] });

      const dnd = new DndContext<AdvancedCollisionData>({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
      });

      dnd.on('enter', (data) => {
        collisionEvents.push({ type: 'enter', collisions: data.collisions });
      });

      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);

      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should collide because visible areas overlap within container
      assert.equal(collisionEvents.length, 1);
      assert.equal(collisionEvents[0].collisions.length, 1);
      const cd = collisionEvents[0].collisions[0] as AdvancedCollisionData;
      assert.isAbove(cd.intersectionScore, 0);
      assert.isAtLeast(cd.draggableVisibleRect.width, 1);
      assert.isAtLeast(cd.droppableVisibleRect.width, 1);

      // Cleanup
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      container.remove();
    });

    it('should update cache on scroll and resize', async () => {
      const container = createTestElement({
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
      });
      const drag = createTestElement({ left: '0px', top: '0px', width: '50px', height: '50px' });
      container.appendChild(drag);
      const drop = createTestElement({ left: '60px', top: '0px', width: '50px', height: '50px' });
      container.appendChild(drop);

      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: 'g' });
      const droppable = new Droppable(drop, { accept: ['g'] });

      const dnd = new DndContext<AdvancedCollisionData>({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
      });

      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);

      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      // Trigger scroll/resize to invalidate caches
      window.dispatchEvent(new Event('scroll'));
      window.dispatchEvent(new Event('resize'));
      await new Promise((r) => setTimeout(r, 50));

      // No assertions on internal state; ensure no errors and cleanup works.
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      container.remove();
    });

    it('should sort ties by smaller droppable visible area first', async () => {
      const container = createTestElement({
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
      });

      // Draggable covers the whole container (visible rect 100x100)
      const drag = createTestElement({ left: '0px', top: '0px', width: '200px', height: '200px' });
      container.appendChild(drag);

      // Droppable A fully visible (80x80)
      const dropA = createTestElement({ left: '0px', top: '0px', width: '80px', height: '80px' });
      container.appendChild(dropA);

      // Create a dedicated clipping parent for droppable B so that it remains
      // clipped even if the FCCC is excluded from the chain.
      const clipB = createTestElement({
        left: '60px',
        top: '0px',
        width: '40px',
        height: '100px',
        overflow: 'hidden',
      });
      container.appendChild(clipB);

      // Droppable B inside clipB; its visible rect should be 40x80
      const dropB = createTestElement({ left: '0px', top: '0px', width: '80px', height: '80px' });
      clipB.appendChild(dropB);

      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: 'g' });
      const droppableA = new Droppable(dropA, { accept: ['g'] });
      const droppableB = new Droppable(dropB, { accept: ['g'] });

      const dnd = new DndContext<AdvancedCollisionData>({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
      });

      let firstCollisionId: any = null;
      dnd.on('enter', (data) => {
        firstCollisionId = data.collisions[0]?.droppableId;
      });

      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppableA, droppableB]);

      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      // Intersection scores tie at 100 for both; smaller visible area (B) should come first
      assert.equal(firstCollisionId, droppableB.id);

      // Cleanup
      dnd.destroy();
      draggable.destroy();
      droppableA.destroy();
      droppableB.destroy();
      keyboard.destroy();
      container.remove();
      clipB.remove();
    });

    it('should not collide when droppable is fully clipped', async () => {
      const collisionEvents: any[] = [];
      const container = createTestElement({
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
      });

      const drag = createTestElement({ left: '0px', top: '0px', width: '80px', height: '80px' });
      container.appendChild(drag);

      // Place droppable completely outside container's visible area
      const drop = createTestElement({ left: '150px', top: '0px', width: '50px', height: '50px' });
      container.appendChild(drop);

      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: 'g' });
      const droppable = new Droppable(drop, { accept: ['g'] });

      const dnd = new DndContext<AdvancedCollisionData>({
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
      });

      dnd.on('enter', (data) => {
        collisionEvents.push({ collisions: data.collisions });
      });

      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);

      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      assert.equal(collisionEvents.length, 0);

      // Cleanup
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      container.remove();
    });

    it('should support absolute visibility logic (window-relative)', async () => {
      const collisionEvents: any[] = [];

      // Outer scrollable clipping container
      const outer = createTestElement({
        left: '0px',
        top: '0px',
        width: '100px',
        height: '100px',
        overflow: 'hidden',
      });

      // Inner container scrolled/clipped inside outer
      const inner = createTestElement({
        left: '0px',
        top: '0px',
        width: '200px',
        height: '200px',
      });
      outer.appendChild(inner);

      // Draggable positioned fully outside the outer visible area (to the right)
      const drag = createTestElement({ left: '150px', top: '10px', width: '80px', height: '80px' });
      inner.appendChild(drag);

      // Droppable inside outer visible area
      const drop = createTestElement({ left: '10px', top: '10px', width: '80px', height: '80px' });
      inner.appendChild(drop);

      const keyboard = new KeyboardSensor(drag, { moveDistance: 10 });
      const draggable = new Draggable([keyboard], { elements: () => [drag], group: 'g' });
      const droppable = new Droppable(drop, { accept: ['g'] });

      // With relative logic, if FCCC is the outer container, parts could overlap
      // relative to FCCC even when drag is not visible to the user. With absolute
      // logic we expect no collision because drag is fully outside the window-visible
      // region after clipping through outer.
      const dnd = new DndContext<AdvancedCollisionData>({
        collisionDetector: (ctx) =>
          new AdvancedCollisionDetector(ctx, { visibilityLogic: 'absolute' }),
      });

      dnd.on('enter', (data) => {
        collisionEvents.push({ type: 'enter', collisions: data.collisions });
      });

      dnd.addDraggables([draggable]);
      dnd.addDroppables([droppable]);

      focusElement(drag);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      // Draggable is not visible to the user due to clipping to outer/window
      // so there should be no enter event.
      assert.equal(collisionEvents.length, 0);

      // Cleanup
      dnd.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboard.destroy();
      outer.remove();
      inner.remove();
    });
  });
}
