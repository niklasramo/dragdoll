import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { startDrag, endDrag, move } from '../utils/keyboard-helpers.js';
import { DndContext, Draggable, Droppable, KeyboardSensor } from '../../../src/index.js';

export function events() {
  describe('events', () => {
    // helpers imported from ../utils/keyboard-helpers
    it('should emit start and end events during drag lifecycle', async () => {
      const events: string[] = [];
      const dragElement = createTestElement({ left: '0px', top: '0px' });
      const dropElement = createTestElement({ left: '200px', top: '0px' });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('start', (data) => {
        assert.equal(data.draggable, draggable);
        assert.instanceOf(data.targets, Map);
        assert.equal(data.targets.size, 1);
        assert.isTrue(data.targets.has(droppable.id));
        events.push('start');
      });

      dndContext.on('end', (data) => {
        assert.equal(data.draggable, draggable);
        assert.instanceOf(data.targets, Map);
        assert.equal(data.targets.size, 1);
        assert.isTrue(data.targets.has(droppable.id));
        events.push('end');
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      await startDrag(dragElement);

      assert.deepEqual(events, ['start']);
      events.length = 0;

      await endDrag();

      assert.deepEqual(events, ['end']);

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should emit move events during drag movement', async () => {
      const events: string[] = [];
      const dragElement = createTestElement({ left: '0px', top: '0px' });
      const dropElement = createTestElement({ left: '200px', top: '0px' });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('move', (data) => {
        assert.equal(data.draggable, draggable);
        assert.instanceOf(data.targets, Map);
        events.push('move');
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      await startDrag(dragElement);

      await move('Right');

      assert.equal(events.length, 1);
      assert.equal(events[0], 'move');

      await endDrag();

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should emit enter and leave events when draggable enters/leaves droppable', async () => {
      const events: Array<{
        type: string;
        collisions: number;
        addedContacts?: number;
        removedContacts?: number;
      }> = [];

      // Create draggable element at 0,0
      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      // Create droppable element at 100,0
      const dropElement = createTestElement({
        left: '100px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 101 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({
          type: 'enter',
          collisions: data.collisions.length,
          addedContacts: data.addedContacts.size,
        });
      });

      dndContext.on('leave', (data) => {
        events.push({
          type: 'leave',
          collisions: data.collisions.length,
          removedContacts: data.removedContacts.size,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging (no collision initially)
      await startDrag(dragElement);

      // Move right to enter droppable area
      await move('Right');

      // Should have enter event
      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].collisions, 1);
      assert.equal(events[0].addedContacts, 1);

      // Move right again to leave droppable area
      await move('Right');

      // Should have leave event
      assert.equal(events.length, 2);
      assert.equal(events[1].type, 'leave');
      assert.equal(events[1].collisions, 0);
      assert.equal(events[1].removedContacts, 1);

      await endDrag();

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should include collisions in end event when draggable ends over droppable', async () => {
      const events: string[] = [];

      // Create overlapping elements
      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('end', (data) => {
        assert.equal(data.draggable, draggable);
        assert.equal(data.collisions.length, 1);
        assert.isTrue(data.collisions.some((c) => c.droppableId === droppable.id));
        events.push('end');
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging (should be overlapping)
      await startDrag(dragElement);

      // End dragging (should include collisions in end)
      await endDrag();

      assert.equal(events.length, 1);
      assert.equal(events[0], 'end');

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should emit addDraggable and removeDraggable events', () => {
      const events: Array<{ type: string; draggable: any }> = [];
      const dragElement = createTestElement();

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const dndContext = new DndContext();

      dndContext.on('addDraggable', (data) => {
        events.push({ type: 'addDraggable', draggable: data.draggable });
      });

      dndContext.on('removeDraggable', (data) => {
        events.push({ type: 'removeDraggable', draggable: data.draggable });
      });

      // Add draggable
      dndContext.addDraggable(draggable);

      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'addDraggable');
      assert.equal(events[0].draggable, draggable);

      // Remove draggable
      dndContext.removeDraggable(draggable);

      assert.equal(events.length, 2);
      assert.equal(events[1].type, 'removeDraggable');
      assert.equal(events[1].draggable, draggable);

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
    });

    it('should emit addDroppable and removeDroppable events', () => {
      const events: Array<{ type: string; droppable: any }> = [];
      const dropElement = createTestElement();

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('addDroppables', (data) => {
        data.droppables.forEach((droppable) => {
          events.push({ type: 'addDroppable', droppable });
        });
      });

      dndContext.on('removeDroppables', (data) => {
        data.droppables.forEach((droppable) => {
          events.push({ type: 'removeDroppable', droppable });
        });
      });

      // Add droppable
      dndContext.addDroppables([droppable]);

      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'addDroppable');
      assert.equal(events[0].droppable, droppable);

      // Remove droppable
      dndContext.removeDroppables([droppable]);

      assert.equal(events.length, 2);
      assert.equal(events[1].type, 'removeDroppable');
      assert.equal(events[1].droppable, droppable);

      // Cleanup
      dndContext.destroy();
      droppable.destroy();
      dropElement.remove();
    });

    it('should emit end with isCancelled=true when drag is cancelled', async () => {
      const events: string[] = [];
      const dragElement = createTestElement();

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const dndContext = new DndContext();

      dndContext.on('end', (data) => {
        assert.equal(data.draggable, draggable);
        assert.isTrue(data.isCancelled);
        events.push('end');
      });

      dndContext.addDraggable(draggable);

      // Start dragging
      await startDrag(dragElement);

      // Cancel dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      assert.equal(events.length, 1);
      assert.equal(events[0], 'end');

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
    });

    it('should emit destroy event when context is destroyed', () => {
      const events: string[] = [];
      const dndContext = new DndContext();

      dndContext.on('destroy', () => {
        events.push('destroy');
      });

      dndContext.destroy();

      assert.equal(events.length, 1);
      assert.equal(events[0], 'destroy');
    });
  });

  describe('event flow and ordering', () => {
    it('should emit leave → enter → collide in order when transitioning between droppables', async () => {
      const order: string[] = [];

      const dragEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropA = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropB = createTestElement({ left: '50px', top: '0px', width: '40px', height: '40px' });

      const sensor = new KeyboardSensor(dragEl, { moveDistance: 60 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: 'g' });
      const droppableA = new Droppable(dropA, { accept: ['g'] });
      const droppableB = new Droppable(dropB, { accept: ['g'] });
      const ctx = new DndContext();

      ctx.on('leave', () => order.push('leave'));
      ctx.on('enter', () => order.push('enter'));
      ctx.on('collide', () => order.push('collide'));

      ctx.addDraggable(draggable);
      ctx.addDroppables([droppableA, droppableB]);

      await startDrag(dragEl);
      order.length = 0; // capture only transition events
      await move('Right');

      assert.isTrue(order.includes('enter'));
      if (order.includes('leave')) {
        assert.isBelow(order.indexOf('leave'), order.indexOf('enter'));
      }

      ctx.destroy();
      draggable.destroy();
      droppableA.destroy();
      droppableB.destroy();
      sensor.destroy();
      dragEl.remove();
      dropA.remove();
      dropB.remove();
    });

    it('should emit end with collisions when ending after first enter', async () => {
      const events: string[] = [];

      const dragEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });

      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: 'g' });
      const droppable = new Droppable(dropEl, { accept: ['g'] });
      const ctx = new DndContext();

      let gotEnter = false;
      ctx.on('enter', ({ collisions }) => {
        events.push('enter');
        gotEnter = true;
        assert.isAtLeast(collisions.length, 1);
      });

      ctx.on('end', ({ isCancelled, collisions }) => {
        events.push('end');
        assert.isFalse(isCancelled);
        assert.isAtLeast(collisions.length, 1);
      });

      ctx.addDraggable(draggable);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      await waitNextFrame();
      assert.isTrue(gotEnter);
      await endDrag();
      assert.deepEqual(events, ['enter', 'end']);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });

    it('should honor clearTargets when accept changes mid-drag', async () => {
      const events: string[] = [];

      const dragEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });

      let accepts = false;
      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: 'g' });
      const droppable = new Droppable(dropEl, { accept: () => accepts });
      const ctx = new DndContext();

      ctx.on('enter', () => events.push('enter'));

      ctx.addDraggable(draggable);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      assert.equal(events.length, 0);

      accepts = true;
      ctx.clearTargets(draggable);
      ctx.detectCollisions(draggable);
      await waitNextFrame();

      assert.deepEqual(events, ['enter']);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });

    it('should tolerate removing a droppable during enter emission', async () => {
      const events: string[] = [];

      const dragEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });

      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: 'g' });
      const droppable = new Droppable(dropEl, { accept: ['g'] });
      const ctx = new DndContext();

      let shouldRemove = false;
      ctx.on('enter', () => {
        events.push('enter');
        shouldRemove = true;
      });

      ctx.on('end', () => {
        events.push('end');
      });

      ctx.addDraggable(draggable);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      if (shouldRemove) ctx.removeDroppables([droppable]);
      await waitNextFrame();
      await endDrag();

      assert.deepEqual(events, ['enter', 'end']);
      assert.isFalse(ctx.droppables.has(droppable.id));

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });

    it('should expose mutable drag data via getDragData during lifecycle', async () => {
      const seen: Array<{ phase: string; value: number }> = [];

      const dragEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropEl = createTestElement({ left: '60px', top: '0px', width: '40px', height: '40px' });

      const sensor = new KeyboardSensor(dragEl, { moveDistance: 10 });
      const draggable = new Draggable([sensor], { elements: () => [dragEl], group: 'g' });
      const droppable = new Droppable(dropEl, { accept: ['g'] });
      const ctx = new DndContext();

      ctx.on('start', () => {
        const data = ctx.drags.get(draggable)!;
        data.data.counter = 1;
        seen.push({ phase: 'start', value: data.data.counter });
      });

      ctx.on('move', () => {
        const data = ctx.drags.get(draggable)!;
        data.data.counter += 1;
        seen.push({ phase: 'move', value: data.data.counter });
      });

      ctx.on('end', () => {
        const data = ctx.drags.get(draggable);
        assert.isNotNull(data);
        seen.push({ phase: 'end', value: data!.data.counter });
      });

      ctx.addDraggable(draggable);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      await move('Right');
      await endDrag();

      assert.deepEqual(
        seen.map((s) => s.phase),
        ['start', 'move', 'end'],
      );
      assert.deepEqual(
        seen.map((s) => s.value),
        [1, 2, 2],
      );

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
  });
}
