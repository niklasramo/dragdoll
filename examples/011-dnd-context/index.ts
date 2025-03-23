import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  DndContext,
  Droppable,
  DndContextEventType,
} from '../../src';

const dndContext = new DndContext();
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

//
// Setup droppables.
//

droppableElements.forEach((element) => {
  const droppable = new Droppable(element);
  dndContext.addDroppable(droppable);
});

//
// Setup draggables.
//

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  const draggable = new Draggable([pointerSensor, keyboardSensor], {
    elements: () => {
      return [element];
    },
    startPredicate: () => {
      return !element.classList.contains('dragging');
    },
    onStart: (drag) => {
      drag.items.forEach((item) => {
        item.element.classList.add('dragging');
      });
    },
    onEnd: (drag) => {
      drag.items.forEach((item) => {
        item.element.classList.remove('dragging');
      });
    },
  });
  dndContext.addDraggable(draggable);
});

//
// Setup dnd logic assuming that there can be multiple draggables being dragged
// at the same time.
//

dndContext.on(DndContextEventType.Start, (data) => {
  data.targets.forEach((target) => {
    target.element.removeAttribute('data-dropped-count');
  });
});

dndContext.on(DndContextEventType.Enter, (data) => {
  const primaryCollision = data.addedCollisions[0];
  const overCount = parseInt(primaryCollision.element.getAttribute('data-over-count') || '0', 10);
  primaryCollision.element.setAttribute('data-over-count', `${overCount + 1}`);
});

dndContext.on(DndContextEventType.Leave, (data) => {
  data.removedCollisions.forEach((target) => {
    const overCount = parseInt(target.element.getAttribute('data-over-count') || '0', 10);
    if (overCount > 1) {
      target.element.setAttribute('data-over-count', `${overCount - 1}`);
    } else {
      target.element.removeAttribute('data-over-count');
    }
  });
});

dndContext.on(DndContextEventType.Drop, (data) => {
  data.collisions.forEach((target) => {
    const droppedCount = parseInt(target.element.getAttribute('data-dropped-count') || '0', 10);
    target.element.setAttribute('data-dropped-count', `${droppedCount + 1}`);
  });
});

dndContext.on(DndContextEventType.End, (data) => {
  data.targets.forEach((target) => {
    const overCount = parseInt(target.element.getAttribute('data-over-count') || '0', 10);
    if (overCount > 1) {
      target.element.setAttribute('data-over-count', `${overCount - 1}`);
    } else {
      target.element.removeAttribute('data-over-count');
    }
  });
});
