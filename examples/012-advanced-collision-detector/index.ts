import { getOffset } from 'mezr';
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
  ticker,
  tickerPhases,
} from '../../src';

// Keep track of the best match droppable.
let bestMatchDroppable: Droppable | null = null;

// Get elements.
const scrollContainer = document.querySelector('.scroll-list') as HTMLElement;
const draggableElement = document.querySelector('.draggable') as HTMLElement;
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Initialize DndContext.
const dndContext = new DndContext<AdvancedCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

// Create droppables.
const droppables: Droppable[] = [];
for (const droppableElement of droppableElements) {
  const droppable = new Droppable(droppableElement);
  droppable.data.overIds = new Set<number>();
  droppable.data.droppedIds = new Set<number>();
  droppables.push(droppable);
}

// Create draggable.
const draggable = new Draggable(
  [new PointerSensor(draggableElement), new KeyboardMotionSensor(draggableElement)],
  {
    container: document.body,
    elements: () => [draggableElement],
    startPredicate: () => !draggableElement.classList.contains('animate'),
    onStart: () => {
      draggableElement.classList.add('dragging');
    },
    onEnd: () => {
      draggableElement.classList.remove('dragging');
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
dndContext.addDroppables(droppables);
dndContext.addDraggables([draggable]);

dndContext.on(DndContextEventType.Collide, ({ draggable, contacts }) => {
  // Get the next best match droppable.
  let nextBestMatch: Droppable | null = null;
  for (const droppable of contacts) {
    nextBestMatch = droppable;
    break;
  }

  // Update the best match droppable if it's changed.
  if (nextBestMatch !== null && nextBestMatch !== bestMatchDroppable) {
    bestMatchDroppable?.element.classList.remove('draggable-over');
    nextBestMatch.element.classList.add('draggable-over');
    bestMatchDroppable = nextBestMatch;
  }
});

dndContext.on(DndContextEventType.End, ({ draggable, contacts, canceled }) => {
  // Find out the original container and the target container, based on the
  // best match droppable.
  // TODO: We want this to work a bit differently. If there are no contacts,
  // we want to keep the last best match as the target container.
  const originalContainer = draggableElement.parentElement!;
  const targetContainer =
    !canceled && bestMatchDroppable
      ? (bestMatchDroppable.element as HTMLElement)
      : originalContainer;

  // Move the draggable to the target container. While doing that, let's add
  // the offset between the original container and the target container to the
  // draggable's transform so it's visual positoin does not change.
  if (originalContainer !== targetContainer) {
    const offsetData = getOffset(originalContainer, targetContainer);
    const transformString = `translate(${offsetData.left}px, ${offsetData.top}px) ${draggableElement.style.transform}`;
    draggableElement.style.transform = transformString;
    targetContainer.appendChild(draggableElement);
  }

  // Animate the draggable's transform back to "zero" (no transform).
  const transformMatrix = new DOMMatrix().setMatrixValue(draggableElement.style.transform);
  if (!transformMatrix.isIdentity) {
    draggableElement.classList.add('animate');
    ticker.once(tickerPhases.write, () => {
      draggableElement.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.target === draggableElement) {
          draggableElement.classList.remove('animate');
          draggableElement.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      draggableElement.addEventListener('transitionend', onTransitionEnd);
    });
  }

  // Reset the best match droppable.
  bestMatchDroppable?.element.classList.remove('draggable-over');
  bestMatchDroppable = null;
});
