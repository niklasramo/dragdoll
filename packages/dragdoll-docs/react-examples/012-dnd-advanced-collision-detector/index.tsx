import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  AnyDraggable,
  Droppable,
} from 'dragdoll';
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableAutoScroll,
  UseDraggableAutoScrollSettings,
  useDraggableDrag,
  UseDraggableSettings,
  useDroppable,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import {
  memo,
  ReactNode,
  RefObject,
  StrictMode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';

type ListId = 'left' | 'right';

// Helper to get container info from a droppable element
function getContainerInfo(container: HTMLElement): { listId: ListId; index: number } {
  return {
    listId: (container.getAttribute('data-list-id') || 'left') as ListId,
    index: parseInt(container.getAttribute('data-index') || '0', 10),
  };
}

// Helper to create a ghost/preview element
function createGhostElement(element: HTMLElement, draggableId: string): HTMLElement {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.transform = '';
  clone.classList.add('ghost', 'dragging');
  clone.setAttribute('data-id', draggableId);
  document.body.appendChild(clone);
  return clone;
}

// Helper to cleanup after drag ends
function cleanupDrag(
  previewElement: HTMLElement | null,
  originalElement: HTMLElement | null,
  draggableId: string,
  bestMatch: Droppable | null,
  setHiddenIds: React.Dispatch<React.SetStateAction<Set<string>>>,
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
  bestMatch?.element.removeAttribute('data-draggable-over');
  bestMatchMap.delete(draggable);
}

// Helper to find the best matching droppable from contacts
function findBestMatch(contacts: ReadonlySet<Droppable>, draggableId: string): Droppable | null {
  for (const droppable of contacts) {
    const containedId = droppable.element.getAttribute('data-draggable-contained') || '';
    if (containedId && containedId !== draggableId) continue;

    const overId = droppable.element.getAttribute('data-draggable-over') || '';
    if (overId && overId !== draggableId) continue;

    return droppable;
  }
  return null;
}

// Helper to calculate target position for animation
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

// Collision detector factory
const collisionDetector = (ctx: any) => new AdvancedCollisionDetector(ctx);

// Constants
const ANIMATION_EPSILON = 0.5; // Minimum distance to trigger animation

const DraggableCardMemo = memo(function DraggableCard({
  draggableId,
  scrollContainerRefs,
  onDragStart,
  isHidden,
}: {
  draggableId: string;
  scrollContainerRefs: RefObject<HTMLElement[]>;
  onDragStart: (draggableId: string) => void;
  isHidden: boolean;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => {
        const element = elementRef.current;
        if (!element) return [];
        return [createGhostElement(element, draggableId)];
      },
      container: document.body,
      frozenStyles: () => ['width', 'height'],
      startPredicate: () => !elementRef.current?.classList.contains('animate'),
      onStart: () => {
        elementRef.current?.classList.add('dragging', 'hidden');
        onDragStart(draggableId);
      },
    }),
    [draggableId, onDragStart],
  );

  const autoScrollSettings: UseDraggableAutoScrollSettings = useMemo(
    () => ({
      targets: () =>
        (scrollContainerRefs.current || []).map((scrollContainer) => ({
          element: scrollContainer,
          axis: 'y',
          padding: { top: 0, bottom: 0 },
        })),
    }),
    [scrollContainerRefs],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], draggableSettings),
    autoScrollSettings,
  );

  useDraggableDrag(draggable);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorRef(node);
      setKeyboardSensorRef(node);
    },
    [setPointerSensorRef, setKeyboardSensorRef],
  );

  return (
    <div
      ref={setRefs}
      className={`card draggable ${isHidden ? 'hidden' : ''}`}
      tabIndex={0}
      data-id={draggableId}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

const DroppableZoneMemo = memo(function DroppableZone({
  containedDraggableId,
  listId,
  index,
  children,
}: {
  containedDraggableId?: string;
  listId: ListId;
  index: number;
  children?: ReactNode;
}) {
  const [_droppable, setDroppableElementRef] = useDroppable({ data: {} });

  return (
    <div
      ref={setDroppableElementRef}
      className="droppable"
      data-list-id={listId}
      data-index={index}
      {...(containedDraggableId ? { 'data-draggable-contained': containedDraggableId } : {})}
    >
      {children}
    </div>
  );
});

const ScrollListMemo = memo(function ScrollList({
  listId,
  slots,
  hiddenIds,
  onDragStart,
  scrollContainerRefs,
}: {
  listId: ListId;
  slots: Array<string | null>;
  hiddenIds: Set<string>;
  onDragStart: (draggableId: string) => void;
  scrollContainerRefs: RefObject<HTMLElement[]>;
}) {
  const setScrollListRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollContainerRefs.current && !scrollContainerRefs.current.includes(node)) {
        scrollContainerRefs.current.push(node);
      }
    },
    [scrollContainerRefs],
  );

  return (
    <div ref={setScrollListRef} className="scroll-list" data-list-id={listId}>
      {slots.map((slotDraggableId, i) => (
        <DroppableZoneMemo
          key={i}
          listId={listId}
          index={i}
          containedDraggableId={slotDraggableId || undefined}
        >
          {slotDraggableId && (
            <DraggableCardMemo
              draggableId={slotDraggableId}
              scrollContainerRefs={scrollContainerRefs}
              onDragStart={onDragStart}
              isHidden={hiddenIds.has(slotDraggableId)}
            />
          )}
        </DroppableZoneMemo>
      ))}
    </div>
  );
});

