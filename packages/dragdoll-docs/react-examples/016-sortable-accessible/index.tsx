// Sortable list with two interaction modes:
//
// 1. POINTER DRAG — drag items via mouse/touch. A DragPreview proxy follows
//    the pointer while the original element stays in-flow as a translucent
//    placeholder. DndObserver detects collisions between the preview and
//    other items to trigger reorder.
//
// 2. KEYBOARD REORDER — Shift+Space/Enter to pick up, arrow keys to
//    move one position at a time, Space/Enter to drop, Escape to cancel.
//
// During either interaction, items are repositioned using CSS transforms
// (DOM order stays fixed). The final DOM reorder + state commit only
// happens on drop or cancel.

import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  DndObserver,
  DraggableModifier,
  Droppable,
  PointerSensor,
  startOffsetModifier,
} from 'dragdoll';
import {
  DndObserverContext,
  DragPreview,
  useDndObserver,
  useDraggable,
  useDraggableAutoScroll,
  useDroppable,
  usePointerSensor,
} from 'dragdoll-react';
import {
  memo,
  StrictMode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';

//
// Constants
//

const ITEM_COUNT = 100;
const POINTER_START_THRESHOLD_SQ = 8 * 8;
const SWAP_ANIM_DURATION = 150;
const DROP_ANIM_DURATION = 150;
const CANCEL_ANIM_DURATION = 200;
const SWAP_OVERLAP_THRESHOLD = 51;
const DRAG_PREVIEW_EXIT_TIMEOUT = CANCEL_ANIM_DURATION + 50;

//
// Types
//

interface ItemData {
  id: string;
  label: string;
}

interface PointerDragState {
  itemId: string;
  originalIndex: number;
  cancelled: boolean;
}

interface A11yDragState {
  itemId: string;
  originalIndex: number;
  currentIndex: number;
}

//
// Pure helpers
//

function isPointerDistanceAboveThreshold(
  x: number,
  y: number,
  startX: number,
  startY: number,
  thresholdSq: number,
): boolean {
  const dx = x - startX;
  const dy = y - startY;
  return dx * dx + dy * dy >= thresholdSq;
}

function announce(liveRegion: HTMLElement | null, message: string) {
  if (liveRegion) liveRegion.textContent = message;
}

//
// Virtual layout helpers
//
// Items stay in their original DOM positions during drag. Visual reordering
// is done with translateY transforms based on the difference between each
// item's DOM index and its virtual (logical) index.
//

function applyVirtualTransforms(
  itemElements: Map<string, HTMLLIElement>,
  domOrder: ItemData[],
  virtualOrder: string[],
  itemStride: number,
  affectedIds: string[],
  animate: boolean,
) {
  for (const id of affectedIds) {
    const el = itemElements.get(id);
    if (!el) continue;

    const domIdx = domOrder.findIndex((it) => it.id === id);
    const virtualIdx = virtualOrder.indexOf(id);
    const newY = (virtualIdx - domIdx) * itemStride;

    // Read the current translateY from the inline style.
    const prevY = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
    if (prevY === newY) continue;

    // Set the final transform immediately.
    el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

    if (animate) {
      // Cancel running swap animations so we start from a clean state.
      const anims = el.getAnimations();
      for (let i = 0; i < anims.length; i++) anims[i].cancel();

      // Animate from old position to new position.
      el.animate(
        [
          { transform: `translateY(${prevY}px)` },
          { transform: newY === 0 ? 'translateY(0px)' : `translateY(${newY}px)` },
        ],
        { duration: SWAP_ANIM_DURATION, easing: 'ease' },
      );
    }
  }
}

function clearAllTransforms(itemElements: Map<string, HTMLLIElement>) {
  for (const el of itemElements.values()) {
    const anims = el.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].cancel();
    el.style.transform = '';
  }
}

function animateTransformsToZero(itemElements: Map<string, HTMLLIElement>, duration: number) {
  for (const el of itemElements.values()) {
    const currentTransform = el.style.transform;
    if (!currentTransform || currentTransform === 'translateY(0px)') continue;

    const anims = el.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].cancel();

    el.style.transform = '';
    el.animate([{ transform: currentTransform }, { transform: 'translateY(0px)' }], {
      duration,
      easing: 'ease',
    });
  }
}

//
// Collision detector factory
//

const collisionDetector = (ctx: DndObserver<AdvancedCollisionData>) =>
  new AdvancedCollisionDetector(ctx);

