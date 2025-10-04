import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  DndContext,
  Droppable,
  DndContextEventType,
} from '../../src';

let zIndex = 0;

// Initialize context and get elements
const dndContext = new DndContext();
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Create droppables
droppableElements.forEach((element) => {
  const droppable = new Droppable(element);
  droppable.data.overIds = new Set<number>();
  droppable.data.droppedIds = new Set<number>();
  dndContext.addDroppables([droppable]);
});

// Create draggables
draggableElements.forEach((element) => {
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
  dndContext.addDraggables([draggable]);
});

// DnD logic

// On drag start loop through all target droppables and remove the draggable id
// from the dropped ids set. If the dropped ids set is empty, remove the
// "draggable-dropped" class from the droppable element.
dndContext.on(DndContextEventType.Start, (data) => {
  const { draggable, targets } = data;
  targets.forEach((droppable) => {
    droppable.data.droppedIds.delete(draggable.id);
    if (droppable.data.droppedIds.size === 0) {
      droppable.element.classList.remove('draggable-dropped');
    }
  });
});

// On each collision change, keep track of the overIds set for each droppable
// and update the "draggable-over" class based on the over ids set.
dndContext.on(DndContextEventType.Collide, (data) => {
  const { draggable, contacts, removedContacts } = data;

  // Remove the draggable id from the droppables that stopped colliding and
  // remove the "draggable-over" class from the droppable element if there are
  // no more draggable ids in the over ids set.
  removedContacts.forEach((target) => {
    target.data.overIds.delete(draggable.id);
    if (target.data.overIds.size === 0) {
      target.element.classList.remove('draggable-over');
    }
  });

  // Add the draggable to the first colliding droppable (best match), and remove
  // the draggable from the other colliding droppables. Update the
  // "draggable-over" class based on the over ids set.
  let i = 0;
  for (const droppable of contacts) {
    if (i === 0) {
      droppable.data.overIds.add(draggable.id);
      droppable.element.classList.add('draggable-over');
    } else {
      droppable.data.overIds.delete(draggable.id);
      if (droppable.data.overIds.size === 0) {
        droppable.element.classList.remove('draggable-over');
      }
    }
    ++i;
  }
});

dndContext.on(DndContextEventType.End, (data) => {
  const { draggable, contacts } = data;

  // For the first colliding droppable (best match), add the draggable id to the
  // dropped ids set, add the "draggable-dropped" class to the droppable
  // element, and remove the draggable id from the over ids set. If the over ids
  // set is empty, remove the "draggable-over" class from the droppable element.
  for (const droppable of contacts) {
    droppable.data.droppedIds.add(draggable.id);
    droppable.element.classList.add('draggable-dropped');
    droppable.data.overIds.delete(draggable.id);
    if (droppable.data.overIds.size === 0) {
      droppable.element.classList.remove('draggable-over');
    }
    return;
  }
});
