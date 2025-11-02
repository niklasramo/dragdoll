import { DndContext } from 'dragdoll/dnd-context';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
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
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('enter');
      expect(events[0].targets).toBe(1);

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
      expect(events.length).toBe(0);

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
      expect(events.length).toBe(1);
      expect(events[0].type).toBe('enter');
      expect(events[0].targets).toBe(1);

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
      expect(events.length).toBe(0);

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
      expect(events.length).toBe(0);

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
      expect(droppable.data).toStrictEqual({ custom: 'value', id: 123 });

      // Modify data
      droppable.data.newProp = 'added';
      expect(droppable.data.newProp).toBe('added');

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
      expect(rect.x).toBe(50);
      expect(rect.y).toBe(75);
      expect(rect.width).toBe(100);
      expect(rect.height).toBe(150);

      // Update element position
      element.style.left = '100px';
      element.style.top = '200px';

      // Update client rect
      droppable.updateClientRect();

      const updatedRect = droppable.getClientRect();
      expect(updatedRect.x).toBe(100);
      expect(updatedRect.y).toBe(200);
      expect(updatedRect.width).toBe(100);
      expect(updatedRect.height).toBe(150);

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

      expect(events.length).toBe(1);
      expect(events[0].type).toBe('enter');
      expect(events[0].collisions).toBe(1);

      // Remove droppable during drag (auto-queued leave)
      dndContext.removeDroppables([droppable]);
      await waitNextFrame();

      // Should emit leave event automatically
      expect(events.length).toBe(2);
      expect(events[1].type).toBe('leave');
      expect(events[1].collisions).toBe(0);
      expect(events[1].removedContacts).toBe(1);

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
      expect(destroyEvents.length).toBe(1);
      expect(destroyEvents[0].type).toBe('removeDroppable');
      expect(destroyEvents[0].droppable).toBe(droppable);

      // Should not be in context anymore
      expect(dndContext.droppables.has(droppable.id)).toBe(false);

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
      expect(events.length >= 2).toBe(true);
      expect(events[0].type).toBe('enter');

      // Collide is emitted also immediately after enter; that first collide may
      // have 0 persistedContacts. Ensure at least one collide has 1 persisted contact.
      const collideEvents = events.slice(1).filter((e) => e.type === 'collide');
      expect(collideEvents.length >= 1).toBe(true);
      expect(collideEvents.some((e) => e.persistedContacts >= 1)).toBe(true);

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
};
