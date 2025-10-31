import type { Droppable as DroppableInstance } from 'dragdoll';
import { AdvancedCollisionDetector, type AnyDraggable, autoScrollPlugin } from 'dragdoll';
import { DndContextProvider, Droppable, useDndContextEvents, useDraggable } from 'dragdoll-react';
import { getOffset } from 'mezr';
import React, { StrictMode, useCallback, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const ICON_PATH =
  'M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z';

const COLUMNS = [
  { id: 'left', cardId: '1' },
  { id: 'right', cardId: '2' },
];

const DROPPABLES_PER_COLUMN = 16;

type DroppableData = Record<string, never>;

type ScrollRegistrar = (index: number, element: HTMLElement | null) => void;

type CardProps = {
  id: string;
  getScrollContainers: () => HTMLElement[];
};

function Card({ id, getScrollContainers }: CardProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const { ref, draggable } = useDraggable({
    id,
    element: elementRef.current,
    container: typeof document !== 'undefined' ? document.body : null,
    pointerSensor: true,
    keyboardMotionSensor: true,
    frozenStyles: () => ['width', 'height'],
    startPredicate: () => !elementRef.current?.classList.contains('animate'),
    elements: () => (elementRef.current ? [elementRef.current] : null),
    onStart: () => {
      elementRef.current?.classList.add('dragging');
    },
    onEnd: () => {
      elementRef.current?.classList.remove('dragging');
    },
  });

  useEffect(() => {
    if (!draggable) return;
    const containers = getScrollContainers();
    if (!containers.length) return;
    if (!('autoscroll' in draggable.plugins)) {
      draggable.use(
        autoScrollPlugin({
          targets: containers.map((element) => ({
            element,
            axis: 'y',
            padding: { top: 0, bottom: 0 },
          })),
        }),
      );
    }
  }, [draggable, getScrollContainers]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <div ref={setRef} className="card draggable" tabIndex={0} data-id={id}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d={ICON_PATH} />
      </svg>
    </div>
  );
}

function DroppableCell({
  id,
  initialCardId,
  children,
}: {
  id: string;
  initialCardId?: string;
  children?: React.ReactNode;
}) {
  const data = useMemo<DroppableData>(() => ({}), []);

  return (
    <Droppable id={id} data={data}>
      {({ ref }) => (
        <div
          ref={(node) => {
            ref(node);
            if (node && initialCardId) {
              node.setAttribute('data-draggable-contained', initialCardId);
            }
          }}
          className="droppable"
        >
          {children}
        </div>
      )}
    </Droppable>
  );
}

function ScrollColumn({
  columnIndex,
  cardId,
  registerScroll,
  getScrollContainers,
}: {
  columnIndex: number;
  cardId: string;
  registerScroll: ScrollRegistrar;
  getScrollContainers: () => HTMLElement[];
}) {
  const droppableIds = useMemo(
    () => Array.from({ length: DROPPABLES_PER_COLUMN }, (_, i) => `${columnIndex}-${i}`),
    [columnIndex],
  );

  return (
    <div
      className="scroll-list"
      ref={(node) => {
        registerScroll(columnIndex, node);
      }}
    >
      {droppableIds.map((droppableId, idx) => (
        <DroppableCell
          key={droppableId}
          id={droppableId}
          initialCardId={idx === 0 ? cardId : undefined}
        >
          {idx === 0 && <Card id={cardId} getScrollContainers={getScrollContainers} />}
        </DroppableCell>
      ))}
    </div>
  );
}

function AdvancedDnDExample() {
  const scrollContainersRef = useRef<(HTMLElement | null)[]>(Array(COLUMNS.length).fill(null));
  const bestMatchMap = useRef(new Map<AnyDraggable, DroppableInstance>());

  const registerScroll = useCallback<ScrollRegistrar>((index, element) => {
    scrollContainersRef.current[index] = element;
  }, []);

  const getScrollContainers = useCallback(
    () => scrollContainersRef.current.filter(Boolean) as HTMLElement[],
    [],
  );

  useDndContextEvents({
    collide: ({ draggable, contacts }) => {
      const draggableElement = draggable.drag?.items[0].element as HTMLElement | undefined;
      if (!draggableElement) return;
      const draggableId = draggableElement.getAttribute('data-id');
      if (!draggableId) return;

      let nextBest: DroppableInstance | null = null;
      for (const droppable of contacts) {
        const contained = droppable.element.getAttribute('data-draggable-contained');
        if (contained && contained !== draggableId) continue;
        const over = droppable.element.getAttribute('data-draggable-over');
        if (over && over !== draggableId) continue;
        nextBest = droppable;
        break;
      }

      const currentBest = bestMatchMap.current.get(draggable);
      if (nextBest && nextBest !== currentBest) {
        currentBest?.element.removeAttribute('data-draggable-over');
        nextBest.element.setAttribute('data-draggable-over', draggableId);
        bestMatchMap.current.set(draggable, nextBest);
      }
    },
    end: ({ draggable, canceled }) => {
      const draggableElement = draggable.drag?.items[0].element as HTMLElement | undefined;
      if (!draggableElement) return;
      const bestMatch = bestMatchMap.current.get(draggable) || null;
      const originalContainer = draggableElement.parentElement as HTMLElement | null;
      const targetContainer =
        !canceled && bestMatch ? (bestMatch.element as HTMLElement) : originalContainer;

      if (originalContainer && targetContainer && originalContainer !== targetContainer) {
        const offset = getOffset(originalContainer, targetContainer);
        const transformString = `translate(${offset.left}px, ${offset.top}px) ${draggableElement.style.transform}`;
        draggableElement.style.transform = transformString;
        targetContainer.appendChild(draggableElement);
        originalContainer.removeAttribute('data-draggable-contained');
        targetContainer.setAttribute(
          'data-draggable-contained',
          draggableElement.getAttribute('data-id') || '',
        );
      }

      const matrix = new DOMMatrix().setMatrixValue(
        draggableElement.style.transform || 'matrix(1, 0, 0, 1, 0, 0)',
      );
      if (!matrix.isIdentity) {
        draggableElement.classList.add('animate');
        const onTransitionEnd = (event: TransitionEvent) => {
          if (event.target === draggableElement && event.propertyName === 'transform') {
            draggableElement.classList.remove('animate');
            document.body.removeEventListener('transitionend', onTransitionEnd);
          }
        };
        document.body.addEventListener('transitionend', onTransitionEnd);
        draggableElement.clientHeight;
        draggableElement.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
      }

      bestMatch?.element.removeAttribute('data-draggable-over');
      bestMatchMap.current.delete(draggable);
    },
  });

  return (
    <DndContextProvider
      options={{
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx as any) as any,
      }}
    >
      <div className="container">
        {COLUMNS.map((column, index) => (
          <ScrollColumn
            key={column.id}
            columnIndex={index}
            cardId={column.cardId}
            registerScroll={registerScroll}
            getScrollContainers={getScrollContainers}
          />
        ))}
      </div>
    </DndContextProvider>
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AdvancedDnDExample />
    </StrictMode>,
  );
}
