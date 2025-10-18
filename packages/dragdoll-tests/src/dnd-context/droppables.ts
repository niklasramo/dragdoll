import { assert } from 'chai';
import { DndContext } from 'dragdoll/dnd-context';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { endDrag, move, startDrag } from '../utils/keyboard-helpers.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export function droppables() {
  describe('droppables', () => {
    // helpers imported from ../utils/keyboard-helpers
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
        dndGroups: new Set(['valid-group']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['valid-group', 'another-group']),
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({ type: 'enter', targets: data.targets.size });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

      // Move right to overlap with droppable
      await move('Right');
      await waitNextFrame(); // Extra frame for collision detection

      // Should accept the draggable
      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].targets, 1);

      // End dragging
      await endDrag();

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
        dndGroups: new Set(['invalid-group']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['valid-group', 'another-group']),
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

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
        dndGroups: new Set(['test-group']),
      });

      const droppable = new Droppable(dropElement, {
        accept: (draggable) => {
          return !!draggable.settings.dndGroups?.has('test-group');
        },
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({ type: 'enter', targets: data.targets.size });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to overlap with droppable
      await move('Right');
      await waitNextFrame(); // Extra frame for collision detection

      // Should accept the draggable based on function
      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].targets, 1);

      // End dragging
      await endDrag();

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
        dndGroups: new Set(['test-group']),
      });

      const droppable = new Droppable(dropElement, {
        accept: (draggable) => {
          return !!draggable.settings.dndGroups?.has('different-group');
        },
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

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
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(element, {
        accept: new Set(['test']),
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      await startDrag(element);

      // Should not accept itself as target
      assert.equal(events.length, 0);

      // End dragging
      await endDrag();

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
        accept: new Set(['test']),
        data: { custom: 'value', id: 123 },
      });

      const dndContext = new DndContext();
      dndContext.addDroppables([droppable]);

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
        accept: new Set(['test']),
      });

      const dndContext = new DndContext();
      dndContext.addDroppables([droppable]);

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
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        events.push({ type: 'enter', collisions: data.collisions.length });
      });

      dndContext.on('leave', (data) => {
        events.push({
          type: 'leave',
          collisions: data.collisions.length,
          removedContacts: data.removedContacts.size,
        });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

      // Move right to overlap with droppable (should enter droppable)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();
      await waitNextFrame(); // Extra frame for collision detection

      assert.equal(events.length, 1);
      assert.equal(events[0].type, 'enter');
      assert.equal(events[0].collisions, 1);

      // Remove droppable during drag (auto-queued leave)
      dndContext.removeDroppables([droppable]);
      await waitNextFrame();

      // Should emit leave event automatically
      assert.equal(events.length, 2);
      assert.equal(events[1].type, 'leave');
      assert.equal(events[1].collisions, 0);
      assert.equal(events[1].removedContacts, 1);

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
        accept: new Set(['test']),
      });

      const dndContext = new DndContext();

      dndContext.on('removeDroppables', (data) => {
        const removed = Array.from(data.droppables);
        destroyEvents.push({ type: 'removeDroppable', droppable: removed[0] });
      });

      dndContext.addDroppables([droppable]);

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

    it('should handle collide events each cycle with persistedContacts', async () => {
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
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndContext.on('collide', (data) => {
        events.push({
          type: 'collide',
          persistedContacts: data.persistedContacts.size,
        });
      });

      dndContext.addDraggables([draggable]);
      dndContext.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await waitNextFrame();

      // Move right to enter droppable
      await move('Right', 7);

      // Move within the same droppable (should trigger collide again)
      await move('Right');
      await waitNextFrame(); // Extra frame for collision detection

      // Should have enter event followed by collide events
      assert.isTrue(events.length >= 2);
      assert.equal(events[0].type, 'enter');

      // Collide is emitted also immediately after enter; that first collide may
      // have 0 persistedContacts. Ensure at least one collide has 1 persisted contact.
      const collideEvents = events.slice(1).filter((e) => e.type === 'collide');
      assert.isAtLeast(collideEvents.length, 1);
      assert.isTrue(collideEvents.some((e) => e.persistedContacts >= 1));

      // End dragging
      await endDrag();

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
