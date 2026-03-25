/** @jsxImportSource solid-js */

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
} from 'dragdoll-solid';
import { createEffect, createSignal, For, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';

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

    const prevY = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
    if (prevY === newY) continue;

    el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

    if (animate) {
      const anims = el.getAnimations();
      for (let i = 0; i < anims.length; i++) anims[i].cancel();

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
// SortableItem component
//

function SortableItem(props: {
  item: ItemData;
  isDragging: boolean;
  isA11yDragging: boolean;
  pointerDrag: PointerDragState | null;
  setPointerDrag: (v: PointerDragState | null) => void;
  lastSwapFromIdx: { current: number };
  a11yDrag: A11yDragState | null;
  listEl: HTMLUListElement | null;
  itemElements: Map<string, HTMLLIElement>;
  items: ItemData[];
  virtualOrder: { current: string[] | null };
  dndObserver: { current: DndObserver<AdvancedCollisionData> | null };
  itemStride: { current: number };
  onPointerDrop: { current: () => void };
  virtualSwap: (fromIndex: number, toIndex: number) => void;
}) {
  let liRef: HTMLLIElement | null = null;

  // Register/unregister element in the shared map.
  createEffect(() => {
    const li = liRef;
    if (li) props.itemElements.set(props.item.id, li);
    onCleanup(() => {
      props.itemElements.delete(props.item.id);
    });
  });

  // Pointer sensor on the link element.
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  // Droppable — each item is a drop target for collision detection.
  const [, setDroppableRef] = useDroppable({
    data: { itemId: props.item.id },
    computeClientRect: () => {
      const listEl = props.listEl;
      const itemStride = props.itemStride.current;
      if (!listEl || !props.items.length || !itemStride) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }

      const order = props.virtualOrder.current;
      const idx = order
        ? order.indexOf(props.item.id)
        : props.items.findIndex((it) => it.id === props.item.id);

      if (idx < 0) return { x: 0, y: 0, width: 0, height: 0 };
      const listRect = listEl.getBoundingClientRect();
      const el = props.itemElements.get(props.item.id);
      const height = el ? el.getBoundingClientRect().height : itemStride;
      return {
        x: listRect.left,
        y: listRect.top + idx * itemStride,
        width: listRect.width,
        height,
      };
    },
  });

  function onScrollDuringDrag() {
    props.dndObserver.current?.updateDroppableClientRects();
  }

  // Draggable settings — uses DragPreview for the pointer-following proxy.
  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor], {
      elements: () => {
        const li = liRef;
        return li ? [li] : [];
      },
      dragPreview: true,
      dragPreviewExitTimeout: DRAG_PREVIEW_EXIT_TIMEOUT,
      startPredicate: ({
        event,
      }: {
        event: { x: number; y: number; startX: number; startY: number };
      }) => {
        if (props.a11yDrag) return false;
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
        const li = liRef;
        if (!li) return;

        props.virtualOrder.current = props.items.map((it) => it.id);

        li.classList.add('placeholder');
        props.lastSwapFromIdx.current = -1;
        props.setPointerDrag({
          itemId: props.item.id,
          originalIndex: props.items.findIndex((it) => it.id === props.item.id),
          cancelled: false,
        });
        props.listEl?.classList.add('is-dragging');
        window.addEventListener('scroll', onScrollDuringDrag);
      },
      onMove: () => {
        props.lastSwapFromIdx.current = -1;
      },
      onEnd: ({ endEvent }: { endEvent?: { type: string } | null }) => {
        window.removeEventListener('scroll', onScrollDuringDrag);

        const drag = props.pointerDrag;
        if (!drag) return;

        const cancelled = endEvent?.type === 'cancel';
        props.setPointerDrag({ ...drag, cancelled });

        if (cancelled) {
          animateTransformsToZero(props.itemElements, CANCEL_ANIM_DURATION);
          props.virtualOrder.current = null;
        }

        props.listEl?.classList.remove('is-dragging');
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

  const className = () =>
    `sortable-item${props.isDragging ? ' placeholder' : ''}${props.isA11yDragging ? ' a11y-dragging' : ''}`;

  return (
    <>
      <li
        ref={(node) => {
          liRef = node;
          setDroppableRef(node);
        }}
        class={className()}
      >
        <a
          ref={(node) => {
            setPointerSensorRef(node);
          }}
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
          let contentRef: HTMLDivElement | null = null;

          // Handle exit animation.
          if (exiting && contentRef) {
            // Use queueMicrotask to run after DOM insertion.
            queueMicrotask(() => {
              if (!contentRef) return;
              const proxy = contentRef.parentElement as HTMLElement;
              const source = sourceElement as HTMLElement;
              const drag = props.pointerDrag;

              const anims = source.getAnimations();
              for (let i = 0; i < anims.length; i++) anims[i].finish();

              const proxyRect = proxy.getBoundingClientRect();
              const sourceRect = source.getBoundingClientRect();
              const dx = sourceRect.left - proxyRect.left;
              const dy = sourceRect.top - proxyRect.top;

              const duration = drag?.cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;

              const cleanup = () => {
                source.classList.remove('placeholder');
                if (!drag?.cancelled) {
                  props.onPointerDrop.current();
                }
                props.setPointerDrag(null);
                done();
              };

              if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                cleanup();
                return;
              }

              const anim = proxy.animate(
                [{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }],
                { duration, easing: 'ease', fill: 'forwards', composite: 'add' },
              );
              anim.onfinish = cleanup;
            });
          }

          return (
            <div
              ref={(el) => (contentRef = el)}
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

//
// App component
//

function App() {
  // Item order state.
  const [items, setItems] = createSignal<ItemData[]>(
    Array.from({ length: ITEM_COUNT }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
    })),
  );

  // Mutable refs — Solid components run once so these are stable.
  let listEl: HTMLUListElement | null = null;
  let liveRegion: HTMLDivElement | null = null;
  const itemElements = new Map<string, HTMLLIElement>();
  const itemStride = { current: 0 };
  const virtualOrder: { current: string[] | null } = { current: null };
  const lastSwapFromIdx = { current: -1 };
  let swapCooldown = false;

  // Pointer drag state (imperative).
  const [pointerDrag, setPointerDrag] = createSignal<PointerDragState | null>(null);

  // Keyboard reorder state.
  const [a11yDrag, setA11yDrag] = createSignal<A11yDragState | null>(null);

  // Track which item is being pointer-dragged.
  const [draggingId, setDraggingId] = createSignal<string | null>(null);

  // Measure item dimensions after first render.
  createEffect(() => {
    const _items = items(); // Track items changes.
    if (itemElements.size < 2) return;
    const ids = Array.from(itemElements.keys());
    const el0 = itemElements.get(ids[0]);
    const el1 = itemElements.get(ids[1]);
    if (el0 && el1) {
      itemStride.current = el1.getBoundingClientRect().top - el0.getBoundingClientRect().top;
    }
  });

  // After a state commit (drop), clear all inline transforms.
  createEffect(() => {
    items(); // Track items changes.
    clearAllTransforms(itemElements);
  });

  // Swap two items in the virtual order and animate the affected items.
  const virtualSwap = (fromIndex: number, toIndex: number) => {
    const order = virtualOrder.current;
    if (!order || fromIndex === toIndex) return;

    const lo = Math.min(fromIndex, toIndex);
    const hi = Math.max(fromIndex, toIndex);
    const affectedIds = order.slice(lo, hi + 1);

    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);

    // Prevent rapid cascading swaps — wait for the animation to settle.
    swapCooldown = true;
    setTimeout(() => {
      swapCooldown = false;
    }, SWAP_ANIM_DURATION);

    applyVirtualTransforms(itemElements, items(), order, itemStride.current, affectedIds, true);
  };

  // Commit the virtual order to state (called on drop).
  const commitOrder = () => {
    const order = virtualOrder.current;
    if (!order) return;
    virtualOrder.current = null;
    setItems((prev) => order.map((id) => prev.find((it) => it.id === id)!));
  };

  // Ref for SortableItem to call on pointer drop completion.
  const onPointerDrop = { current: commitOrder };

  // DndObserver ref for imperative access.
  const dndObserverRef: { current: DndObserver<AdvancedCollisionData> | null } = { current: null };

  // DndObserver with collision-based reorder.
  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ collisions }) => {
      const drag = pointerDrag();
      const order = virtualOrder.current;
      if (!drag || !order || swapCooldown) return;

      const observer = dndObserverRef.current;

      for (const collision of collisions) {
        if (collision.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;
        const targetDroppable = observer?.droppables.get(collision.droppableId);
        if (!targetDroppable) continue;
        const targetItemId = (targetDroppable as Droppable).data.itemId as string;
        if (targetItemId === drag.itemId) continue;

        const currentIdx = order.indexOf(drag.itemId);
        const targetIdx = order.indexOf(targetItemId);
        if (currentIdx === targetIdx || targetIdx === lastSwapFromIdx.current) continue;

        lastSwapFromIdx.current = currentIdx;
        virtualSwap(currentIdx, targetIdx);
        observer?.updateDroppableClientRects();
        break;
      }
    },
  });

  // Keep dndObserverRef in sync.
  createEffect(() => {
    dndObserverRef.current = dndObserver();
  });

  // Track pointer drag start/end for placeholder styling.
  createEffect(() => {
    const obs = dndObserver();
    if (!obs) return;
    const startId = obs.on('start', () => {
      const drag = pointerDrag();
      if (drag) setDraggingId(drag.itemId);
    });
    const endId = obs.on('end', () => {
      setDraggingId(null);
    });
    onCleanup(() => {
      obs.off('start', startId);
      obs.off('end', endId);
    });
  });

  //
  // Keyboard reorder
  //

  const a11yStart = (itemId: string) => {
    const currentItems = items();
    const index = currentItems.findIndex((it) => it.id === itemId);
    if (index < 0) return;
    const item = currentItems[index];

    virtualOrder.current = currentItems.map((it) => it.id);

    setA11yDrag({ itemId, originalIndex: index, currentIndex: index });
    announce(
      liveRegion,
      `Picked up ${item.label}. Position ${index + 1} of ${currentItems.length}. ` +
        `Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
    );
  };

  const a11yMove = (direction: -1 | 1) => {
    const drag = a11yDrag();
    const order = virtualOrder.current;
    if (!drag || !order) return;

    const newIndex = drag.currentIndex + direction;
    if (newIndex < 0 || newIndex >= order.length) return;

    virtualSwap(drag.currentIndex, newIndex);

    const updatedDrag = { ...drag, currentIndex: newIndex };
    setA11yDrag(updatedDrag);

    requestAnimationFrame(() => {
      const el = itemElements.get(drag.itemId);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });

    const item = items().find((it) => it.id === drag.itemId);
    announce(liveRegion, `${item?.label || ''}, position ${newIndex + 1} of ${order.length}.`);
  };

  const a11yEnd = (cancel: boolean) => {
    const drag = a11yDrag();
    if (!drag) return;

    setA11yDrag(null);

    const currentItems = items();
    const item = currentItems.find((it) => it.id === drag.itemId);

    if (cancel) {
      animateTransformsToZero(itemElements, CANCEL_ANIM_DURATION);
      virtualOrder.current = null;
    } else {
      commitOrder();
    }

    announce(
      liveRegion,
      cancel
        ? `${item?.label || ''} reorder cancelled. Returned to position ${drag.originalIndex + 1}.`
        : `${item?.label || ''} dropped at position ${drag.currentIndex + 1} of ${currentItems.length}.`,
    );

    const el = itemElements.get(drag.itemId);
    const link = el?.querySelector('a');
    link?.focus({ preventScroll: true });
  };

  // Global keyboard handler for a11y reorder.
  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
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
        if (!li) return;
        const itemId = Array.from(itemElements.entries()).find(([, el]) => el === li)?.[0];
        if (itemId) {
          e.preventDefault();
          a11yStart(itemId);
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => document.removeEventListener('keydown', onKeyDown));
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
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
        <For each={items()}>
          {(item) => (
            <SortableItem
              item={item}
              isDragging={draggingId() === item.id}
              isA11yDragging={a11yDrag()?.itemId === item.id}
              pointerDrag={pointerDrag()}
              setPointerDrag={setPointerDrag}
              lastSwapFromIdx={lastSwapFromIdx}
              a11yDrag={a11yDrag()}
              listEl={listEl}
              itemElements={itemElements}
              items={items()}
              virtualOrder={virtualOrder}
              dndObserver={dndObserverRef}
              itemStride={itemStride}
              onPointerDrop={onPointerDrop}
              virtualSwap={virtualSwap}
            />
          )}
        </For>
      </ul>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find the root element');

render(() => <App />, root);
