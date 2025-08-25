import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  DndContext,
  Droppable,
  DndContextEventType,
  VisibleRectCollisionDetector,
} from '../../src';

let zIndex = 0;

// Initialize context with the visible-rect collision detector
const dndContext = new DndContext({
  collisionDetector: (ctx) => new VisibleRectCollisionDetector(ctx),
});

// Elements
const draggableElement = document.querySelector('.draggable') as HTMLElement;
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Create droppables inside the scroll container
droppableElements.forEach((element) => {
  const droppable = new Droppable(element);
  droppable.data.overIds = new Set<number>();
  droppable.data.droppedIds = new Set<number>();
  dndContext.addDroppable(droppable);
});

// Create a single draggable outside the scroll container
{
  const element = draggableElement;
  const draggable = new Draggable([new PointerSensor(element), new KeyboardMotionSensor(element)], {
    elements: () => [element],
    startPredicate: () => !element.classList.contains('dragging'),
    onStart: () => {
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
  dndContext.addDraggable(draggable);
}

// DnD logic (same pattern as example 011)
{
  const onStart = (data: { draggable: Draggable; targets: ReadonlySet<Droppable> }) => {
    const { draggable, targets } = data;
    targets.forEach((target) => {
      target.data.droppedIds.delete(draggable.id);
      if (target.data.droppedIds.size === 0) {
        target.element.classList.remove('draggable-dropped');
      }
    });
  };

  const onEnterAndOver = (data: {
    draggable: Draggable;
    collisions: ReadonlyMap<Droppable, any>;
  }) => {
    const { draggable, collisions } = data;
    const collisionArray = Array.from(collisions.keys());
    const target = collisionArray[0];
    if (target) {
      target.data.overIds.add(draggable.id);
      target.element.classList.add('draggable-over');
    }
    for (let i = 1; i < collisionArray.length; i++) {
      const c = collisionArray[i];
      c.data.overIds.delete(draggable.id);
      if (c.data.overIds.size === 0) {
        c.element.classList.remove('draggable-over');
      }
    }
  };

  const onLeave = (data: { draggable: Draggable; removedCollisions: ReadonlySet<Droppable> }) => {
    const { draggable, removedCollisions } = data;
    removedCollisions.forEach((target) => {
      target.data.overIds.delete(draggable.id);
      if (target.data.overIds.size === 0) {
        target.element.classList.remove('draggable-over');
      }
    });
  };

  const onDrop = (data: { draggable: Draggable; collisions: ReadonlyMap<Droppable, any> }) => {
    const { draggable, collisions } = data;
    const target = Array.from(collisions.keys())[0];
    if (!target) return;
    target.data.droppedIds.add(draggable.id);
    target.element.classList.add('draggable-dropped');
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
