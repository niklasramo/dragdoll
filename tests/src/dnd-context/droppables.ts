import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import { DndContext, Draggable, Droppable, KeyboardSensor } from '../../../src/index.js';

export function droppables() {
  describe('droppables', () => {
    it('should accept draggables based on group string array', async () => {
      const events: any[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '60px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'valid-group',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['valid-group', 'another-group'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({ type: 'enter', targets: data.targets.size });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to overlap with droppable
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();
      await waitNextFrame(); // Extra frame for collision detection

      // Should accept the draggable
      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].targets, 1);

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

    it('should reject draggables not in accept group array', async () => {
      const events: any[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '25px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'invalid-group',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['valid-group', 'another-group'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not accept the draggable
      assert.equal(events.length, 0);

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

    it('should accept draggables based on function predicate', async () => {
      const events: any[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '60px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test-group',
      });

      const droppable = new Droppable(dropElement, {
        accept: (draggable) => {
          return draggable.settings.group === 'test-group';
        },
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({ type: 'enter', targets: data.targets.size });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to overlap with droppable
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();
      await waitNextFrame(); // Extra frame for collision detection

      // Should accept the draggable based on function
      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].targets, 1);

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

    it('should reject draggables when function predicate returns false', async () => {
      const events: any[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '25px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test-group',
      });

      const droppable = new Droppable(dropElement, {
        accept: (draggable) => {
          return draggable.settings.group === 'different-group';
        },
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not accept the draggable
      assert.equal(events.length, 0);

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

    it('should not accept draggable when its element matches droppable element', async () => {
      const events: any[] = [];

      // Use the same element for both draggable and droppable
      const element = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(element, { moveDistance: 10 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [element],
        group: 'test',
      });

      const droppable = new Droppable(element, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(element);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not accept itself as target
      assert.equal(events.length, 0);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndContext.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      element.remove();
    });

    it('should handle droppable data correctly', () => {
      const element = createTestElement();

      const droppable = new Droppable(element, {
        accept: ['test'],
        data: { custom: 'value', id: 123 },
      });

      const dndContext = new DndContext();
      dndContext.addDroppable(droppable);

      // Check initial data
      assert.deepEqual(droppable.data, { custom: 'value', id: 123 });

      // Modify data
      droppable.data.newProp = 'added';
      assert.equal(droppable.data.newProp, 'added');

      // Cleanup
      dndContext.destroy();
      droppable.destroy();
      element.remove();
    });

    it('should update client rect correctly', () => {
      const element = createTestElement({
        left: '50px',
        top: '75px',
        width: '100px',
        height: '150px',
      });

      const droppable = new Droppable(element, {
        accept: ['test'],
      });

      const dndContext = new DndContext();
      dndContext.addDroppable(droppable);

      const rect = droppable.getClientRect();
      assert.equal(rect.x, 50);
      assert.equal(rect.y, 75);
      assert.equal(rect.width, 100);
      assert.equal(rect.height, 150);

      // Update element position
      element.style.left = '100px';
      element.style.top = '200px';

      // Update client rect
      droppable.updateClientRect();

      const updatedRect = droppable.getClientRect();
      assert.equal(updatedRect.x, 100);
      assert.equal(updatedRect.y, 200);
      assert.equal(updatedRect.width, 100);
      assert.equal(updatedRect.height, 150);

      // Cleanup
      dndContext.destroy();
      droppable.destroy();
      element.remove();
    });

    it('should handle droppable removal during drag', async () => {
      const events: any[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '60px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({ type: 'enter', collisions: data.collisions.size });
      });

      dndContext.on('leave', (data) => {
        events.push({
          type: 'leave',
          collisions: data.collisions.size,
          removedCollisions: data.removedCollisions.size,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to overlap with droppable (should enter droppable)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();
      await waitNextFrame(); // Extra frame for collision detection

      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].collisions, 1);

      // Remove droppable during drag
      dndContext.removeDroppable(droppable);

      // Should emit leave event
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

    it('should handle droppable destruction properly', () => {
      const destroyEvents: any[] = [];

      const element = createTestElement();
      const droppable = new Droppable(element, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('removeDroppable', (data) => {
        destroyEvents.push({ type: 'removeDroppable', droppable: data.droppable });
      });

      dndContext.addDroppable(droppable);

      // Destroy droppable
      droppable.destroy();

      // Should emit removeDroppable event
      assert.equal(destroyEvents.length, 1);
      assert.equal(destroyEvents[0].type, 'removeDroppable');
      assert.equal(destroyEvents[0].droppable, droppable);

      // Should not be in context anymore
      assert.isFalse(dndContext.droppables.has(droppable.id));

      // Cleanup
      dndContext.destroy();
      element.remove();
    });

    it('should handle over events for persistent collisions', async () => {
      const events: any[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '60px',
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

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.on('over', (data) => {
        events.push({
          type: 'over',
          persistedCollisions: data.persistedCollisions.size,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppable(droppable);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to enter droppable
      for (let i = 0; i < 7; i++) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
        await waitNextFrame();
      }

      // Move within the same droppable (should trigger over)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();
      await waitNextFrame(); // Extra frame for collision detection

      // Should have enter event followed by multiple over events for persistent collisions
      assert.isTrue(events.length >= 2);
      assert.equal(events[0].type, 'enter');

      // All subsequent events should be 'over' events with 1 persisted collision
      for (let i = 1; i < events.length; i++) {
        assert.equal(events[i].type, 'over');
        assert.equal(events[i].persistedCollisions, 1);
      }

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
  });
}
