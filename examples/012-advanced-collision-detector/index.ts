import {
  DndContext,
  Draggable,
  Droppable,
  PointerSensor,
  KeyboardMotionSensor,
  DndContextEventType,
  AdvancedCollisionDetector,
  AdvancedCollisionData,
  autoScrollPlugin,
} from '../../src';

const scrollContainer = document.querySelector('.scroll-list') as HTMLElement;
const draggableEl = document.querySelector('.draggable') as HTMLElement;
const droppableEls = [...document.querySelectorAll('.droppable')] as HTMLElement[];

const dnd = new DndContext<AdvancedCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

// Create droppables.
const droppables: Droppable[] = [];
for (const el of droppableEls) {
  const drop = new Droppable(el);
  drop.data.overIds = new Set<number>();
  drop.data.droppedIds = new Set<number>();
  droppables.push(drop);
}

// Create draggable.
const draggable = new Draggable(
  [new PointerSensor(draggableEl), new KeyboardMotionSensor(draggableEl)],
  {
    container: document.body,
    elements: () => [draggableEl],
    startPredicate: () => !draggableEl.classList.contains('dragging'),
    onStart: () => {
      draggableEl.classList.add('dragging');
    },
    onEnd: () => {
      draggableEl.classList.remove('dragging');
    },
  },
).use(
  autoScrollPlugin({
    targets: [
      {
        element: scrollContainer,
        axis: 'y',
        padding: { top: 0, bottom: 0 },
      },
    ],
  }),
);

// Add droppables and draggable to the context.
dnd.addDroppables(droppables);
dnd.addDraggables([draggable]);

// On start, clear previous dropped state from all targets.
dnd.on(DndContextEventType.Start, ({ draggable, targets }) => {
  targets.forEach((droppable) => {
    droppable.data.droppedIds.delete(draggable.id);
    if (droppable.data.droppedIds.size === 0) {
      droppable.element.classList.remove('draggable-dropped');
    }
  });
});

// Update over classes.
dnd.on(DndContextEventType.Collide, ({ draggable, contacts, removedContacts }) => {
  removedContacts.forEach((target) => {
    target.data.overIds.delete(draggable.id);
    if (target.data.overIds.size === 0) {
      target.element.classList.remove('draggable-over');
    }
  });

  let i = 0;
  for (const t of contacts) {
    if (i === 0) {
      t.data.overIds.add(draggable.id);
      t.element.classList.add('draggable-over');
    } else {
      t.data.overIds.delete(draggable.id);
      if (t.data.overIds.size === 0) {
        t.element.classList.remove('draggable-over');
      }
    }
    i++;
  }
});

// On end, mark dropped.
dnd.on(DndContextEventType.End, ({ draggable, contacts }) => {
  for (const t of contacts) {
    t.data.droppedIds.add(draggable.id);
    t.element.classList.add('draggable-dropped');
    t.data.overIds.delete(draggable.id);
    if (t.data.overIds.size === 0) {
      t.element.classList.remove('draggable-over');
    }
    return;
  }
});
