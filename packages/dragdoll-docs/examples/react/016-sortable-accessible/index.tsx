// Sortable list with pointer drag and keyboard reorder.
//
// Pointer: drag items via mouse/touch. A DragPreview proxy
// follows the pointer while the original stays in-flow as a
// placeholder. DndObserver handles collision-based reorder.
//
// Keyboard: Shift+Space/Enter to pick up, arrows to move,
// Space/Enter to drop, Escape to cancel.
//
// Items are visually repositioned with CSS transforms during
// drag. DOM order only changes on drop.

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
import React, {
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

// ---------
// Constants
// ---------

const ITEM_COUNT = 100;
const POINTER_START_THRESHOLD_SQ = 8 * 8;
const SWAP_ANIM_DURATION = 150;
const DROP_ANIM_DURATION = 150;
const CANCEL_ANIM_DURATION = 200;
const SWAP_OVERLAP_THRESHOLD = 51;
const DRAG_PREVIEW_EXIT_TIMEOUT = CANCEL_ANIM_DURATION + 50;

// -----
// Types
// -----

interface ItemData {
  id: string;
  label: string;
  domIndex: number;
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

// Shared mutable state for the virtual layout system.
// Lives outside React state because it is read/written
// synchronously in hot paths (collision handler, swap).
interface Shared {
  itemHeight: number;
  itemStride: number;
  listOffsetTop: number;
  virtualOrder: number[] | null;
  virtualIndexOf: number[] | null;
  cachedListRect: DOMRect | null;
  lastSwapFromIdx: number;
}

// ---------
// Utilities
// ---------

function isAboveThreshold(x: number, y: number, sx: number, sy: number, thSq: number): boolean {
  const dx = x - sx;
  const dy = y - sy;
  return dx * dx + dy * dy >= thSq;
}

function announce(el: HTMLElement | null, msg: string) {
  if (el) el.textContent = msg;
}

// -----------
// Measurement
// -----------

function measure(
  s: Shared,
  elMap: Map<string, HTMLLIElement>,
  items: ItemData[],
  listEl: HTMLUListElement,
) {
  const el0 = elMap.get(items[0].id);
  const el1 = elMap.get(items[1].id);
  if (!el0 || !el1) return;
  const r0 = el0.getBoundingClientRect();
  const r1 = el1.getBoundingClientRect();
  s.itemHeight = r0.height;
  s.itemStride = r1.top - r0.top;
  s.listOffsetTop = r0.top - listEl.getBoundingClientRect().top;
}

function invalidateCache(s: Shared) {
  s.cachedListRect = null;
}

function listRect(s: Shared, listEl: HTMLUListElement): DOMRect {
  return (s.cachedListRect ??= listEl.getBoundingClientRect());
}

// --------------
// Virtual layout
// --------------

function initVirtual(
  s: Shared,
  elMap: Map<string, HTMLLIElement>,
  items: ItemData[],
  listEl: HTMLUListElement,
) {
  measure(s, elMap, items, listEl);
  s.virtualOrder = items.map((_, i) => i);
  s.virtualIndexOf = items.map((_, i) => i);
}

function vIdx(s: Shared, domIndex: number): number {
  return s.virtualIndexOf ? s.virtualIndexOf[domIndex] : domIndex;
}

function vSwap(
  s: Shared,
  elMap: Map<string, HTMLLIElement>,
  items: ItemData[],
  from: number,
  to: number,
  animate = true,
) {
  const vo = s.virtualOrder;
  const vi = s.virtualIndexOf;
  if (!vo || !vi || from === to) return;

  const lo = Math.min(from, to);
  const hi = Math.max(from, to);

  const [moved] = vo.splice(from, 1);
  vo.splice(to, 0, moved);

  for (let i = lo; i <= hi; i++) vi[vo[i]] = i;

  const stride = s.itemStride;
  for (let i = lo; i <= hi; i++) {
    const di = vo[i];
    const el = elMap.get(items[di].id);
    if (!el) continue;

    const newY = (i - di) * stride;
    const prev = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
    if (prev === newY) continue;

    el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

    if (animate) {
      const a = el.getAnimations();
      for (let j = 0; j < a.length; j++) a[j].cancel();
      el.animate(
        [
          { transform: `translateY(${prev}px)` },
          { transform: newY === 0 ? 'translateY(0px)' : `translateY(${newY}px)` },
        ],
        { duration: SWAP_ANIM_DURATION, easing: 'ease' },
      );
    }
  }
}

function clearTransforms(elMap: Map<string, HTMLLIElement>) {
  for (const el of elMap.values()) {
    const a = el.getAnimations();
    for (let i = 0; i < a.length; i++) a[i].cancel();
    el.style.transform = '';
  }
}

function animateToZero(elMap: Map<string, HTMLLIElement>, dur: number) {
  for (const el of elMap.values()) {
    const t = el.style.transform;
    if (!t || t === 'translateY(0px)') continue;
    const a = el.getAnimations();
    for (let i = 0; i < a.length; i++) a[i].cancel();
    el.style.transform = '';
    el.animate([{ transform: t }, { transform: 'translateY(0px)' }], {
      duration: dur,
      easing: 'ease',
    });
  }
}

// --------
// Detector
// --------

const detector = (ctx: DndObserver<AdvancedCollisionData>) => new AdvancedCollisionDetector(ctx);

// ---------------
// SortablePreview
// ---------------

// Renders inside the DragPreview proxy. On exit, animates
// the proxy back to the source element position.

function SortablePreview({
  label,
  sourceElement,
  exiting,
  done,
  dragRef,
  dropRef,
}: {
  label: string;
  sourceElement: HTMLElement | SVGSVGElement;
  exiting: boolean;
  done: () => void;
  dragRef: React.RefObject<PointerDragState | null>;
  dropRef: React.RefObject<() => void>;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!exiting || !ref.current) return;

    const proxy = ref.current.parentElement as HTMLElement;
    const source = sourceElement as HTMLElement;
    const drag = dragRef.current;

    // Finish swap animations so we read the final position.
    const a = source.getAnimations();
    for (let i = 0; i < a.length; i++) a[i].finish();

    const pR = proxy.getBoundingClientRect();
    const tR = source.getBoundingClientRect();
    const dx = tR.left - pR.left;
    const dy = tR.top - pR.top;

    const dur = drag?.cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;

    const cleanup = () => {
      source.classList.remove('placeholder');
      if (!drag?.cancelled) dropRef.current();
      dragRef.current = null;
      done();
    };

    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
      cleanup();
      return;
    }

    const anim = proxy.animate([{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }], {
      duration: dur,
      easing: 'ease',
      fill: 'forwards',
      composite: 'add',
    });
    anim.onfinish = cleanup;
  }, [exiting, sourceElement, done, dragRef, dropRef]);

  return (
    <div ref={ref} className="sortable-item drag-preview" aria-hidden="true">
      <a>{label}</a>
    </div>
  );
}

