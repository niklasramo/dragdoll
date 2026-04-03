/** @jsxImportSource solid-js */
import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  AnyDraggable,
  DndObserver,
  Droppable,
} from 'dragdoll';
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableAutoScroll,
  useDraggableDrag,
  useDroppable,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal, For, JSX, Show } from 'solid-js';
import { render } from 'solid-js/web';

type ListId = 'left' | 'right';

function getContainerInfo(container: HTMLElement): { listId: ListId; index: number } {
  return {
    listId: (container.getAttribute('data-list-id') || 'left') as ListId,
    index: parseInt(container.getAttribute('data-index') || '0', 10),
  };
}

const dragContainer = document.getElementById('drag-container') as HTMLElement;

function createDragPreviewElement(element: HTMLElement, draggableId: string): HTMLElement {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.transform = '';
  clone.classList.add('drag-preview', 'dragging');
  clone.setAttribute('data-id', draggableId);
  dragContainer.appendChild(clone);
  return clone;
}

function cleanupDrag(
  previewElement: HTMLElement | null,
  originalElement: HTMLElement | null,
  draggableId: string,
  bestMatch: Droppable | null,
  setHiddenIds: (fn: (prev: Set<string>) => Set<string>) => void,
  bestMatchMap: Map<AnyDraggable, Droppable>,
  draggable: AnyDraggable,
  includeAnimate = false,
) {
  try {
    previewElement?.remove();
  } catch {
    // Ignore removal errors
  }
  if (originalElement) {
    originalElement.classList.remove('dragging', 'hidden');
    if (includeAnimate) {
      originalElement.classList.remove('animate');
    }
  }
  setHiddenIds((prev) => {
    if (!prev.has(draggableId)) return prev;
    const next = new Set(prev);
    next.delete(draggableId);
    return next;
  });
  bestMatch?.element?.removeAttribute('data-draggable-over');
  bestMatchMap.delete(draggable);
}

function findBestMatch(contacts: ReadonlySet<Droppable>, draggableId: string): Droppable | null {
  for (const droppable of contacts) {
    const containedId = droppable.element?.getAttribute('data-draggable-contained') || '';
    if (containedId && containedId !== draggableId) continue;
    const overId = droppable.element?.getAttribute('data-draggable-over') || '';
    if (overId && overId !== draggableId) continue;
    return droppable;
  }
  return null;
}

function getTargetPosition(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const style = getComputedStyle(container);
  const borderLeft = parseFloat(style.borderLeftWidth || '0') || 0;
  const borderTop = parseFloat(style.borderTopWidth || '0') || 0;
  return {
    left: rect.left + borderLeft + 10,
    top: rect.top + borderTop + 10,
  };
}

const collisionDetector = (ctx: DndObserver<AdvancedCollisionData>) =>
  new AdvancedCollisionDetector(ctx);

const ANIMATION_EPSILON = 0.5;

function DraggableCard(props: {
  draggableId: string;
  scrollContainers: HTMLElement[];
  onDragStart: (draggableId: string) => void;
  isHidden: boolean;
  elementMap: Map<string, HTMLDivElement>;
}) {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], {
      elements: () => {
        if (!element) return [];
        return [createDragPreviewElement(element, props.draggableId)];
      },
      frozenStyles: (): ('width' | 'height')[] => ['width', 'height'],
      startPredicate: () => !element?.classList.contains('animate'),
      onStart: () => {
        element?.classList.add('dragging', 'hidden');
        props.onDragStart(props.draggableId);
      },
    }),
    {
      targets: () =>
        props.scrollContainers.map((sc) => ({
          element: sc,
          axis: 'y' as const,
          padding: { top: 0, bottom: 0 },
        })),
    },
  );

  useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        props.elementMap.set(props.draggableId, node);
        setPointerSensorRef(node);
        setKeyboardSensorRef(node);
      }}
      class={`card draggable ${props.isHidden ? 'hidden' : ''}`}
      tabIndex={0}
      data-id={props.draggableId}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

function DroppableZone(props: {
  containedDraggableId?: string;
  listId: ListId;
  index: number;
  children?: JSX.Element;
}) {
  const [_droppable, setDroppableRef] = useDroppable({ data: {} });

  return (
    <div
      ref={setDroppableRef}
      class="droppable"
      data-list-id={props.listId}
      data-index={props.index}
      {...(props.containedDraggableId
        ? { 'data-draggable-contained': props.containedDraggableId }
        : {})}
    >
      {props.children}
    </div>
  );
}

