import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  DndContext,
  Droppable,
  DndContextEventType,
  AdvancedCollisionDetector,
  ACDCollisionData,
} from '../../src';

let zIndex = 0;

// Initialize context with the visible-rect collision detector
const dndContext = new DndContext<ACDCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

// Elements
const draggableElement = document.querySelector('.draggable') as HTMLElement;
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Create droppables inside the scroll container
droppableElements.forEach((element) => {
  const droppable = new Droppable(element);
  droppable.data.overIds = new Set<number>();
  droppable.data.droppedIds = new Set<number>();
  dndContext.addDroppables([droppable]);
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
  const onStart = (data: { draggable: Draggable; targets: ReadonlyMap<Symbol, Droppable> }) => {
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
    collisions: ReadonlyArray<ACDCollisionData>;
  }) => {
    const { draggable, collisions } = data;
    const targetId = collisions.length > 0 ? collisions[0].droppableId : null;
    const target = targetId ? dndContext.droppables.get(targetId) : null;
    if (target) {
      target.data.overIds.add(draggable.id);
      target.element.classList.add('draggable-over');
    }
    // Remove active state from other droppables that are no longer colliding
    for (const droppable of dndContext.droppables.values()) {
      if (droppable !== target && !collisions.some((c) => c.droppableId === droppable.id)) {
        droppable.data.overIds.delete(draggable.id);
        if (droppable.data.overIds.size === 0) {
          droppable.element.classList.remove('draggable-over');
        }
      }
    }
  };

  const onLeave = (data: { draggable: Draggable; removedContacts: ReadonlySet<Droppable> }) => {
    const { draggable, removedContacts } = data;
    removedContacts.forEach((target) => {
      target.data.overIds.delete(draggable.id);
      if (target.data.overIds.size === 0) {
        target.element.classList.remove('draggable-over');
      }
    });
  };

  const onEnd = (data: { draggable: Draggable; collisions: ReadonlyArray<ACDCollisionData> }) => {
    const { draggable, collisions } = data;
    const target =
      collisions.length > 0 ? dndContext.droppables.get(collisions[0].droppableId) : null;
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
  dndContext.on(DndContextEventType.Collide, onEnterAndOver);
  dndContext.on(DndContextEventType.Leave, onLeave);
  dndContext.on(DndContextEventType.End, onEnd);
}