// ------------
// SortableItem
// ------------

const SortableItem = memo(function SortableItem({
  item,
  isDragging,
  isA11y,
  dragRef,
  a11yRef,
  listRef,
  elMapRef,
  itemsRef,
  shared,
  obsRef,
  dropRef,
}: {
  item: ItemData;
  isDragging: boolean;
  isA11y: boolean;
  dragRef: React.RefObject<PointerDragState | null>;
  a11yRef: React.RefObject<A11yDragState | null>;
  listRef: React.RefObject<HTMLUListElement | null>;
  elMapRef: React.RefObject<Map<string, HTMLLIElement>>;
  itemsRef: React.RefObject<ItemData[]>;
  shared: React.RefObject<Shared>;
  obsRef: React.RefObject<DndObserver<AdvancedCollisionData> | null>;
  dropRef: React.RefObject<() => void>;
}) {
  const liRef = useRef<HTMLLIElement>(null);
  const domIdxRef = useRef(item.domIndex);
  domIdxRef.current = item.domIndex;

  useEffect(() => {
    const li = liRef.current;
    if (li) elMapRef.current.set(item.id, li);
    return () => {
      elMapRef.current.delete(item.id);
    };
  }, [item.id, elMapRef]);

  const [sensor, setSensorRef] = usePointerSensor();

  const setLink = useCallback((n: HTMLAnchorElement | null) => setSensorRef(n), [setSensorRef]);

  const dropSettings = useMemo(
    () => ({
      data: { itemId: item.id },
      computeClientRect: () => {
        const s = shared.current;
        const list = listRef.current;
        if (!list || !s.itemStride) {
          return { x: 0, y: 0, width: 0, height: 0 };
        }
        const idx = vIdx(s, domIdxRef.current);
        const r = listRect(s, list);
        return {
          x: r.left,
          y: r.top + s.listOffsetTop + idx * s.itemStride,
          width: r.width,
          height: s.itemHeight,
        };
      },
    }),

    [item.id, listRef, shared],
  );

  const [, setDropRef] = useDroppable(dropSettings);

  const setLi = useCallback(
    (n: HTMLLIElement | null) => {
      liRef.current = n;
      setDropRef(n);
    },
    [setDropRef],
  );

  function onScroll() {
    invalidateCache(shared.current);
    obsRef.current?.updateDroppableClientRects();
  }

  const dragSettings = useMemo(
    () => ({
      elements: () => {
        const li = liRef.current;
        if (!li) return [];

        // Runs before DndObserver reads rects.
        const list = listRef.current;
        if (list) {
          initVirtual(shared.current, elMapRef.current, itemsRef.current, list);
          invalidateCache(shared.current);
        }

        return [li];
      },
      dragPreview: true,
      dragPreviewContainer: () => document.getElementById('drag-container') as HTMLElement,
      dragPreviewExitTimeout: DRAG_PREVIEW_EXIT_TIMEOUT,
      startPredicate: ({
        event,
      }: {
        event: { x: number; y: number; startX: number; startY: number };
      }) => {
        if (a11yRef.current) return false;
        return isAboveThreshold(
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
        ((c) => {
          c.x = 0;
          return c;
        }) as DraggableModifier<PointerSensor>,
      ],
      frozenStyles: (): ('width' | 'height')[] => ['width', 'height'],
      onStart: () => {
        liRef.current?.classList.add('placeholder');
        shared.current.lastSwapFromIdx = -1;
        dragRef.current = {
          itemId: item.id,
          originalIndex: domIdxRef.current,
          cancelled: false,
        };
        listRef.current?.classList.add('is-dragging');
        window.addEventListener('scroll', onScroll);
      },
      onMove: () => {
        shared.current.lastSwapFromIdx = -1;
      },
      onEnd: ({ endEvent }: { endEvent?: { type: string } | null }) => {
        window.removeEventListener('scroll', onScroll);
        const d = dragRef.current;
        if (!d) return;

        const cancelled = endEvent?.type === 'cancel';
        d.cancelled = cancelled;

        if (cancelled) {
          animateToZero(elMapRef.current, CANCEL_ANIM_DURATION);
          shared.current.virtualOrder = null;
          shared.current.virtualIndexOf = null;
        }

        listRef.current?.classList.remove('is-dragging');
      },
    }),

    [item.id],
  );

  const autoSettings = useMemo(
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

  const draggable = useDraggableAutoScroll(useDraggable([sensor], dragSettings), autoSettings);

  const cn =
    'sortable-item' + (isDragging ? ' placeholder' : '') + (isA11y ? ' a11y-dragging' : '');

  return (
    <>
      <li ref={setLi} className={cn}>
        <a
          ref={setLink}
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
            dragRef={dragRef}
            dropRef={dropRef}
          />
        )}
      </DragPreview>
    </>
  );
});