function ScrollList(props: {
  listId: ListId;
  slots: Array<string | null>;
  hiddenIds: Set<string>;
  onDragStart: (draggableId: string) => void;
  scrollContainers: HTMLElement[];
  elementMap: Map<string, HTMLDivElement>;
}) {
  return (
    <div
      ref={(node) => {
        if (node && !props.scrollContainers.includes(node)) {
          props.scrollContainers.push(node);
        }
      }}
      class="scroll-list"
      data-list-id={props.listId}
    >
      <For each={props.slots}>
        {(slotDraggableId, i) => (
          <DroppableZone
            listId={props.listId}
            index={i()}
            containedDraggableId={slotDraggableId || undefined}
          >
            <Show when={slotDraggableId}>
              {(id) => (
                <DraggableCard
                  draggableId={id()}
                  scrollContainers={props.scrollContainers}
                  onDragStart={props.onDragStart}
                  isHidden={props.hiddenIds.has(id())}
                  elementMap={props.elementMap}
                />
              )}
            </Show>
          </DroppableZone>
        )}
      </For>
    </div>
  );
}

function App() {
  // Stable mutable refs — Solid components run once.
  const scrollContainers: HTMLElement[] = [];
  const bestMatchMap = new Map<AnyDraggable, Droppable>();
  // O(1) lookup for original elements by draggable id.
  const elementMap = new Map<string, HTMLDivElement>();

  const [leftSlots, setLeftSlots] = createSignal<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '1' : null)),
  );
  const [rightSlots, setRightSlots] = createSignal<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '2' : null)),
  );
  const [hiddenIds, setHiddenIds] = createSignal<Set<string>>(new Set());

  const onDragStart = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const updateSlot = (listId: ListId, index: number, value: string | null) => {
    const setter = listId === 'left' ? setLeftSlots : setRightSlots;
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const moveDraggable = (
    id: string,
    fromList: ListId,
    fromIndex: number,
    toList: ListId,
    toIndex: number,
  ) => {
    if (fromList === toList && fromIndex === toIndex) return;
    updateSlot(fromList, fromIndex, null);
    updateSlot(toList, toIndex, id);
  };

  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ draggable, contacts }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const nextBestMatch = findBestMatch(contacts, draggableId);
      const currentBestMatch = bestMatchMap.get(draggable);

      if (nextBestMatch && nextBestMatch !== currentBestMatch) {
        currentBestMatch?.element?.removeAttribute('data-draggable-over');
        nextBestMatch?.element?.setAttribute('data-draggable-over', draggableId);
        bestMatchMap.set(draggable, nextBestMatch);
      }
    },
    onEnd: ({ draggable, canceled }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const bestMatch = bestMatchMap.get(draggable) || null;
      const originalElement = elementMap.get(draggableId) || null;
      const originalContainer = originalElement?.parentElement as HTMLElement | null;
      const targetContainer =
        !canceled && bestMatch ? (bestMatch.element as HTMLElement) : originalContainer;

      if (!originalContainer || !targetContainer) {
        cleanupDrag(
          previewElement,
          originalElement,
          draggableId,
          bestMatch,
          setHiddenIds,
          bestMatchMap,
          draggable,
        );
        return;
      }

      // Compute animation values BEFORE updating Solid state.
      // Solid re-renders synchronously, so the DOM changes
      // immediately when we call moveDraggable(). We need the
      // current positions before that happens.
      const from = getContainerInfo(originalContainer);
      const to = getContainerInfo(targetContainer);
      const baseLeft = parseFloat(previewElement.style.left || '0');
      const baseTop = parseFloat(previewElement.style.top || '0');
      const targetPos = getTargetPosition(targetContainer);
      const currentPos = previewElement.getBoundingClientRect();
      const deltaX = targetPos.left - currentPos.left;
      const deltaY = targetPos.top - currentPos.top;

      // Now update Solid state (triggers synchronous re-render).
      moveDraggable(draggableId, from.listId, from.index, to.listId, to.index);

      if (Math.abs(deltaX) < ANIMATION_EPSILON && Math.abs(deltaY) < ANIMATION_EPSILON) {
        cleanupDrag(
          previewElement,
          originalElement,
          draggableId,
          bestMatch,
          setHiddenIds,
          bestMatchMap,
          draggable,
        );
        return;
      }

      const finalTranslateX = targetPos.left - baseLeft;
      const finalTranslateY = targetPos.top - baseTop;
      previewElement.classList.add('animating');
      previewElement.clientHeight;
      previewElement.style.transform = `translate(${finalTranslateX}px, ${finalTranslateY}px)`;

      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.target === previewElement && e.propertyName === 'transform') {
          cleanupDrag(
            previewElement,
            originalElement,
            draggableId,
            bestMatch,
            setHiddenIds,
            bestMatchMap,
            draggable,
            true,
          );
          document.body.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      document.body.addEventListener('transitionend', onTransitionEnd);
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div class="container">
        <ScrollList
          listId="left"
          slots={leftSlots()}
          hiddenIds={hiddenIds()}
          onDragStart={onDragStart}
          scrollContainers={scrollContainers}
          elementMap={elementMap}
        />
        <ScrollList
          listId="right"
          slots={rightSlots()}
          hiddenIds={hiddenIds()}
          onDragStart={onDragStart}
          scrollContainers={scrollContainers}
          elementMap={elementMap}
        />
      </div>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
