import { DndObserver } from 'dragdoll/dnd-observer';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
import { expectWithContext } from '../utils/expect-with-context.js';
import { focusElement } from '../utils/focus-element.js';
import { endDrag, move, startDrag } from '../utils/keyboard-helpers.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export default () => {
  describe('Droppable', () => {
    defaultSetup();

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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', (data) => {
        events.push({ type: 'enter', targets: data.targets.size });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

      // Move right to overlap with droppable
      await move('Right');
      await waitNextFrame(); // Extra frame for collision detection

      // Should accept the draggable
      expectWithContext(events.length, 'events count').toBe(1);
      expectWithContext(events[0].type, 'event type').toBe('enter');
      expectWithContext(events[0].targets, 'targets count').toBe(1);

      // End dragging
      await endDrag();

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

      // Should not accept the draggable
      expectWithContext(events.length, 'no enter events').toBe(0);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', (data) => {
        events.push({ type: 'enter', targets: data.targets.size });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to overlap with droppable
      await move('Right');
      await waitNextFrame(); // Extra frame for collision detection

      // Should accept the draggable based on function
      expectWithContext(events.length, 'events count').toBe(1);
      expectWithContext(events[0].type, 'event type').toBe('enter');
      expectWithContext(events[0].targets, 'targets count').toBe(1);

      // End dragging
      await endDrag();

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      await startDrag(dragElement);

      // Should not accept the draggable
      expectWithContext(events.length, 'no enter events').toBe(0);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should accept draggable when its element matches droppable element', async () => {
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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      await startDrag(element);

      // Should accept itself as target (containment check was removed)
      expectWithContext(events.length, 'enter event for same element').toBe(1);

      // End dragging
      await endDrag();

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();
      dndObserver.addDroppables([droppable]);

      // Check initial data
      expectWithContext(droppable.data, 'initial data').toStrictEqual({ custom: 'value', id: 123 });

      // Modify data
      droppable.data.newProp = 'added';
      expectWithContext(droppable.data.newProp, 'modified data').toBe('added');

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();
      dndObserver.addDroppables([droppable]);

      const rect = droppable.getClientRect();
      expectWithContext(rect.x, 'initial rect.x').toBe(50);
      expectWithContext(rect.y, 'initial rect.y').toBe(75);
      expectWithContext(rect.width, 'initial rect.width').toBe(100);
      expectWithContext(rect.height, 'initial rect.height').toBe(150);

      // Update element position
      element.style.left = '100px';
      element.style.top = '200px';

      // Update client rect
      droppable.updateClientRect();

      const updatedRect = droppable.getClientRect();
      expectWithContext(updatedRect.x, 'updated rect.x').toBe(100);
      expectWithContext(updatedRect.y, 'updated rect.y').toBe(200);
      expectWithContext(updatedRect.width, 'updated rect.width').toBe(100);
      expectWithContext(updatedRect.height, 'updated rect.height').toBe(150);

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', (data) => {
        events.push({ type: 'enter', collisions: data.collisions.length });
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

      // Start dragging
      await startDrag(dragElement);

      // Move right to overlap with droppable (should enter droppable)
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();
      await waitNextFrame(); // Extra frame for collision detection

      expectWithContext(events.length, 'enter event count').toBe(1);
      expectWithContext(events[0].type, 'first event type').toBe('enter');
      expectWithContext(events[0].collisions, 'enter collisions').toBe(1);

      // Remove droppable during drag (auto-queued leave)
      dndObserver.removeDroppables([droppable]);
      await waitNextFrame();

      // Should emit leave event automatically
      expectWithContext(events.length, 'events after remove').toBe(2);
      expectWithContext(events[1].type, 'leave event type').toBe('leave');
      expectWithContext(events[1].collisions, 'leave collisions').toBe(0);
      expectWithContext(events[1].removedContacts, 'removed contacts').toBe(1);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();

      dndObserver.on('removeDroppables', (data) => {
        const removed = Array.from(data.droppables);
        destroyEvents.push({ type: 'removeDroppable', droppable: removed[0] });
      });

      dndObserver.addDroppables([droppable]);

      // Destroy droppable
      droppable.destroy();

      // Should emit removeDroppable event
      expectWithContext(destroyEvents.length, 'destroy events count').toBe(1);
      expectWithContext(destroyEvents[0].type, 'event type').toBe('removeDroppable');
      expectWithContext(destroyEvents[0].droppable, 'removed droppable').toBe(droppable);

      // Should not be in context anymore
      expectWithContext(dndObserver.droppables.has(droppable.id), 'droppable removed').toBe(false);

      // Cleanup
      dndObserver.destroy();
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

      const dndObserver = new DndObserver();

      dndObserver.on('enter', () => {
        events.push({ type: 'enter' });
      });

      dndObserver.on('collide', (data) => {
        events.push({
          type: 'collide',
          persistedContacts: data.persistedContacts.size,
        });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

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
      expectWithContext(events.length >= 2, 'at least 2 events').toBe(true);
      expectWithContext(events[0].type, 'first event is enter').toBe('enter');

      // Collide is emitted also immediately after enter; that first collide may
      // have 0 persistedContacts. Ensure at least one collide has 1 persisted contact.
      const collideEvents = events.slice(1).filter((e) => e.type === 'collide');
      expectWithContext(collideEvents.length >= 1, 'at least 1 collide event').toBe(true);
      expectWithContext(
        collideEvents.some((e) => e.persistedContacts >= 1),
        'has persisted contacts',
      ).toBe(true);

      // End dragging
      await endDrag();

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });
  });
};
