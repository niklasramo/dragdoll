import { DndObserver } from 'dragdoll/dnd-observer';
import {
  type AdvancedCollisionData,
  AdvancedCollisionDetector,
} from 'dragdoll/dnd-observer/advanced-collision-detector';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createTestElement } from '../utils/create-test-element.js';
import { defaultSetup } from '../utils/default-setup.js';
import { focusElement } from '../utils/focus-element.js';
import { waitNextFrame } from '../utils/wait-next-frame.js';

export default () => {
  describe('AdvancedCollisionDetector', () => {
    defaultSetup();

    describe('relative visibility logic', () => {
      it('should not clip if draggable and droppable are within the same clip container', async () => {
        // NB: Here we intentionally use negative coordinates to ensure that
        // the draggable and droppable are outside window bounds also, to make
        // sure that they are not clipped by window nor the shared clip
        // container.

        const collisionEvents: any[] = [];

        const containerElement = createTestElement({
          left: '0px',
          top: '0px',
          width: '100px',
          height: '100px',
          overflow: 'hidden',
        });
        const draggableElement = createTestElement({
          left: '-100px',
          top: '-100px',
          width: '100px',
          height: '100px',
        });
        const droppableElement = createTestElement({
          left: '-100px',
          top: '-100px',
          width: '100px',
          height: '100px',
        });

        containerElement.appendChild(draggableElement);
        containerElement.appendChild(droppableElement);

        const keyboard = new KeyboardSensor(draggableElement);
        const draggable = new Draggable([keyboard], {
          elements: () => [draggableElement],
          dndGroups: new Set(['g']),
        });
        const droppable = new Droppable(droppableElement, { accept: new Set(['g']) });
        const dndObserver = new DndObserver<AdvancedCollisionData>({
          collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
        });

        dndObserver.addDraggables([draggable]);
        dndObserver.addDroppables([droppable]);
        dndObserver.on('collide', (data) => {
          collisionEvents.push({ type: 'enter', collisions: data.collisions });
        });

        // Start dragging.
        focusElement(draggableElement);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await waitNextFrame();

        // Assert that a single collision was detected.
        expect(collisionEvents.length).toBe(1);
        expect(collisionEvents[0].collisions.length).toBe(1);

        // Assert that the visible rectangles are correct.
        const firstCollision = collisionEvents[0].collisions[0];
        expect(firstCollision.draggableVisibleRect).toStrictEqual({
          x: -100,
          y: -100,
          width: 100,
          height: 100,
        });
        expect(firstCollision.droppableVisibleRect).toStrictEqual({
          x: -100,
          y: -100,
          width: 100,
          height: 100,
        });

        // Cleanup.
        dndObserver.destroy();
        draggable.destroy();
        droppable.destroy();
        keyboard.destroy();
        draggableElement.remove();
        droppableElement.remove();
        containerElement.remove();
      });

      it('should clip to the clip containers that are not shared by the draggable and droppable', async () => {
        const collisionEvents: any[] = [];

        const containerElement = createTestElement({
          left: '-50px',
          top: '-50px',
          width: '100px',
          height: '100px',
          overflow: 'hidden',
        });
        const draggableElement = createTestElement({
          left: '0px',
          top: '0px',
          width: '100px',
          height: '100px',
        });
        const droppableElement = createTestElement({
          left: '50px',
          top: '50px',
          width: '100px',
          height: '100px',
        });

        containerElement.appendChild(droppableElement);

        const keyboard = new KeyboardSensor(draggableElement, { moveDistance: 50 });
        const draggable = new Draggable([keyboard], {
          elements: () => [draggableElement],
          dndGroups: new Set(['g']),
        });
        const droppable = new Droppable(droppableElement, { accept: new Set(['g']) });
        const dndObserver = new DndObserver<AdvancedCollisionData>({
          collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
        });

        dndObserver.addDraggables([draggable]);
        dndObserver.addDroppables([droppable]);
        dndObserver.on('collide', (data) => {
          collisionEvents.push({ type: 'enter', collisions: data.collisions });
        });

        // Start dragging.
        focusElement(draggableElement);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await waitNextFrame();

        // Assert that a single collision was detected.
        expect(collisionEvents.length).toBe(1);
        expect(collisionEvents[0].collisions.length).toBe(1);

        // Assert that the visible rectangles are correct.
        const firstCollision = collisionEvents[0].collisions[0];
        expect(firstCollision.draggableVisibleRect).toStrictEqual({
          x: 0,
          y: 0,
          width: 100,
          height: 100,
        });
        expect(firstCollision.droppableVisibleRect).toStrictEqual({
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        });

        // Cleanup.
        dndObserver.destroy();
        draggable.destroy();
        droppable.destroy();
        keyboard.destroy();
        draggableElement.remove();
        droppableElement.remove();
        containerElement.remove();
      });
    });

    describe('absolute visibility logic', () => {
      it('should always compute collisions from the perspective of the user regardless of clip containers', async () => {
        const collisionEvents: any[] = [];

        const containerElement = createTestElement({
          left: '-50px',
          top: '-50px',
          width: '100px',
          height: '100px',
          overflow: 'hidden',
        });
        const draggableElement = createTestElement({
          left: '0px',
          top: '0px',
          width: '100px',
          height: '100px',
        });
        const droppableElement = createTestElement({
          left: '0px',
          top: '0px',
          width: '100px',
          height: '100px',
        });

        containerElement.appendChild(draggableElement);
        containerElement.appendChild(droppableElement);

        const keyboard = new KeyboardSensor(draggableElement, { moveDistance: 50 });
        const draggable = new Draggable([keyboard], {
          elements: () => [draggableElement],
          dndGroups: new Set(['g']),
        });
        const droppable = new Droppable(droppableElement, { accept: new Set(['g']) });
        const dndObserver = new DndObserver<AdvancedCollisionData>({
          collisionDetector: (ctx) =>
            new AdvancedCollisionDetector(ctx, { visibilityLogic: 'absolute' }),
        });

        dndObserver.addDraggables([draggable]);
        dndObserver.addDroppables([droppable]);
        dndObserver.on('collide', (data) => {
          collisionEvents.push({ type: 'enter', collisions: data.collisions });
        });

        // Start dragging.
        focusElement(draggableElement);
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
        await waitNextFrame();

        // Assert that a single collision was detected.
        expect(collisionEvents.length).toBe(1);
        expect(collisionEvents[0].collisions.length).toBe(1);

        // Assert that the visible rectangles are correct.
        const firstCollision = collisionEvents[0].collisions[0];
        expect(firstCollision.draggableVisibleRect).toStrictEqual({
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        });
        expect(firstCollision.droppableVisibleRect).toStrictEqual({
          x: 0,
          y: 0,
          width: 50,
          height: 50,
        });

        // Cleanup.
        dndObserver.destroy();
        draggable.destroy();
        droppable.destroy();
        keyboard.destroy();
        draggableElement.remove();
        droppableElement.remove();
        containerElement.remove();
      });
    });
  });
};