// ---
// App
// ---

function App() {
  const [items, setItems] = useState<ItemData[]>(() =>
    Array.from({ length: ITEM_COUNT }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      domIndex: i,
    })),
  );

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const listRef = useRef<HTMLUListElement>(null);
  const liveRef = useRef<HTMLDivElement>(null);
  const elMapRef = useRef(new Map<string, HTMLLIElement>());

  const shared = useRef<Shared>({
    itemHeight: 0,
    itemStride: 0,
    listOffsetTop: 0,
    virtualOrder: null,
    virtualIndexOf: null,
    cachedListRect: null,
    lastSwapFromIdx: -1,
  });

  const dragRef = useRef<PointerDragState | null>(null);

  const [a11yDrag, setA11yDrag] = useState<A11yDragState | null>(null);
  const a11yRef = useRef(a11yDrag);
  a11yRef.current = a11yDrag;

  const [draggingId, setDraggingId] = useState<string | null>(null);

  // Measure after first render.
  useEffect(() => {
    const list = listRef.current;
    if (list) measure(shared.current, elMapRef.current, items, list);
  }, [items]);

  // Clear transforms after state commit.
  useLayoutEffect(() => {
    clearTransforms(elMapRef.current);
  }, [items]);

  // Commit virtual order to React state.
  const commitOrder = useCallback(() => {
    const s = shared.current;
    const vo = s.virtualOrder;
    if (!vo) return;
    s.virtualOrder = null;
    s.virtualIndexOf = null;
    setItems((prev) => {
      const next = vo.map((di) => prev[di]);
      for (let i = 0; i < next.length; i++) {
        next[i] = { ...next[i], domIndex: i };
      }
      return next;
    });
  }, []);

  const dropRef = useRef(commitOrder);
  dropRef.current = commitOrder;

  const obsRef = useRef<DndObserver<AdvancedCollisionData> | null>(null);

  const observer = useDndObserver<AdvancedCollisionData>({
    collisionDetector: detector,
    onCollide: ({ collisions }) => {
      const d = dragRef.current;
      const s = shared.current;
      if (!d || !s.virtualOrder || !s.virtualIndexOf) return;

      const obs = obsRef.current;
      // Find the dragged item by id. Use itemsRef for
      // current state.
      const draggedItem = itemsRef.current.find((it) => it.id === d.itemId);
      if (!draggedItem) return;

      for (const c of collisions) {
        if (c.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;

        const drop = obs?.droppables.get(c.droppableId);
        if (!drop) continue;

        const targetItemId = (drop as Droppable).data.itemId as string;
        if (targetItemId === d.itemId) continue;

        const targetItem = itemsRef.current.find((it) => it.id === targetItemId);
        if (!targetItem) continue;
        const targetDomIdx = targetItem.domIndex;

        const cur = vIdx(s, draggedItem.domIndex);
        const tgt = vIdx(s, targetDomIdx);
        if (cur === tgt || tgt === s.lastSwapFromIdx) continue;

        s.lastSwapFromIdx = cur;
        vSwap(s, elMapRef.current, itemsRef.current, cur, tgt);
        invalidateCache(s);
        obs?.updateDroppableClientRects();
        break;
      }
    },
  });

  obsRef.current = observer;

  // Track drag start/end for placeholder class.
  useEffect(() => {
    if (!observer) return;
    const sId = observer.on('start', () => {
      if (dragRef.current) setDraggingId(dragRef.current.itemId);
    });
    const eId = observer.on('end', () => setDraggingId(null));
    return () => {
      observer.off('start', sId);
      observer.off('end', eId);
    };
  }, [observer]);

  // ----------------
  // Keyboard reorder
  // ----------------

  const a11yStart = useCallback((itemId: string) => {
    const its = itemsRef.current;
    const item = its.find((it) => it.id === itemId);
    if (!item) return;
    const list = listRef.current;
    if (!list) return;

    initVirtual(shared.current, elMapRef.current, its, list);

    setA11yDrag({
      itemId,
      originalIndex: item.domIndex,
      currentIndex: item.domIndex,
    });

    const el = elMapRef.current.get(itemId);
    if (el) el.scrollIntoView({ block: 'nearest' });

    announce(
      liveRef.current,
      `Picked up ${item.label}. Position ` +
        `${item.domIndex + 1} of ${its.length}. ` +
        `Use arrow keys to move, Space or Enter ` +
        `to drop, Escape to cancel.`,
    );
  }, []);

  const a11yMove = useCallback((dir: -1 | 1) => {
    const d = a11yRef.current;
    const s = shared.current;
    if (!d || !s.virtualOrder) return;

    const ni = d.currentIndex + dir;
    if (ni < 0 || ni >= s.virtualOrder.length) return;

    // No animation for keyboard swap.
    vSwap(s, elMapRef.current, itemsRef.current, d.currentIndex, ni, false);

    const updated = { ...d, currentIndex: ni };
    setA11yDrag(updated);
    a11yRef.current = updated;

    // Scroll using computed position.
    const fr = listRef.current!.getBoundingClientRect();
    const gap = s.itemStride - s.itemHeight;
    const top = fr.top + s.listOffsetTop + ni * s.itemStride;
    const bot = top + s.itemHeight;
    if (top - gap < 0) {
      window.scrollBy(0, top - gap);
    } else if (bot + gap > window.innerHeight) {
      window.scrollBy(0, bot + gap - window.innerHeight);
    }

    const item = itemsRef.current.find((it) => it.id === d.itemId);
    announce(
      liveRef.current,
      `${item?.label || ''}, position ` + `${ni + 1} of ${s.virtualOrder.length}.`,
    );
  }, []);

  const a11yEnd = useCallback(
    (cancel: boolean) => {
      const d = a11yRef.current;
      if (!d) return;

      setA11yDrag(null);
      a11yRef.current = null;

      const its = itemsRef.current;
      const item = its.find((it) => it.id === d.itemId);
      const s = shared.current;

      if (cancel) {
        animateToZero(elMapRef.current, CANCEL_ANIM_DURATION);
        s.virtualOrder = null;
        s.virtualIndexOf = null;
      } else {
        commitOrder();
      }

      announce(
        liveRef.current,
        cancel
          ? `${item?.label || ''} reorder cancelled. ` +
              `Returned to position ${d.originalIndex + 1}.`
          : `${item?.label || ''} dropped at position ` + `${d.currentIndex + 1} of ${its.length}.`,
      );

      const el = elMapRef.current.get(d.itemId);
      el?.querySelector('a')?.focus({ preventScroll: true });
    },
    [commitOrder],
  );

  // Global keyboard handler.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (a11yRef.current) {
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

      if (e.shiftKey && (e.key === ' ' || e.key === 'Enter')) {
        const li = (e.target as Element).closest('.sortable-item') as HTMLLIElement | null;
        if (!li) return;
        const id = Array.from(elMapRef.current.entries()).find(([, el]) => el === li)?.[0];
        if (id) {
          e.preventDefault();
          a11yStart(id);
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [a11yStart, a11yMove, a11yEnd]);

  return (
    <DndObserverContext.Provider value={observer}>
      <div id="dnd-instructions" className="sr-only">
        Press Shift plus Space or Shift plus Enter to reorder. Use arrow keys to move. Press Space
        or Enter to drop, or Escape to cancel.
      </div>
      <div
        id="dnd-live-region"
        ref={liveRef}
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
      <ul id="sortable-list" ref={listRef} role="list" aria-label="Sortable items">
        {items.map((item) => (
          <SortableItem
            key={item.id}
            item={item}
            isDragging={draggingId === item.id}
            isA11y={a11yDrag?.itemId === item.id}
            dragRef={dragRef}
            a11yRef={a11yRef}
            listRef={listRef}
            elMapRef={elMapRef}
            itemsRef={itemsRef}
            shared={shared}
            obsRef={obsRef}
            dropRef={dropRef}
          />
        ))}
      </ul>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find root element.');
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
