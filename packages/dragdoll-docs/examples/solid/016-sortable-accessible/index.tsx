/** @jsxImportSource solid-js */

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
} from 'dragdoll-solid';
import { createEffect, createSignal, For, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';

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

// ---------
// Utilities
// ---------

function isAboveThreshold(x: number, y: number, sx: number, sy: number, thSq: number): boolean {
  const dx = x - sx;
  const dy = y - sy;
  return dx * dx + dy * dy >= thSq;
}

const detector = (ctx: DndObserver<AdvancedCollisionData>) => new AdvancedCollisionDetector(ctx);

// ---
// App
// ---

function App() {
  // ---------
  // DOM refs
  // ---------

  let listEl: HTMLUListElement | null = null;
  let liveRegion: HTMLDivElement | null = null;
  const dragContainer = document.getElementById('drag-container') as HTMLElement;
  const itemElements = new Map<string, HTMLLIElement>();
  const itemsByElement = new Map<HTMLLIElement, ItemData>();

  // -----
  // State
  // -----

  const [items, setItems] = createSignal<ItemData[]>(
    Array.from({ length: ITEM_COUNT }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      domIndex: i,
    })),
  );

  let itemHeight = 0;
  let itemStride = 0;
  let listOffsetTop = 0;
  let virtualOrder: number[] | null = null;
  let virtualIndexOf: number[] | null = null;
  let cachedListRect: DOMRect | null = null;
  let lastSwapFromIdx = -1;

  const [pointerDrag, setPointerDrag] = createSignal<PointerDragState | null>(null);
  const [a11yDrag, setA11yDrag] = createSignal<A11yDragState | null>(null);
  const [draggingId, setDraggingId] = createSignal<string | null>(null);

  // -----------
  // Measurement
  // -----------

  function measure() {
    const its = items();
    if (its.length < 2) return;
    const el0 = itemElements.get(its[0].id);
    const el1 = itemElements.get(its[1].id);
    if (!el0 || !el1 || !listEl) return;
    const r0 = el0.getBoundingClientRect();
    const r1 = el1.getBoundingClientRect();
    itemHeight = r0.height;
    itemStride = r1.top - r0.top;
    listOffsetTop = r0.top - listEl.getBoundingClientRect().top;
  }

  function invalidateCache() {
    cachedListRect = null;
  }

  function getListRect(): DOMRect {
    return (cachedListRect ??= listEl!.getBoundingClientRect());
  }

  // --------------
  // Virtual layout
  // --------------

  function initVirtual() {
    measure();
    const its = items();
    virtualOrder = its.map((_, i) => i);
    virtualIndexOf = its.map((_, i) => i);
  }

  function vIdx(domIndex: number): number {
    return virtualIndexOf ? virtualIndexOf[domIndex] : domIndex;
  }

  function vSwap(from: number, to: number, animate = true) {
    if (!virtualOrder || !virtualIndexOf || from === to) return;

    const lo = Math.min(from, to);
    const hi = Math.max(from, to);

    const [moved] = virtualOrder.splice(from, 1);
    virtualOrder.splice(to, 0, moved);

    for (let i = lo; i <= hi; i++) {
      virtualIndexOf[virtualOrder[i]] = i;
    }

    const its = items();
    for (let i = lo; i <= hi; i++) {
      const di = virtualOrder[i];
      const el = itemElements.get(its[di].id);
      if (!el) continue;

      const newY = (i - di) * itemStride;
      const prev = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
      if (prev === newY) continue;

      el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

      if (animate) {
        const a = el.getAnimations();
        for (let j = 0; j < a.length; j++) a[j].cancel();
        el.animate(
          [
            { transform: `translateY(${prev}px)` },
            {
              transform: newY === 0 ? 'translateY(0px)' : `translateY(${newY}px)`,
            },
          ],
          { duration: SWAP_ANIM_DURATION, easing: 'ease' },
        );
      }
    }
  }

  function commitOrder() {
    if (!virtualOrder) return;

    const its = items();
    const next = virtualOrder.map((di) => ({
      ...its[di],
      domIndex: 0,
    }));
    for (let i = 0; i < next.length; i++) {
      next[i].domIndex = i;
    }

    virtualOrder = null;
    virtualIndexOf = null;
    clearTransforms();
    setItems(next);

    // Rebuild the element→item map after reorder.
    itemsByElement.clear();
    for (const it of next) {
      const el = itemElements.get(it.id);
      if (el) itemsByElement.set(el, it);
    }
  }

  function clearTransforms() {
    for (const el of itemElements.values()) {
      const a = el.getAnimations();
      for (let i = 0; i < a.length; i++) a[i].cancel();
      el.style.transform = '';
    }
  }

  function animToZero(dur: number) {
    for (const el of itemElements.values()) {
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

  function announce(msg: string) {
    if (liveRegion) liveRegion.textContent = msg;
  }

  // Measure after first render.
  createEffect(() => {
    items();
    measure();
    clearTransforms();
  });

  // -----------
  // DndObserver
  // -----------

  const observer = useDndObserver<AdvancedCollisionData>({
    collisionDetector: detector,
    onCollide: ({ collisions }) => {
      const d = pointerDrag();
      if (!d || !virtualOrder || !virtualIndexOf) return;

      const obs = obsRef;
      const its = items();
      const draggedItem = its.find((it) => it.id === d.itemId);
      if (!draggedItem) return;

      for (const c of collisions) {
        if (c.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;

        const drop = obs?.droppables.get(c.droppableId);
        if (!drop) continue;

        const tid = (drop as Droppable).data.itemId as string;
        if (tid === d.itemId) continue;

        const target = its.find((it) => it.id === tid);
        if (!target) continue;

        const cur = vIdx(draggedItem.domIndex);
        const tgt = vIdx(target.domIndex);
        if (cur === tgt || tgt === lastSwapFromIdx) continue;

        lastSwapFromIdx = cur;
        vSwap(cur, tgt);
        invalidateCache();
        obs?.updateDroppableClientRects();
        break;
      }
    },
  });

  let obsRef: DndObserver<AdvancedCollisionData> | null = null;
  createEffect(() => {
    obsRef = observer();
  });

  // Track drag start/end for placeholder styling.
  createEffect(() => {
    const obs = observer();
    if (!obs) return;
    const sId = obs.on('start', () => {
      const d = pointerDrag();
      if (d) setDraggingId(d.itemId);
    });
    const eId = obs.on('end', () => setDraggingId(null));
    onCleanup(() => {
      obs.off('start', sId);
      obs.off('end', eId);
    });
  });

  // ----------------
  // Keyboard reorder
  // ----------------

  function a11yStart(itemId: string) {
    const its = items();
    const item = its.find((it) => it.id === itemId);
    if (!item) return;

    initVirtual();

    setA11yDrag({
      itemId,
      originalIndex: item.domIndex,
      currentIndex: item.domIndex,
    });

    const el = itemElements.get(itemId);
    if (el) el.scrollIntoView({ block: 'nearest' });

    announce(
      `Picked up ${item.label}. Position ` +
        `${item.domIndex + 1} of ${its.length}. ` +
        `Use arrow keys to move, Space or Enter ` +
        `to drop, Escape to cancel.`,
    );
  }

  function a11yMove(dir: -1 | 1) {
    const d = a11yDrag();
    if (!d || !virtualOrder) return;

    const ni = d.currentIndex + dir;
    if (ni < 0 || ni >= virtualOrder.length) return;

    vSwap(d.currentIndex, ni, false);
    setA11yDrag({ ...d, currentIndex: ni });

    const fr = listEl!.getBoundingClientRect();
    const gap = itemStride - itemHeight;
    const top = fr.top + listOffsetTop + ni * itemStride;
    const bot = top + itemHeight;
    if (top - gap < 0) {
      window.scrollBy(0, top - gap);
    } else if (bot + gap > window.innerHeight) {
      window.scrollBy(0, bot + gap - window.innerHeight);
    }

    const its = items();
    const item = its.find((it) => it.id === d.itemId);
    announce(`${item?.label || ''}, position ` + `${ni + 1} of ${virtualOrder.length}.`);
  }

  function a11yEnd(cancel: boolean) {
    const d = a11yDrag();
    if (!d) return;

    setA11yDrag(null);

    const its = items();
    const item = its.find((it) => it.id === d.itemId);

    if (cancel) {
      animToZero(CANCEL_ANIM_DURATION);
      virtualOrder = null;
      virtualIndexOf = null;
    } else {
      commitOrder();
    }

    announce(
      cancel
        ? `${item?.label || ''} reorder cancelled. ` +
            `Returned to position ` +
            `${d.originalIndex + 1}.`
        : `${item?.label || ''} dropped at position ` + `${d.currentIndex + 1} of ${its.length}.`,
    );

    const el = itemElements.get(d.itemId);
    el?.querySelector('a')?.focus({ preventScroll: true });
  }

  // ----------------
  // Keyboard handler
  // ----------------

  createEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (a11yDrag()) {
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
        const item = li && itemsByElement.get(li);
        if (item) {
          e.preventDefault();
          a11yStart(item.id);
        }
      }
    };

    document.addEventListener('keydown', onKey);
    onCleanup(() => document.removeEventListener('keydown', onKey));
  });

  // ------------
  // SortableItem
  // ------------

  function SortableItem(props: { item: ItemData }) {
    let liRef: HTMLLIElement | null = null;

    // Register element in shared maps.
    createEffect(() => {
      const li = liRef;
      if (li) {
        itemElements.set(props.item.id, li);
        itemsByElement.set(li, props.item);
      }
      onCleanup(() => {
        itemElements.delete(props.item.id);
        if (li) itemsByElement.delete(li);
      });
    });

    const [sensor, setSensorRef] = usePointerSensor();

    // Droppable — rect computed arithmetically.
    const [, setDropRef] = useDroppable({
      data: { itemId: props.item.id },
      computeClientRect: () => {
        if (!listEl || !itemStride) {
          return { x: 0, y: 0, width: 0, height: 0 };
        }
        const idx = vIdx(props.item.domIndex);
        const r = getListRect();
        return {
          x: r.left,
          y: r.top + listOffsetTop + idx * itemStride,
          width: r.width,
          height: itemHeight,
        };
      },
    });

    function onScroll() {
      invalidateCache();
      obsRef?.updateDroppableClientRects();
    }

    // Draggable with drag preview.
    const draggable = useDraggableAutoScroll(
      useDraggable([sensor], {
        elements: () => {
          const li = liRef;
          if (!li) return [];

          // Runs before DndObserver reads rects.
          initVirtual();
          invalidateCache();

          return [li];
        },
        dragPreview: true,
        dragPreviewContainer: dragContainer,
        dragPreviewExitTimeout: DRAG_PREVIEW_EXIT_TIMEOUT,
        startPredicate: ({
          event,
        }: {
          event: {
            x: number;
            y: number;
            startX: number;
            startY: number;
          };
        }) => {
          if (a11yDrag()) return false;
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
          liRef?.classList.add('placeholder');
          lastSwapFromIdx = -1;
          setPointerDrag({
            itemId: props.item.id,
            originalIndex: props.item.domIndex,
            cancelled: false,
          });
          listEl?.classList.add('is-dragging');
          window.addEventListener('scroll', onScroll);
        },
        onMove: () => {
          lastSwapFromIdx = -1;
        },
        onEnd: ({ endEvent }: { endEvent?: { type: string } | null }) => {
          window.removeEventListener('scroll', onScroll);
          const d = pointerDrag();
          if (!d) return;

          const cancelled = endEvent?.type === 'cancel';
          setPointerDrag({ ...d, cancelled });

          if (cancelled) {
            animToZero(CANCEL_ANIM_DURATION);
            virtualOrder = null;
            virtualIndexOf = null;
          }

          listEl?.classList.remove('is-dragging');
        },
      }),
      {
        targets: [
          {
            element: window,
            axis: 'y' as const,
            padding: { top: Infinity, bottom: Infinity },
          },
        ],
      },
    );

    const cn = () =>
      'sortable-item' +
      (draggingId() === props.item.id ? ' placeholder' : '') +
      (a11yDrag()?.itemId === props.item.id ? ' a11y-dragging' : '');

    return (
      <>
        <li
          ref={(n) => {
            liRef = n;
            setDropRef(n);
          }}
          class={cn()}
        >
          <a
            ref={(n) => setSensorRef(n)}
            href="https://muuri.dev"
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            aria-roledescription="sortable item"
            aria-describedby="dnd-instructions"
          >
            {props.item.label}
          </a>
        </li>
        <DragPreview draggable={draggable}>
          {({ sourceElement, exiting, done }) => {
            let contentEl: HTMLDivElement | null = null;

            // Run exit animation after the content div
            // is inserted into the proxy by DragPreview.
            if (exiting) {
              queueMicrotask(() => {
                if (!contentEl) {
                  done();
                  return;
                }

                // The proxy is the parent of our content
                // (DragPreview uses insert(), no wrapper).
                const proxy = contentEl.parentElement as HTMLElement;
                const source = sourceElement as HTMLElement;
                const d = pointerDrag();
                const li = liRef;

                // Finish swap animations on the source.
                if (li) {
                  const a = li.getAnimations();
                  for (let i = 0; i < a.length; i++) a[i].finish();
                }

                const pR = proxy.getBoundingClientRect();
                const tR = source.getBoundingClientRect();
                const dx = tR.left - pR.left;
                const dy = tR.top - pR.top;

                const dur = d?.cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;

                const cleanup = () => {
                  if (li) li.classList.remove('placeholder');
                  if (!d?.cancelled) commitOrder();
                  setPointerDrag(null);
                  done();
                };

                if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                  cleanup();
                  return;
                }

                const anim = proxy.animate(
                  [{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }],
                  {
                    duration: dur,
                    easing: 'ease',
                    fill: 'forwards',
                    composite: 'add',
                  },
                );
                anim.onfinish = cleanup;
              });
            }

            return (
              <div
                ref={(el) => (contentEl = el)}
                class="sortable-item drag-preview"
                aria-hidden="true"
              >
                <a>{props.item.label}</a>
              </div>
            );
          }}
        </DragPreview>
      </>
    );
  }

  // ----------
  // Render
  // ----------

  return (
    <DndObserverContext.Provider value={observer}>
      <div id="dnd-instructions" class="sr-only">
        Press Shift plus Space or Shift plus Enter to reorder. Use arrow keys to move. Press Space
        or Enter to drop, or Escape to cancel.
      </div>
      <div
        id="dnd-live-region"
        ref={(el) => (liveRegion = el)}
        class="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
      <ul id="sortable-list" ref={(el) => (listEl = el)} role="list" aria-label="Sortable items">
        <For each={items()}>{(item) => <SortableItem item={item} />}</For>
      </ul>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find root.');

render(() => <App />, root);
