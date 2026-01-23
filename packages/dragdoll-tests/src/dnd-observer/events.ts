import { DndObserver } from 'dragdoll/dnd-observer';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
import { expectWithContext } from '../utils/expect-with-context.js';
import { endDrag, move, startDrag } from '../utils/keyboard-helpers.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export default () => {
  describe('events', () => {
    defaultSetup();

    // helpers imported from ../utils/keyboard-helpers
    it('should emit start and end events during drag lifecycle', async () => {
      const events: string[] = [];
      const dragElement = createTestElement({ left: '0px', top: '0px' });
      const dropElement = createTestElement({ left: '200px', top: '0px' });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('start', (data) => {
        expectWithContext(data.draggable, 'start data.draggable').toBe(draggable);
        expectWithContext(data.targets instanceof Map, 'start targets is Map').toBe(true);
        expectWithContext(data.targets.size, 'start targets size').toBe(1);
        expectWithContext(data.targets.has(droppable.id), 'start has droppable').toBe(true);
        events.push('start');
      });

      dndObserver.on('end', (data) => {
        expectWithContext(data.draggable, 'end data.draggable').toBe(draggable);
        expectWithContext(data.targets instanceof Map, 'end targets is Map').toBe(true);
        expectWithContext(data.targets.size, 'end targets size').toBe(1);
        expectWithContext(data.targets.has(droppable.id), 'end has droppable').toBe(true);
        events.push('end');
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      await startDrag(dragElement);

      expectWithContext(events, 'events after start').toStrictEqual(['start']);
      events.length = 0;

      await endDrag();

      expectWithContext(events, 'events after end').toStrictEqual(['end']);

      // Cleanup
      dndObserver.destroy();
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
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('move', (data) => {
        expectWithContext(data.draggable, 'move data.draggable').toBe(draggable);
        expectWithContext(data.targets instanceof Map, 'move targets is Map').toBe(true);
        events.push('move');
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      await startDrag(dragElement);

      await move('Right');

      expectWithContext(events.length, 'move events count').toBe(1);
      expectWithContext(events[0], 'first event is move').toBe('move');

      await endDrag();

      // Cleanup
      dndObserver.destroy();
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
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('enter', (data) => {
        events.push({
          type: 'enter',
          collisions: data.collisions.length,
          addedContacts: data.addedContacts.size,
        });
      });

      dndObserver.on('leave', (data) => {
        events.push({
          type: 'leave',
          collisions: data.collisions.length,
          removedContacts: data.removedContacts.size,
        });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (no collision initially)
      await startDrag(dragElement);

      // Move right to enter droppable area
      await move('Right');

      // Should have enter event
      expectWithContext(events.length, 'events after enter').toBe(1);
      expectWithContext(events[0].type, 'enter event type').toBe('enter');
      expectWithContext(events[0].collisions, 'enter collisions').toBe(1);
      expectWithContext(events[0].addedContacts, 'enter addedContacts').toBe(1);

      // Move right again to leave droppable area
      await move('Right');

      // Should have leave event
      expectWithContext(events.length, 'events after leave').toBe(2);
      expectWithContext(events[1].type, 'leave event type').toBe('leave');
      expectWithContext(events[1].collisions, 'leave collisions').toBe(0);
      expectWithContext(events[1].removedContacts, 'leave removedContacts').toBe(1);

      await endDrag();

      // Cleanup
      dndObserver.destroy();
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
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('end', (data) => {
        expectWithContext(data.draggable, 'end draggable').toBe(draggable);
        expectWithContext(data.collisions.length, 'end collisions count').toBe(1);
        expectWithContext(
          data.collisions.some((c) => c.droppableId === droppable.id),
          'has droppable collision',
        ).toBe(true);
        events.push('end');
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (should be overlapping)
      await startDrag(dragElement);

      // End dragging (should include collisions in end)
      await endDrag();

      expectWithContext(events.length, 'end events count').toBe(1);
      expectWithContext(events[0], 'end event').toBe('end');

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should emit addDraggables and removeDraggables events', () => {
      const events: Array<{ type: string; draggables: ReadonlySet<Draggable<any>> }> = [];
      const dragElement = createTestElement();

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('addDraggables', (data) => {
        events.push({ type: 'addDraggables', draggables: data.draggables });
      });

      dndObserver.on('removeDraggables', (data) => {
        events.push({ type: 'removeDraggables', draggables: data.draggables });
      });

      // Add draggable
      dndObserver.addDraggables([draggable]);

      expectWithContext(events.length, 'events after add').toBe(1);
      expectWithContext(events[0].type, 'add event type').toBe('addDraggables');
      expectWithContext(events[0].draggables.has(draggable), 'has added draggable').toBe(true);

      // Remove draggable
      dndObserver.removeDraggables([draggable]);

      expectWithContext(events.length, 'events after remove').toBe(2);
      expectWithContext(events[1].type, 'remove event type').toBe('removeDraggables');
      expectWithContext(events[1].draggables.has(draggable), 'has removed draggable').toBe(true);

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
    });

    it('should emit addDroppable and removeDroppable events', () => {
      const events: Array<{ type: string; droppable: any }> = [];
      const dropElement = createTestElement();

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('addDroppables', (data) => {
        data.droppables.forEach((droppable) => {
          events.push({ type: 'addDroppable', droppable });
        });
      });

      dndObserver.on('removeDroppables', (data) => {
        data.droppables.forEach((droppable) => {
          events.push({ type: 'removeDroppable', droppable });
        });
      });

      // Add droppable
      dndObserver.addDroppables([droppable]);

      expectWithContext(events.length, 'events after add').toBe(1);
      expectWithContext(events[0].type, 'add event type').toBe('addDroppable');
      expectWithContext(events[0].droppable, 'added droppable').toBe(droppable);

      // Remove droppable
      dndObserver.removeDroppables([droppable]);

      expectWithContext(events.length, 'events after remove').toBe(2);
      expectWithContext(events[1].type, 'remove event type').toBe('removeDroppable');
      expectWithContext(events[1].droppable, 'removed droppable').toBe(droppable);

      // Cleanup
      dndObserver.destroy();
      droppable.destroy();
      dropElement.remove();
    });

    it('should emit end with canceled=true when drag is cancelled', async () => {
      const events: string[] = [];
      const dragElement = createTestElement();

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('end', (data) => {
        expectWithContext(data.draggable, 'end draggable').toBe(draggable);
        expectWithContext(data.canceled, 'end canceled').toBe(true);
        events.push('end');
      });

      dndObserver.addDraggables([draggable]);

      // Start dragging
      await startDrag(dragElement);

      // Cancel dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expectWithContext(events.length, 'end events count').toBe(1);
      expectWithContext(events[0], 'end event').toBe('end');

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
    });

    it('should emit destroy event when context is destroyed', () => {
      const events: string[] = [];
      const dndObserver = new DndObserver();

      dndObserver.on('destroy', () => {
        events.push('destroy');
      });

      dndObserver.destroy();

      expectWithContext(events.length, 'destroy events count').toBe(1);
      expectWithContext(events[0], 'destroy event').toBe('destroy');
    });
  });

  describe('event flow and ordering', () => {
    it('should emit leave → enter → collide in order when transitioning between droppables', async () => {
      const order: string[] = [];

      const dragEl = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropA = createTestElement({ left: '0px', top: '0px', width: '40px', height: '40px' });
      const dropB = createTestElement({ left: '50px', top: '0px', width: '40px', height: '40px' });

      const sensor = new KeyboardSensor(dragEl, { moveDistance: 60 });
      const draggable = new Draggable([sensor], {
        elements: () => [dragEl],
        dndGroups: new Set(['g']),
      });
      const droppableA = new Droppable(dropA, { accept: new Set(['g']) });
      const droppableB = new Droppable(dropB, { accept: new Set(['g']) });
      const ctx = new DndObserver();

      ctx.on('leave', () => order.push('leave'));
      ctx.on('enter', () => order.push('enter'));
      ctx.on('collide', () => order.push('collide'));

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppableA, droppableB]);

      await startDrag(dragEl);
      order.length = 0; // capture only transition events
      await move('Right');

      expectWithContext(order.includes('enter'), 'has enter event').toBe(true);
      if (order.includes('leave')) {
        expectWithContext(
          order.indexOf('leave') < order.indexOf('enter'),
          'leave before enter',
        ).toBe(true);
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
      const draggable = new Draggable([sensor], {
        elements: () => [dragEl],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropEl, { accept: new Set(['g']) });
      const ctx = new DndObserver();

      let gotEnter = false;
      ctx.on('enter', ({ collisions }) => {
        events.push('enter');
        gotEnter = true;
        expectWithContext(collisions.length >= 1, 'enter has collisions').toBe(true);
      });

      ctx.on('end', ({ canceled, collisions }) => {
        events.push('end');
        expectWithContext(canceled, 'end not canceled').toBe(false);
        expectWithContext(collisions.length >= 1, 'end has collisions').toBe(true);
      });

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      await waitNextFrame();
      expectWithContext(gotEnter, 'got enter event').toBe(true);
      await endDrag();
      expectWithContext(events, 'event order').toStrictEqual(['enter', 'end']);

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
      const draggable = new Draggable([sensor], {
        elements: () => [dragEl],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropEl, { accept: () => accepts });
      const ctx = new DndObserver();

      ctx.on('enter', () => events.push('enter'));

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      expectWithContext(events.length, 'no enter when not accepting').toBe(0);

      accepts = true;
      ctx.clearTargets(draggable);
      ctx.detectCollisions(draggable);
      await waitNextFrame();

      expectWithContext(events, 'enter after accept change').toStrictEqual(['enter']);

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
      const draggable = new Draggable([sensor], {
        elements: () => [dragEl],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropEl, { accept: new Set(['g']) });
      const ctx = new DndObserver();

      let shouldRemove = false;
      ctx.on('enter', () => {
        events.push('enter');
        shouldRemove = true;
      });

      ctx.on('end', () => {
        events.push('end');
      });

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      if (shouldRemove) ctx.removeDroppables([droppable]);
      await waitNextFrame();
      await endDrag();

      expectWithContext(events, 'events order').toStrictEqual(['enter', 'end']);
      expectWithContext(ctx.droppables.has(droppable.id), 'droppable removed').toBe(false);

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
      const draggable = new Draggable([sensor], {
        elements: () => [dragEl],
        dndGroups: new Set(['g']),
      });
      const droppable = new Droppable(dropEl, { accept: new Set(['g']) });
      const ctx = new DndObserver();

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
        expectWithContext(data, 'drag data exists on end').not.toBe(null);
        seen.push({ phase: 'end', value: data!.data.counter });
      });

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      await move('Right');
      await endDrag();

      expectWithContext(
        seen.map((s) => s.phase),
        'phases',
      ).toStrictEqual(['start', 'move', 'end']);
      expectWithContext(
        seen.map((s) => s.value),
        'values',
      ).toStrictEqual([1, 2, 2]);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
  });
};
