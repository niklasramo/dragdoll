import { DndObserver } from 'dragdoll/dnd-observer';
import type { CollisionData } from 'dragdoll/dnd-observer/collision-detector';
import { CollisionDetector } from 'dragdoll/dnd-observer/collision-detector';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
import { expectWithContext } from '../utils/expect-with-context.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export default () => {
  describe('CollisionDetector', () => {
    defaultSetup();

    it('should detect collisions when draggable overlaps droppable', async () => {
      const collisionEvents: any[] = [];

      // Create overlapping elements
      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '25px',
        top: '25px',
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

      dndObserver.on('enter', (data) => {
        collisionEvents.push({
          type: 'enter',
          collisions: data.collisions,
        });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (elements should be overlapping)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should detect collision on start
      expectWithContext(collisionEvents.length, 'collision events count').toBe(1);
      expectWithContext(collisionEvents[0].type, 'event type').toBe('enter');
      expectWithContext(collisionEvents[0].collisions.length, 'collisions count').toBe(1);
      expectWithContext(collisionEvents[0].collisions[0].droppableId, 'droppable id').toBe(
        droppable.id,
      );

      const collisionData = collisionEvents[0].collisions[0];
      expectWithContext(typeof collisionData, 'collision data is object').toBe('object');
      expectWithContext(collisionData.droppableId, 'collision droppableId').toBe(droppable.id);
      expectWithContext(typeof collisionData.intersectionScore, 'intersectionScore type').toBe(
        'number',
      );
      expectWithContext(collisionData.intersectionScore > 0, 'intersectionScore > 0').toBe(true);

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

    it('should not detect collisions when draggable does not overlap droppable', async () => {
      const collisionEvents: any[] = [];

      // Create non-overlapping elements
      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement = createTestElement({
        left: '100px',
        top: '100px',
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

      dndObserver.on('enter', (data) => {
        collisionEvents.push({
          type: 'enter',
          collisions: data.collisions,
        });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (elements should not be overlapping)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not detect any collisions
      expectWithContext(collisionEvents.length, 'no collision events').toBe(0);

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

    it('should update collisions when draggable moves', async () => {
      const collisionEvents: any[] = [];

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

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 70 }); // Move past droppable
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['test']),
      });

      const droppable = new Droppable(dropElement, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('enter', (data) => {
        collisionEvents.push({ type: 'enter', collisions: data.collisions.length });
      });

      dndObserver.on('leave', (data) => {
        collisionEvents.push({ type: 'leave', collisions: data.collisions.length });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (no collision initially)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Move right to enter droppable
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Move right again to leave droppable
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Should have enter and leave events
      expectWithContext(collisionEvents.length, 'collision events count').toBe(2);
      expectWithContext(collisionEvents[0].type, 'first event type').toBe('enter');
      expectWithContext(collisionEvents[0].collisions, 'enter collisions').toBe(1);
      expectWithContext(collisionEvents[1].type, 'second event type').toBe('leave');
      expectWithContext(collisionEvents[1].collisions, 'leave collisions').toBe(0);

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

    it('should handle multiple droppables correctly', async () => {
      const collisionEvents: {
        type: string;
        collisions: CollisionData[];
      }[] = [];

      const dragElement = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement1 = createTestElement({
        left: '0px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const dropElement2 = createTestElement({
        left: '60px',
        top: '0px',
        width: '50px',
        height: '50px',
      });

      const keyboardSensor = new KeyboardSensor(dragElement, { moveDistance: 60 });
      const draggable = new Draggable([keyboardSensor], {
        elements: () => [dragElement],
        dndGroups: new Set(['test']),
      });

      const droppable1 = new Droppable(dropElement1, {
        accept: new Set(['test']),
      });

      const droppable2 = new Droppable(dropElement2, {
        accept: new Set(['test']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('enter', (data) => {
        collisionEvents.push({
          type: 'enter',
          collisions: [...data.collisions],
        });
      });

      dndObserver.on('leave', (data) => {
        collisionEvents.push({
          type: 'leave',
          collisions: [...data.collisions],
        });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable1, droppable2]);

      // Start dragging (should collide with droppable1)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should enter droppable1
      expectWithContext(collisionEvents.length, 'initial collision events').toBe(1);
      expectWithContext(collisionEvents[0].type, 'first event type').toBe('enter');
      expectWithContext(collisionEvents[0].collisions.length, 'first collisions count').toBe(1);
      expectWithContext(
        collisionEvents[0].collisions.some((c: any) => c.droppableId === droppable1.id),
        'has droppable1 collision',
      ).toBe(true);

      // Move right to transition from droppable1 to droppable2
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Should have leave and enter events
      expectWithContext(collisionEvents.length >= 2, 'at least 2 events after move').toBe(true);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      droppable1.destroy();
      droppable2.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement1.remove();
      dropElement2.remove();
    });

    it('should respect droppable accept criteria', async () => {
      const collisionEvents: any[] = [];

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

      // Droppable that doesn't accept 'test' group
      const droppable = new Droppable(dropElement, {
        accept: new Set(['other-group']),
      });

      const dndObserver = new DndObserver();

      dndObserver.on('enter', () => {
        collisionEvents.push({ type: 'enter' });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging (elements overlap but droppable doesn't accept this
      // group)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not detect collision due to accept criteria
      expectWithContext(collisionEvents.length, 'no collisions due to accept').toBe(0);

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

    it('should work with extended collision data', async () => {
      interface CustomCollisionData extends CollisionData {
        customProp: string;
      }

      const customCollisionEvents: { type: string; customProp?: string }[] = [];
      let customDetectorCalled = false;

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

      class TestDetector extends CollisionDetector<CustomCollisionData> {
        protected override _createCollisionData(): CustomCollisionData {
          const base = super._createCollisionData() as CustomCollisionData;
          base.customProp = '';
          return base;
        }

        protected override _checkCollision(
          draggable: any,
          droppable: any,
          data: CustomCollisionData,
        ) {
          customDetectorCalled = true;
          const result = super._checkCollision(draggable, droppable, data);
          if (!result) return null;
          result.customProp = 'test-value';
          return result;
        }
      }

      const dndObserver = new DndObserver<CustomCollisionData>({
        collisionDetector: (ctx) => new TestDetector(ctx),
      });

      dndObserver.on('enter', (data) => {
        const collision = data.collisions[0];
        customCollisionEvents.push({
          type: 'enter',
          customProp: collision?.customProp,
        });
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Custom collision detector should have been called
      expectWithContext(customDetectorCalled, 'custom detector called').toBe(true);
      expectWithContext(customCollisionEvents.length, 'custom collision events').toBe(1);
      expectWithContext(customCollisionEvents[0].customProp, 'custom prop value').toBe(
        'test-value',
      );

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

    it('should update droppable client rects on scroll', async () => {
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

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Get initial client rect
      const initialRect = droppable.getClientRect();

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Manually trigger scroll event to test client rect updates
      window.dispatchEvent(new Event('scroll'));

      await waitNextFrame();

      // Wait for ticker to process scroll event
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Client rect should be updated (even if values are the same, the update should happen)
      const updatedRect = droppable.getClientRect();
      expectWithContext(typeof updatedRect, 'updated rect is object').toBe('object');
      expectWithContext(updatedRect.x, 'updated rect.x').toBe(initialRect.x);
      expectWithContext(updatedRect.y, 'updated rect.y').toBe(initialRect.y);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame(); // Wait for cleanup

      // Cleanup
      dndObserver.destroy();
      draggable.destroy();
      droppable.destroy();
      keyboardSensor.destroy();
      dragElement.remove();
      dropElement.remove();
    });

    it('should handle collision data correctly', async () => {
      let collisionData: any = null;

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

      dndObserver.on('enter', (data) => {
        collisionData = data.collisions.find((c) => c.droppableId === droppable.id) || null;
      });

      dndObserver.addDraggables([draggable]);
      dndObserver.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Wait for any pending ticker operations to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check collision data properties
      expectWithContext(typeof collisionData, 'collision data is object').toBe('object');
      expectWithContext(collisionData.droppableId, 'collision droppableId').toBe(droppable.id);
      expectWithContext(typeof collisionData.droppableRect.x, 'droppableRect.x type').toBe(
        'number',
      );
      expectWithContext(typeof collisionData.droppableRect.y, 'droppableRect.y type').toBe(
        'number',
      );
      expectWithContext(typeof collisionData.droppableRect.width, 'droppableRect.width type').toBe(
        'number',
      );
      expectWithContext(
        typeof collisionData.droppableRect.height,
        'droppableRect.height type',
      ).toBe('number');
      expectWithContext(typeof collisionData.intersectionScore, 'intersectionScore type').toBe(
        'number',
      );
      expectWithContext(collisionData.intersectionScore > 0, 'intersectionScore > 0').toBe(true);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame(); // Wait for cleanup

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