//
// SortablePreview — renders inside DragPreview proxy and handles exit animation
//

function SortablePreview({
  label,
  sourceElement,
  exiting,
  done,
  pointerDragRef,
  onPointerDropRef,
}: {
  label: string;
  sourceElement: HTMLElement | SVGSVGElement;
  exiting: boolean;
  done: () => void;
  pointerDragRef: React.RefObject<PointerDragState | null>;
  onPointerDropRef: React.RefObject<() => void>;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!exiting || !contentRef.current) return;

    const proxy = contentRef.current.parentElement as HTMLElement;
    const source = sourceElement as HTMLElement;
    const drag = pointerDragRef.current;

    // Finish any running swap animations on the source so we read its
    // final visual position (including virtual transform).
    const anims = source.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].finish();

    const proxyRect = proxy.getBoundingClientRect();
    const sourceRect = source.getBoundingClientRect();
    const dx = sourceRect.left - proxyRect.left;
    const dy = sourceRect.top - proxyRect.top;

    const duration = drag?.cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;

    const cleanup = () => {
      source.classList.remove('placeholder');
      // On successful drop, commit the virtual order to React state.
      if (!drag?.cancelled) {
        onPointerDropRef.current();
      }
      pointerDragRef.current = null;
      done();
    };

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      cleanup();
      return;
    }

    const anim = proxy.animate([{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }], {
      duration,
      easing: 'ease',
      fill: 'forwards',
      composite: 'add',
    });
    anim.onfinish = cleanup;
  }, [exiting, sourceElement, done, pointerDragRef, onPointerDropRef]);

  return (
    <div ref={contentRef} className="sortable-item drag-preview" aria-hidden="true">
      <a>{label}</a>
    </div>
  );
}

//
// SortableItem component
//

