import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  DndContext,
  Droppable,
  DndContextEventType,
} from '../../src';

// Initialize context and get elements
const dndContext = new DndContext();
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Create droppables
droppableElements.forEach((element) => {
  const droppable = new Droppable(element);
  droppable.data.overIds = new Set<number>();
  droppable.data.droppedIds = new Set<number>();
  dndContext.addDroppable(droppable);
});

// Create draggables
draggableElements.forEach((element) => {
  const draggable = new Draggable([new PointerSensor(element), new KeyboardMotionSensor(element)], {
    elements: () => [element],
    startPredicate: () => !element.classList.contains('dragging'),
    onStart: (drag) => drag.items[0].element.classList.add('dragging'),
    onEnd: (drag) => drag.items[0].element.classList.remove('dragging'),
  });
  dndContext.addDraggable(draggable);
});

// DnD logic
{
  const onStart = (data: { draggable: Draggable; targets: Droppable[] }) => {
    const { draggable, targets } = data;
    targets.forEach((target) => {
      target.data.droppedIds.delete(draggable.id);
      if (target.data.droppedIds.size === 0) {
        target.element.classList.remove('draggable-dropped');
      }
    });
  };

  const onEnterAndOver = (data: { draggable: Draggable; collisions: Droppable[] }) => {
    const { draggable, collisions } = data;
    const clonedCollisions = [...collisions];

    // Add the draggable to the first collision.
    const target = clonedCollisions.shift()!;
    target.data.overIds.add(draggable.id);
    target.element.classList.add('draggable-over');

    // Remove the draggable from the other collisions.
    clonedCollisions.forEach((collision) => {
      collision.data.overIds.delete(draggable.id);
      if (collision.data.overIds.size === 0) {
        collision.element.classList.remove('draggable-over');
      }
    });
  };

  const onLeave = (data: { draggable: Draggable; removedCollisions: Droppable[] }) => {
    const { draggable, removedCollisions } = data;
    removedCollisions.forEach((target) => {
      target.data.overIds.delete(draggable.id);
      if (target.data.overIds.size === 0) {
        target.element.classList.remove('draggable-over');
      }
    });
  };

  const onDrop = (data: { draggable: Draggable; collisions: Droppable[] }) => {
    const { draggable, collisions } = data;
    const target = collisions[0];

    // Update dropped ids
    target.data.droppedIds.add(draggable.id);
    target.element.classList.add('draggable-dropped');

    // Update over ids
    target.data.overIds.delete(draggable.id);
    if (target.data.overIds.size === 0) {
      target.element.classList.remove('draggable-over');
    }
  };

  dndContext.on(DndContextEventType.Start, onStart);
  dndContext.on(DndContextEventType.Enter, onEnterAndOver);
  dndContext.on(DndContextEventType.Over, onEnterAndOver);
  dndContext.on(DndContextEventType.Leave, onLeave);
  dndContext.on(DndContextEventType.Drop, onDrop);
}