function App() {
  const scrollContainerRefs = useRef<HTMLElement[]>([]);
  const bestMatchMapRef = useRef<Map<AnyDraggable, Droppable>>(new Map());
  const [leftSlots, setLeftSlots] = useState<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '1' : null)),
  );
  const [rightSlots, setRightSlots] = useState<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '2' : null)),
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const onDragStart = useCallback((id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const updateSlot = useCallback((listId: ListId, index: number, value: string | null) => {
    const setter = listId === 'left' ? setLeftSlots : setRightSlots;
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const moveDraggableWithinReact = useCallback(
    (id: string, fromList: ListId, fromIndex: number, toList: ListId, toIndex: number) => {
      if (fromList === toList && fromIndex === toIndex) return;
      updateSlot(fromList, fromIndex, null);
      updateSlot(toList, toIndex, id);
    },
    [updateSlot],
  );

  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ draggable, contacts }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const nextBestMatch = findBestMatch(contacts, draggableId);
      const currentBestMatch = bestMatchMapRef.current.get(draggable);

      if (nextBestMatch && nextBestMatch !== currentBestMatch) {
        currentBestMatch?.element.removeAttribute('data-draggable-over');
        nextBestMatch.element.setAttribute('data-draggable-over', draggableId);
        bestMatchMapRef.current.set(draggable, nextBestMatch);
      }
    },
    onEnd: ({ draggable, canceled }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const bestMatch = bestMatchMapRef.current.get(draggable) || null;
      const originalElement = document.querySelector(
        `.card.draggable[data-id="${draggableId}"]`,
      ) as HTMLElement | null;
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
          bestMatchMapRef.current,
          draggable,
        );
        return;
      }

      // Move item in React state if needed
      const from = getContainerInfo(originalContainer);
      const to = getContainerInfo(targetContainer);
      moveDraggableWithinReact(draggableId, from.listId, from.index, to.listId, to.index);

      // Animate preview to final position
      const baseLeft = parseFloat(previewElement.style.left || '0');
      const baseTop = parseFloat(previewElement.style.top || '0');
      const targetPos = getTargetPosition(targetContainer);
      const currentPos = previewElement.getBoundingClientRect();
      const deltaX = targetPos.left - currentPos.left;
      const deltaY = targetPos.top - currentPos.top;

      // Skip animation if already at target position
      if (Math.abs(deltaX) < ANIMATION_EPSILON && Math.abs(deltaY) < ANIMATION_EPSILON) {
        cleanupDrag(
          previewElement,
          originalElement,
          draggableId,
          bestMatch,
          setHiddenIds,
          bestMatchMapRef.current,
          draggable,
        );
        return;
      }

      // Animate preview to target position
      const finalTranslateX = targetPos.left - baseLeft;
      const finalTranslateY = targetPos.top - baseTop;
      previewElement.classList.add('animating');
      previewElement.clientHeight; // Force reflow
      previewElement.style.transform = `translate(${finalTranslateX}px, ${finalTranslateY}px)`;

      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.target === previewElement && e.propertyName === 'transform') {
          cleanupDrag(
            previewElement,
            originalElement,
            draggableId,
            bestMatch,
            setHiddenIds,
            bestMatchMapRef.current,
            draggable,
            true, // Include 'animate' class removal
          );
          document.body.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      document.body.addEventListener('transitionend', onTransitionEnd);
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div className="container">
        <ScrollListMemo
          listId="left"
          slots={leftSlots}
          hiddenIds={hiddenIds}
          onDragStart={onDragStart}
          scrollContainerRefs={scrollContainerRefs}
        />
        <ScrollListMemo
          listId="right"
          slots={rightSlots}
          hiddenIds={hiddenIds}
          onDragStart={onDragStart}
          scrollContainerRefs={scrollContainerRefs}
        />
      </div>
    </DndObserverContext.Provider>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