const SortableItem = memo(function SortableItem({
  item,
  isDragging,
  isA11yDragging,
  pointerDragRef,
  lastSwapFromIdxRef,
  a11yDragRef,
  listElRef,
  itemElementsRef,
  itemsRef,
  virtualOrderRef,
  dndObserverRef,
  itemStrideRef,
  onPointerDropRef,
}: {
  item: ItemData;
  isDragging: boolean;
  isA11yDragging: boolean;
  pointerDragRef: React.RefObject<PointerDragState | null>;
  lastSwapFromIdxRef: React.RefObject<number>;
  a11yDragRef: React.RefObject<A11yDragState | null>;
  listElRef: React.RefObject<HTMLUListElement | null>;
  itemElementsRef: React.RefObject<Map<string, HTMLLIElement>>;
  itemsRef: React.RefObject<ItemData[]>;
  virtualOrderRef: React.RefObject<string[] | null>;
  dndObserverRef: React.RefObject<DndObserver<AdvancedCollisionData> | null>;
  itemStrideRef: React.RefObject<number>;
  onPointerDropRef: React.RefObject<() => void>;
}) {
  const liRef = useRef<HTMLLIElement>(null);
  const linkRef = useRef<HTMLAnchorElement>(null);

  // Register/unregister element in the shared map.
  useEffect(() => {
    const li = liRef.current;
    if (li) itemElementsRef.current.set(item.id, li);
    return () => {
      itemElementsRef.current.delete(item.id);
    };
  }, [item.id, itemElementsRef]);

  // Pointer sensor on the link element.
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const setLinkRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      linkRef.current = node;
      setPointerSensorRef(node);
    },
    [setPointerSensorRef],
  );

  // Droppable — each item is a drop target for collision detection.
  // The rect is computed arithmetically from index. During drag, the
  // virtual order is used so rects match the visual (transformed) positions.
  const droppableSettings = useMemo(
    () => ({
      data: { itemId: item.id },
      computeClientRect: () => {
        const items = itemsRef.current;
        const listEl = listElRef.current;
        const itemStride = itemStrideRef.current;
        if (!listEl || !items.length || !itemStride) {
          return { x: 0, y: 0, width: 0, height: 0 };
        }

        // Use virtual order during drag, fall back to DOM order.
        const order = virtualOrderRef.current;
        const idx = order ? order.indexOf(item.id) : items.findIndex((it) => it.id === item.id);

        if (idx < 0) return { x: 0, y: 0, width: 0, height: 0 };
        const listRect = listEl.getBoundingClientRect();
        const el = itemElementsRef.current.get(item.id);
        const height = el ? el.getBoundingClientRect().height : itemStride;
        return {
          x: listRect.left,
          y: listRect.top + idx * itemStride,
          width: listRect.width,
          height,
        };
      },
    }),
    [item.id, itemsRef, listElRef, itemStrideRef, itemElementsRef, virtualOrderRef],
  );

  const [, setDroppableRef] = useDroppable(droppableSettings);

  const setLiRef = useCallback(
    (node: HTMLLIElement | null) => {
      liRef.current = node;
      setDroppableRef(node);
    },
    [setDroppableRef],
  );

  function onScrollDuringDrag() {
    dndObserverRef.current?.updateDroppableClientRects();
  }

  // Draggable settings — uses DragPreview for the pointer-following proxy.
  const draggableSettings = useMemo(
    () => ({
      elements: () => {
        const li = liRef.current;
        return li ? [li] : [];
      },
      dragPreview: true,
      dragPreviewExitTimeout: DRAG_PREVIEW_EXIT_TIMEOUT,
      startPredicate: ({
        event,
      }: {
        event: { x: number; y: number; startX: number; startY: number };
      }) => {
        if (a11yDragRef.current) return false;
        return isPointerDistanceAboveThreshold(
          event.x,
          event.y,
          event.startX,
          event.startY,
          POINTER_START_THRESHOLD_SQ,
        )
          ? true
          : undefined;
      },
      positionModifiers: [
        startOffsetModifier as unknown as DraggableModifier<PointerSensor>,
        (change) => {
          change.x = 0;
          return change;
        },
      ],
      computeClientRect: ({
        drag,
      }: {
        drag: { items: { element: HTMLElement | SVGSVGElement }[] };
      }) => {
        const el = drag.items[0]?.element;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      },
      onStart: () => {
        const li = liRef.current;
        if (!li) return;

        // Initialize virtual order from the current React state.
        virtualOrderRef.current = itemsRef.current.map((it) => it.id);

        li.classList.add('placeholder');
        lastSwapFromIdxRef.current = -1;
        pointerDragRef.current = {
          itemId: item.id,
          originalIndex: itemsRef.current.findIndex((it) => it.id === item.id),
          cancelled: false,
        };
        listElRef.current?.classList.add('is-dragging');
        window.addEventListener('scroll', onScrollDuringDrag);
      },
      onMove: () => {
        lastSwapFromIdxRef.current = -1;
      },
      onEnd: ({ endEvent }: { endEvent?: { type: string } | null }) => {
        window.removeEventListener('scroll', onScrollDuringDrag);

        const drag = pointerDragRef.current;
        if (!drag) return;

        const cancelled = endEvent?.type === 'cancel';
        drag.cancelled = cancelled;

        if (cancelled) {
          // Animate all items back to their DOM positions.
          animateTransformsToZero(itemElementsRef.current, CANCEL_ANIM_DURATION);
          virtualOrderRef.current = null;
        }
        // On drop, the commit happens after the exit animation
        // (in SortablePreview cleanup via onPointerDropRef).

        listElRef.current?.classList.remove('is-dragging');
      },
    }),
    [item.id],
  );

  const autoScrollSettings = useMemo(
    () => ({
      targets: [
        {
          element: window,
          axis: 'y' as const,
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    }),
    [],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor], draggableSettings),
    autoScrollSettings,
  );

  const className = `sortable-item${isDragging ? ' placeholder' : ''}${isA11yDragging ? ' a11y-dragging' : ''}`;

  return (
    <>
      <li ref={setLiRef} className={className}>
        <a
          ref={setLinkRef}
          href="https://muuri.dev"
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          aria-roledescription="sortable item"
          aria-describedby="dnd-instructions"
        >
          {item.label}
        </a>
      </li>
      <DragPreview draggable={draggable}>
        {({ sourceElement, exiting, done }) => (
          <SortablePreview
            label={item.label}
            sourceElement={sourceElement}
            exiting={exiting}
            done={done}
            pointerDragRef={pointerDragRef}
            onPointerDropRef={onPointerDropRef}
          />
        )}
      </DragPreview>
    </>
  );
});

//
// App component
//

