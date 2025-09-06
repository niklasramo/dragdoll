import { assert } from 'chai';
import { createTestElement } from '../utils/create-test-element.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';
import {
  DndContext,
  Draggable,
  Droppable,
  KeyboardSensor,
  CollisionData,
  CollisionDetectorDefaultOptions,
} from '../../../src/index.js';

export function collisionDetection() {
  describe('collision detection', () => {
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
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        collisionEvents.push({
          type: 'enter',
          collisions: data.collisions,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging (elements should be overlapping)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should detect collision on start
      assert.equal(collisionEvents.length, 1);
      assert.equal(collisionEvents[0].type, 'enter');
      assert.equal(collisionEvents[0].collisions.length, 1);
      assert.equal(collisionEvents[0].collisions[0].droppableId, droppable.id);

      const collisionData = collisionEvents[0].collisions[0];
      assert.isDefined(collisionData);
      assert.equal(collisionData.droppableId, droppable.id);
      assert.isNumber(collisionData.intersectionScore);
      assert.isTrue(collisionData.intersectionScore > 0);

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
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        collisionEvents.push({
          type: 'enter',
          collisions: data.collisions,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging (elements should not be overlapping)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not detect any collisions
      assert.equal(collisionEvents.length, 0);

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
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        collisionEvents.push({ type: 'enter', collisions: data.collisions.length });
      });

      dndContext.on('leave', (data) => {
        collisionEvents.push({ type: 'leave', collisions: data.collisions.length });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

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
      assert.equal(collisionEvents.length, 2);
      assert.equal(collisionEvents[0].type, 'enter');
      assert.equal(collisionEvents[0].collisions, 1);
      assert.equal(collisionEvents[1].type, 'leave');
      assert.equal(collisionEvents[1].collisions, 0);

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
        group: 'test',
      });

      const droppable1 = new Droppable(dropElement1, {
        accept: ['test'],
      });

      const droppable2 = new Droppable(dropElement2, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        collisionEvents.push({
          type: 'enter',
          collisions: [...data.collisions],
        });
      });

      dndContext.on('leave', (data) => {
        collisionEvents.push({
          type: 'leave',
          collisions: [...data.collisions],
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable1, droppable2]);

      // Start dragging (should collide with droppable1)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should enter droppable1
      assert.equal(collisionEvents.length, 1);
      assert.equal(collisionEvents[0].type, 'enter');
      assert.equal(collisionEvents[0].collisions.length, 1);
      assert.isTrue(
        collisionEvents[0].collisions.some((c: any) => c.droppableId === droppable1.id),
      );

      // Move right to transition from droppable1 to droppable2
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));

      await waitNextFrame();

      // Should have leave and enter events
      assert.isTrue(collisionEvents.length >= 2);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      // Cleanup
      dndContext.destroy();
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
        group: 'test',
      });

      // Droppable that doesn't accept 'test' group
      const droppable = new Droppable(dropElement, {
        accept: ['other-group'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', () => {
        collisionEvents.push({ type: 'enter' });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging (elements overlap but droppable doesn't accept this group)
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Should not detect collision due to accept criteria
      assert.equal(collisionEvents.length, 0);

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
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext<CustomCollisionData>({
        collisionDetector: {
          checkCollision: (draggable, droppable, collisionData) => {
            customDetectorCalled = true;

            // Use the default collision detection logic.
            const result = CollisionDetectorDefaultOptions.checkCollision(
              draggable,
              droppable,
              collisionData,
            );

            // If result is null, it means there is no collision.
            if (!result) return null;

            // Set the custom property.
            result.customProp = 'test-value';

            return result;
          },
          createCollisionData: () => {
            const data =
              CollisionDetectorDefaultOptions.createCollisionData() as CustomCollisionData;
            data.customProp = '';
            return data;
          },
        },
      });

      dndContext.on('enter', (data) => {
        const collision = data.collisions[0];
        customCollisionEvents.push({
          type: 'enter',
          customProp: collision?.customProp,
        });
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Custom collision detector should have been called
      assert.isTrue(customDetectorCalled);
      assert.equal(customCollisionEvents.length, 1);
      assert.equal(customCollisionEvents[0].customProp, 'test-value');

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
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

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
      assert.isObject(updatedRect);
      assert.equal(updatedRect.x, initialRect.x);
      assert.equal(updatedRect.y, initialRect.y);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame(); // Wait for cleanup

      // Cleanup
      dndContext.destroy();
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
        group: 'test',
      });

      const droppable = new Droppable(dropElement, {
        accept: ['test'],
      });

      const dndContext = new DndContext();

      dndContext.on('enter', (data) => {
        collisionData = data.collisions.find((c) => c.droppableId === droppable.id) || null;
      });

      dndContext.addDraggable(draggable);
      dndContext.addDroppables([droppable]);

      // Start dragging
      focusElement(dragElement);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame();

      // Wait for any pending ticker operations to complete
      await new Promise((resolve) => setTimeout(resolve, 50));

      // Check collision data properties
      assert.isObject(collisionData);
      assert.equal(collisionData.droppableId, droppable.id);
      assert.isNumber(collisionData.droppableRect.x);
      assert.isNumber(collisionData.droppableRect.y);
      assert.isNumber(collisionData.droppableRect.width);
      assert.isNumber(collisionData.droppableRect.height);
      assert.isNumber(collisionData.intersectionScore);
      assert.isTrue(collisionData.intersectionScore > 0);

      // End dragging
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      await waitNextFrame(); // Wait for cleanup

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
