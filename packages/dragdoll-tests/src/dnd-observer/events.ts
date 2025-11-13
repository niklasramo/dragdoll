import { DndObserver } from 'dragdoll/dnd-observer';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
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
        expect(data.draggable).toBe(draggable);
        expect(data.targets).toBeInstanceOf(Map);
        expect(data.targets.size).toBe(1);
        expect(data.targets.has(droppable.id)).toBe(true);
        events.push('start');
      });

      dndObserver.on('end', (data) => {
        expect(data.draggable).toBe(draggable);
        expect(data.targets).toBeInstanceOf(Map);
        expect(data.targets.size).toBe(1);
        expect(data.targets.has(droppable.id)).toBe(true);
        events.push('end');
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      await startDrag(dragElement);

      expect(events).toEqual(['start']);
      events.length = 0;

      await endDrag();

      expect(events).toEqual(['end']);

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
        expect(data.draggable).toBe(draggable);
        expect(data.targets).toBeInstanceOf(Map);
        events.push('move');
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      await startDrag(dragElement);

      await move('Right');

      expect(events.length).toBe(1);
      expect(events[0]).toBe('move');

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
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('enter');
      expect(events[0].collisions).toBe(1);
      expect(events[0].addedContacts).toBe(1);

      // Move right again to leave droppable area
      await move('Right');

      // Should have leave event
      expect(events.length).toBe(2);
      expect(events[1].type).toBe('leave');
      expect(events[1].collisions).toBe(0);
      expect(events[1].removedContacts).toBe(1);

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
        expect(data.draggable).toBe(draggable);
        expect(data.collisions.length).toBe(1);
        expect(data.collisions.some((c) => c.droppableId === droppable.id)).toBe(true);
        events.push('end');
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (should be overlapping)
      await startDrag(dragElement);

      // End dragging (should include collisions in end)
      await endDrag();

      expect(events.length).toBe(1);
      expect(events[0]).toBe('end');

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

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('addDraggables');
      expect(events[0].draggables.has(draggable)).toBe(true);

      // Remove draggable
      dndObserver.removeDraggables([draggable]);

      expect(events.length).toBe(2);
      expect(events[1].type).toBe('removeDraggables');
      expect(events[1].draggables.has(draggable)).toBe(true);

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

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('addDroppable');
      expect(events[0].droppable).toBe(droppable);

      // Remove droppable
      dndObserver.removeDroppables([droppable]);

      expect(events.length).toBe(2);
      expect(events[1].type).toBe('removeDroppable');
      expect(events[1].droppable).toBe(droppable);

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
        expect(data.draggable).toBe(draggable);
        expect(data.canceled).toBe(true);
        events.push('end');
      });

      dndObserver.addDraggables([draggable]);

      // Start dragging
      await startDrag(dragElement);

      // Cancel dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      expect(events.length).toBe(1);
      expect(events[0]).toBe('end');

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

      expect(events.length).toBe(1);
      expect(events[0]).toBe('destroy');
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

      expect(order.includes('enter')).toBe(true);
      if (order.includes('leave')) {
        expect(order.indexOf('leave')).toBeLessThan(order.indexOf('enter'));
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
        expect(collisions.length).toBeGreaterThanOrEqual(1);
      });

      ctx.on('end', ({ canceled, collisions }) => {
        events.push('end');
        expect(canceled).toBe(false);
        expect(collisions.length).toBeGreaterThanOrEqual(1);
      });

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      await waitNextFrame();
      expect(gotEnter).toBe(true);
      await endDrag();
      expect(events).toEqual(['enter', 'end']);

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
      expect(events.length).toBe(0);

      accepts = true;
      ctx.clearTargets(draggable);
      ctx.detectCollisions(draggable);
      await waitNextFrame();

      expect(events).toEqual(['enter']);

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

      expect(events).toStrictEqual(['enter', 'end']);
      expect(ctx.droppables.has(droppable.id)).toBe(false);

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
        expect(data).not.toBeNull();
        seen.push({ phase: 'end', value: data!.data.counter });
      });

      ctx.addDraggables([draggable]);
      ctx.addDroppables([droppable]);

      await startDrag(dragEl);
      await move('Right');
      await endDrag();

      expect(seen.map((s) => s.phase)).toStrictEqual(['start', 'move', 'end']);
      expect(seen.map((s) => s.value)).toStrictEqual([1, 2, 2]);

      ctx.destroy();
      draggable.destroy();
      droppable.destroy();
      sensor.destroy();
      dragEl.remove();
      dropEl.remove();
    });
  });
};