function App() {
  // Item order state — React is the source of truth.
  const [items, setItems] = useState<ItemData[]>(() =>
    Array.from({ length: ITEM_COUNT }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
    })),
  );

  // Refs for imperative access (needed by drag callbacks).
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const listElRef = useRef<HTMLUListElement>(null);
  const liveRegionRef = useRef<HTMLDivElement>(null);
  const itemElementsRef = useRef<Map<string, HTMLLIElement>>(new Map());
  const itemStrideRef = useRef(0);

  // Virtual order — the logical item order during drag. null when idle.
  // DOM order stays fixed; items are visually repositioned with transforms.
  const virtualOrderRef = useRef<string[] | null>(null);

  // Pointer drag state (imperative — not React state, too hot-path).
  const pointerDragRef = useRef<PointerDragState | null>(null);
  const lastSwapFromIdxRef = useRef(-1);
  const swapCooldownRef = useRef(false);

  // Keyboard reorder state.
  const [a11yDrag, setA11yDrag] = useState<A11yDragState | null>(null);
  const a11yDragRef = useRef(a11yDrag);
  a11yDragRef.current = a11yDrag;

  // Track which item is being pointer-dragged (for placeholder class).
  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Measure item dimensions after first render.
  useEffect(() => {
    const elements = itemElementsRef.current;
    if (elements.size < 2) return;
    const ids = Array.from(elements.keys());
    const el0 = elements.get(ids[0]);
    const el1 = elements.get(ids[1]);
    if (el0 && el1) {
      itemStrideRef.current = el1.getBoundingClientRect().top - el0.getBoundingClientRect().top;
    }
  }, [items]);

  // After a state commit (drop), clear all inline transforms before paint.
  useLayoutEffect(() => {
    clearAllTransforms(itemElementsRef.current);
  }, [items]);

  // Swap two items in the virtual order and animate the affected items.
  const virtualSwap = useCallback((fromIndex: number, toIndex: number) => {
    const order = virtualOrderRef.current;
    if (!order || fromIndex === toIndex) return;

    const lo = Math.min(fromIndex, toIndex);
    const hi = Math.max(fromIndex, toIndex);
    const affectedIds = order.slice(lo, hi + 1);

    // Mutate virtual order.
    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);

    // Prevent rapid cascading swaps — wait for the animation to settle.
    swapCooldownRef.current = true;
    setTimeout(() => {
      swapCooldownRef.current = false;
    }, SWAP_ANIM_DURATION);

    // Animate affected items to their new visual positions.
    applyVirtualTransforms(
      itemElementsRef.current,
      itemsRef.current,
      order,
      itemStrideRef.current,
      affectedIds,
      true,
    );
  }, []);

  // Commit the virtual order to React state (called on drop).
  const commitOrder = useCallback(() => {
    const order = virtualOrderRef.current;
    if (!order) return;
    virtualOrderRef.current = null;
    setItems((prev) => order.map((id) => prev.find((it) => it.id === id)!));
  }, []);

  // Ref for SortablePreview to call on pointer drop completion.
  const onPointerDropRef = useRef(commitOrder);
  onPointerDropRef.current = commitOrder;

  // DndObserver ref for imperative access.
  const dndObserverRef = useRef<DndObserver<AdvancedCollisionData> | null>(null);

  // DndObserver with collision-based reorder.
  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ collisions }) => {
      const drag = pointerDragRef.current;
      const order = virtualOrderRef.current;
      if (!drag || !order || swapCooldownRef.current) return;

      const observer = dndObserverRef.current;

      for (const collision of collisions) {
        if (collision.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;
        const targetDroppable = observer?.droppables.get(collision.droppableId);
        if (!targetDroppable) continue;
        const targetItemId = (targetDroppable as Droppable).data.itemId as string;
        if (targetItemId === drag.itemId) continue;

        const currentIdx = order.indexOf(drag.itemId);
        const targetIdx = order.indexOf(targetItemId);
        if (currentIdx === targetIdx || targetIdx === lastSwapFromIdxRef.current) continue;

        lastSwapFromIdxRef.current = currentIdx;
        virtualSwap(currentIdx, targetIdx);
        observer?.updateDroppableClientRects();
        break;
      }
    },
  });

  dndObserverRef.current = dndObserver;

  // Track pointer drag start/end for placeholder styling.
  useEffect(() => {
    if (!dndObserver) return;
    const startId = dndObserver.on('start', () => {
      const drag = pointerDragRef.current;
      if (drag) setDraggingId(drag.itemId);
    });
    const endId = dndObserver.on('end', () => {
      setDraggingId(null);
    });
    return () => {
      dndObserver.off('start', startId);
      dndObserver.off('end', endId);
    };
  }, [dndObserver]);

  //
  // Keyboard reorder
  //

  const a11yStart = useCallback((itemId: string) => {
    const items = itemsRef.current;
    const index = items.findIndex((it) => it.id === itemId);
    if (index < 0) return;
    const item = items[index];

    // Initialize virtual order.
    virtualOrderRef.current = items.map((it) => it.id);

    setA11yDrag({ itemId, originalIndex: index, currentIndex: index });
    announce(
      liveRegionRef.current,
      `Picked up ${item.label}. Position ${index + 1} of ${items.length}. ` +
        `Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
    );
  }, []);

  const a11yMove = useCallback(
    (direction: -1 | 1) => {
      const drag = a11yDragRef.current;
      const order = virtualOrderRef.current;
      if (!drag || !order) return;

      const newIndex = drag.currentIndex + direction;
      if (newIndex < 0 || newIndex >= order.length) return;

      virtualSwap(drag.currentIndex, newIndex);

      const updatedDrag = { ...drag, currentIndex: newIndex };
      setA11yDrag(updatedDrag);
      a11yDragRef.current = updatedDrag;

      // Scroll the item into view after the transform animation.
      requestAnimationFrame(() => {
        const el = itemElementsRef.current.get(drag.itemId);
        if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      });

      const item = itemsRef.current.find((it) => it.id === drag.itemId);
      announce(
        liveRegionRef.current,
        `${item?.label || ''}, position ${newIndex + 1} of ${order.length}.`,
      );
    },
    [virtualSwap],
  );

  const a11yEnd = useCallback(
    (cancel: boolean) => {
      const drag = a11yDragRef.current;
      if (!drag) return;

      setA11yDrag(null);
      a11yDragRef.current = null;

      const items = itemsRef.current;
      const item = items.find((it) => it.id === drag.itemId);

      if (cancel) {
        // Animate transforms back to zero (items slide to DOM positions).
        animateTransformsToZero(itemElementsRef.current, CANCEL_ANIM_DURATION);
        virtualOrderRef.current = null;
      } else {
        // Commit the virtual order to React state.
        commitOrder();
      }

      announce(
        liveRegionRef.current,
        cancel
          ? `${item?.label || ''} reorder cancelled. Returned to position ${drag.originalIndex + 1}.`
          : `${item?.label || ''} dropped at position ${drag.currentIndex + 1} of ${items.length}.`,
      );

      // Refocus the link inside the item.
      const el = itemElementsRef.current.get(drag.itemId);
      const link = el?.querySelector('a');
      link?.focus({ preventScroll: true });
    },
    [commitOrder],
  );

  // Global keyboard handler for a11y reorder.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (a11yDragRef.current) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            return a11yMove(-1);
          case 'ArrowDown':
            e.preventDefault();
            return a11yMove(1);
          case ' ':
          case 'Enter':
            e.preventDefault();
            return a11yEnd(false);
          case 'Escape':
            e.preventDefault();
            return a11yEnd(true);
        }
        return;
      }

      // Shift+Space or Shift+Enter on a sortable item starts keyboard reorder.
      if (e.shiftKey && (e.key === ' ' || e.key === 'Enter')) {
        const li = (e.target as Element).closest('.sortable-item') as HTMLLIElement | null;
        if (!li) return;
        const itemId = Array.from(itemElementsRef.current.entries()).find(
          ([, el]) => el === li,
        )?.[0];
        if (itemId) {
          e.preventDefault();
          a11yStart(itemId);
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [a11yStart, a11yMove, a11yEnd]);

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div id="dnd-instructions" className="sr-only">
        Press Shift plus Space or Shift plus Enter to reorder. Use arrow keys to move. Press Space
        or Enter to drop, or Escape to cancel.
      </div>
      <div
        id="dnd-live-region"
        ref={liveRegionRef}
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
      <ul id="sortable-list" ref={listElRef} role="list" aria-label="Sortable items">
        {items.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            isDragging={draggingId === item.id}
            isA11yDragging={a11yDrag?.itemId === item.id}
            pointerDragRef={pointerDragRef}
            lastSwapFromIdxRef={lastSwapFromIdxRef}
            a11yDragRef={a11yDragRef}
            listElRef={listElRef}
            itemElementsRef={itemElementsRef}
            itemsRef={itemsRef}
            virtualOrderRef={virtualOrderRef}
            dndObserverRef={dndObserverRef}
            itemStrideRef={itemStrideRef}
            onPointerDropRef={onPointerDropRef}
          />
        ))}
      </ul>
    </DndObserverContext.Provider>
  );
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
