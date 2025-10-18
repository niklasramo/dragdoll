import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  autoScrollPlugin,
  DndContext,
  DndContextEventType,
  Draggable,
  Droppable,
  KeyboardMotionSensor,
  PointerSensor,
} from 'dragdoll';
import { getOffset } from 'mezr';

// Keep track of the best match droppable.
const bestMatchMap: Map<Draggable<any>, Droppable> = new Map();

// Get elements.
const scrollContainers = [...document.querySelectorAll('.scroll-list')] as HTMLElement[];
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Initialize DndContext.
const dndContext = new DndContext<AdvancedCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

// Create droppables.
const droppables: Droppable[] = [];
for (const droppableElement of droppableElements) {
  const droppable = new Droppable(droppableElement);
  droppables.push(droppable);
}

// Create draggables.
const draggables: Draggable<any>[] = [];
for (const draggableElement of draggableElements) {
  const draggable = new Draggable(
    [new PointerSensor(draggableElement), new KeyboardMotionSensor(draggableElement)],
    {
      // Only move the draggable element.
      elements: () => [draggableElement],
      // Use the body as the drag container.
      container: document.body,
      // Freeze the width and height of the dragged element since we are using
      // a custom container and the element has percentage based values for
      // some of it's properties.
      frozenStyles: () => ['width', 'height'],
      // Allow the drag to start only if the element is not animating.
      startPredicate: () => !draggableElement.classList.contains('animate'),
      // Toggle the dragging class on the draggable element when the drag starts
      // and ends.
      onStart: () => {
        draggableElement.classList.add('dragging');
      },
      onEnd: () => {
        draggableElement.classList.remove('dragging');
      },
    },
  ).use(
    // Allow the draggable to scroll the scroll containers when the dragged
    // element is close to it's edges.
    autoScrollPlugin({
      targets: scrollContainers.map((scrollContainer) => ({
        element: scrollContainer,
        axis: 'y',
        padding: { top: 0, bottom: 0 },
      })),
    }),
  );
  draggables.push(draggable);
}

// Add droppables and draggables to the context.
dndContext.addDroppables(droppables);
dndContext.addDraggables(draggables);

// On draggable collision with droppables.
dndContext.on(DndContextEventType.Collide, ({ draggable, contacts }) => {
  // Get the draggable element.
  const draggableElement = draggable.drag?.items[0].element as HTMLElement | null;
  if (!draggableElement) return;

  // Get the draggable id.
  const draggableId = draggableElement.getAttribute('data-id') || '';
  if (draggableId === '') return;

  // Get the next best match droppable.
  let nextBestMatch: Droppable | null = null;
  for (const droppable of contacts) {
    // Skip if the droppable contains a different draggable.
    const containedDraggableId = droppable.element.getAttribute('data-draggable-contained') || '';
    if (containedDraggableId && containedDraggableId !== draggableId) {
      continue;
    }

    // Skip if a different draggable is over the droppable.
    const overDraggableId = droppable.element.getAttribute('data-draggable-over') || '';
    if (overDraggableId && overDraggableId !== draggableId) {
      continue;
    }

    // We found the next best match.
    nextBestMatch = droppable;
    break;
  }

  // Update the best match droppable if it's changed.
  const bestMatch = bestMatchMap.get(draggable);
  if (nextBestMatch !== null && nextBestMatch !== bestMatch) {
    bestMatch?.element.removeAttribute('data-draggable-over');
    nextBestMatch.element.setAttribute('data-draggable-over', draggableId);
    bestMatchMap.set(draggable, nextBestMatch);
  }
});

// On drag end.
dndContext.on(DndContextEventType.End, ({ draggable, canceled }) => {
  const draggableElement = draggable.drag?.items[0].element as HTMLElement | null;
  if (!draggableElement) return;

  // Find out the original container and the target container based on the best
  // match droppable.
  const bestMatch = bestMatchMap.get(draggable);
  const originalContainer = draggableElement.parentElement!;
  const targetContainer =
    !canceled && bestMatch ? (bestMatch.element as HTMLElement) : originalContainer;

  // If draggable moved into a different container.
  if (originalContainer !== targetContainer) {
    // Move the draggable to the target container. While doing that, let's add
    // the offset between the original container and the target container to the
    // draggable's transform so it's visual position does not change.
    const offsetData = getOffset(originalContainer, targetContainer);
    const transformString = `translate(${offsetData.left}px, ${offsetData.top}px) ${draggableElement.style.transform}`;
    draggableElement.style.transform = transformString;
    targetContainer.appendChild(draggableElement);

    // Move the data-draggable-contained attribute to the target container.
    originalContainer.removeAttribute('data-draggable-contained');
    targetContainer.setAttribute(
      'data-draggable-contained',
      draggableElement.getAttribute('data-id')!,
    );
  }

  // Animate the draggable's transform back to "zero" (no transform).
  const transformMatrix = new DOMMatrix().setMatrixValue(draggableElement.style.transform);
  if (!transformMatrix.isIdentity) {
    draggableElement.classList.add('animate');
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.target === draggableElement && e.propertyName === 'transform') {
        draggableElement.classList.remove('animate');
        document.body.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    document.body.addEventListener('transitionend', onTransitionEnd);
    draggableElement.clientHeight; // Force a reflow.
    draggableElement.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
  }

  // Reset the best match droppable.
  bestMatch?.element.removeAttribute('data-draggable-over');
  bestMatchMap.delete(draggable);
});
