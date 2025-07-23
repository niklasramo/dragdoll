import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { DndContext, Draggable, Droppable, KeyboardSensor } from '../../../src/index.js';

export function events() {
  describe('events', () => {
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
        assert.isArray(data.targets);
        assert.equal(data.targets.length, 1);
        assert.equal(data.targets[0], droppable);
        events.push('start');
      });

      dndContext.on('end', (data) => {
        assert.equal(data.draggable, draggable);
        assert.isArray(data.targets);
        assert.equal(data.targets.length, 1);
        assert.equal(data.targets[0], droppable);
        events.push('end');
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      assert.deepEqual(events, ['start']);
      events.length = 0;

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

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
        assert.isArray(data.targets);
        events.push('move');
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move the element
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      assert.equal(events.length, 1);
      assert.equal(events[0], 'move');

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

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
        addedCollisions?: number;
        removedCollisions?: number;
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
          addedCollisions: data.addedCollisions.length,
        });
      });

      dndContext.on('leave', (data) => {
        events.push({
          type: 'leave',
          collisions: data.collisions.length,
          removedCollisions: data.removedCollisions.length,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging (no collision initially)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to enter droppable area
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Should have enter event
      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].collisions, 1);
      assert.equal(events[0].addedCollisions, 1);

      // Move right again to leave droppable area
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Should have leave event
      assert.equal(events.length, 2);
      assert.equal(events[1].type, 'leave');
      assert.equal(events[1].collisions, 0);
      assert.equal(events[1].removedCollisions, 1);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should emit drop events when draggable is dropped on droppable', async () => {
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

      dndContext.on('drop', (data) => {
        assert.equal(data.draggable, draggable);
        assert.equal(data.collisions.length, 1);
        assert.equal(data.collisions[0], droppable);
        assert.isTrue(data.collisionData.has(droppable));
        events.push('drop');
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging (should be overlapping)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // End dragging (should trigger drop)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      assert.equal(events.length, 1);
      assert.equal(events[0], 'drop');

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

      dndContext.on('addDroppable', (data) => {
        events.push({ type: 'addDroppable', droppable: data.droppable });
      });

      dndContext.on('removeDroppable', (data) => {
        events.push({ type: 'removeDroppable', droppable: data.droppable });
      });

      // Add droppable
      dndContext.addDroppable(droppable);

      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'addDroppable');
      assert.equal(events[0].droppable, droppable);

      // Remove droppable
      dndContext.removeDroppable(droppable);

      assert.equal(events.length, 2);
      assert.equal(events[1].type, 'removeDroppable');
      assert.equal(events[1].droppable, droppable);

      // Cleanup
      dndContext.destroy();
      droppable.destroy();
      dropElement.remove();
    });

    it('should emit cancel events when drag is cancelled', async () => {
      const events: string[] = [];
      const dragElement = createTestElement();

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const dndContext = new DndContext();

      dndContext.on('cancel', (data) => {
        assert.equal(data.draggable, draggable);
        events.push('cancel');
      });

      dndContext.addDraggable(draggable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Cancel dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

      assert.equal(events.length, 1);
      assert.equal(events[0], 'cancel');

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
}
