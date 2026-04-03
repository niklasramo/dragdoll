// Sortable list with pointer drag and keyboard reorder.
//
// Pointer: drag items via mouse/touch. A clone follows the pointer while the
// original stays in-flow as a placeholder. DndObserver handles collision-based
// reorder.
//
// Keyboard: Shift+Space/Enter to pick up, arrows to move, Space/Enter to
// drop, Escape to cancel.
//
// Items are visually repositioned with CSS transforms during drag. DOM order
// only changes on drop.

import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  autoScrollPlugin,
  DndObserver,
  DndObserverEventType,
  Draggable,
  DraggableModifier,
  Droppable,
  PointerSensor,
  startOffsetModifier,
} from 'dragdoll';

// ---------
// Constants
// ---------

const ITEM_COUNT = 100;
const POINTER_START_THRESHOLD_SQ = 8 * 8;
const SWAP_ANIM_DURATION = 150;
const DROP_ANIM_DURATION = 150;
const CANCEL_ANIM_DURATION = 200;
const SWAP_OVERLAP_THRESHOLD = 51;

// -----
// Types
// -----

interface ItemData {
  label: string;
  element: HTMLLIElement;
  link: HTMLAnchorElement;
  droppable: Droppable;
  domIndex: number;
}

// --------------
// DOM references
// --------------

const listEl = document.getElementById('sortable-list') as HTMLUListElement;
const liveRegion = document.getElementById('dnd-live-region') as HTMLDivElement;
const dragContainer = document.getElementById('drag-container') as HTMLDivElement;

// -----
// State
// -----

const items: ItemData[] = [];
const itemsByElement = new Map<HTMLLIElement, ItemData>();

let itemHeight = 0;
let itemStride = 0;
let listOffsetTop = 0;

let virtualOrder: number[] | null = null;
let virtualIndexOf: number[] | null = null;

let pointerDrag: {
  item: ItemData;
  preview: HTMLLIElement;
  originalIndex: number;
} | null = null;

let lastSwapFromIdx = -1;

let a11yDrag: {
  item: ItemData;
  originalIndex: number;
  currentIndex: number;
} | null = null;

let cachedListRect: DOMRect | null = null;

// -----------
// Measurement
// -----------

function measureItemDimensions() {
  const firstRect = items[0].element.getBoundingClientRect();
  const secondRect = items[1].element.getBoundingClientRect();
  itemHeight = firstRect.height;
  itemStride = secondRect.top - firstRect.top;
  listOffsetTop = firstRect.top - listEl.getBoundingClientRect().top;
}

function invalidateListRectCache() {
  cachedListRect = null;
}

function getListRect(): DOMRect {
  return (cachedListRect ??= listEl.getBoundingClientRect());
}

// --------------
// Virtual layout
// --------------

function initVirtualOrder() {
  measureItemDimensions();
  virtualOrder = items.map((_, i) => i);
  virtualIndexOf = items.map((_, i) => i);
}

function getVirtualIndex(domIndex: number): number {
  return virtualIndexOf ? virtualIndexOf[domIndex] : domIndex;
}

function virtualSwap(fromIdx: number, toIdx: number, animate = true) {
  if (!virtualOrder || !virtualIndexOf || fromIdx === toIdx) return;

  const lo = Math.min(fromIdx, toIdx);
  const hi = Math.max(fromIdx, toIdx);

  const [moved] = virtualOrder.splice(fromIdx, 1);
  virtualOrder.splice(toIdx, 0, moved);

  for (let vi = lo; vi <= hi; vi++) {
    virtualIndexOf[virtualOrder[vi]] = vi;
  }

  for (let vi = lo; vi <= hi; vi++) {
    const domIdx = virtualOrder[vi];
    const el = items[domIdx].element;
    const newY = (vi - domIdx) * itemStride;
    const prevY = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
    if (prevY === newY) continue;

    el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

    if (animate) {
      const anims = el.getAnimations();
      for (let j = 0; j < anims.length; j++) anims[j].cancel();
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

function commitOrder() {
  if (!virtualOrder) return;

  const newItems = virtualOrder.map((domIdx) => items[domIdx]);
  for (let i = 0; i < newItems.length; i++) {
    newItems[i].domIndex = i;
    listEl.appendChild(newItems[i].element);
  }

  items.length = 0;
  items.push(...newItems);
  clearAllTransforms();
  virtualOrder = null;
  virtualIndexOf = null;
}

function clearAllTransforms() {
  for (const item of items) {
    const anims = item.element.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].cancel();
    item.element.style.transform = '';
  }
}

function animateTransformsToZero(duration: number) {
  for (const item of items) {
    const el = item.element;
    const t = el.style.transform;
    if (!t || t === 'translateY(0px)') continue;

    const anims = el.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].cancel();

    el.style.transform = '';
    el.animate([{ transform: t }, { transform: 'translateY(0px)' }], { duration, easing: 'ease' });
  }
}

// ---------------
// Preview helpers
// ---------------

function createPreviewClone(element: HTMLLIElement): HTMLLIElement {
  const preview = element.cloneNode(true) as HTMLLIElement;
  const rect = element.getBoundingClientRect();
  const parentRect = element.parentElement!.getBoundingClientRect();

  const s = preview.style;
  s.position = 'absolute';
  s.left = `${rect.left - parentRect.left}px`;
  s.top = `${rect.top - parentRect.top}px`;
  s.width = `${rect.width}px`;
  s.margin = '0';
  s.boxSizing = 'border-box';
  s.contain = 'layout';

  preview.classList.add('drag-preview');
  preview.setAttribute('aria-hidden', 'true');
  element.parentElement!.appendChild(preview);
  return preview;
}

function animatePreviewToTarget(
  preview: HTMLLIElement,
  target: HTMLLIElement,
  duration: number,
  onDone: () => void,
) {
  const anims = target.getAnimations();
  for (let i = 0; i < anims.length; i++) anims[i].finish();

  const pRect = preview.getBoundingClientRect();
  const tRect = target.getBoundingClientRect();
  const dx = tRect.left - pRect.left;
  const dy = tRect.top - pRect.top;

  if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
    onDone();
    return;
  }

  const anim = preview.animate([{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }], {
    duration,
    easing: 'ease',
    fill: 'forwards',
    composite: 'add',
  });
  anim.onfinish = onDone;
}

// ---------
// Utilities
// ---------

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

function announce(message: string) {
  liveRegion.textContent = message;
}

// -----------
// DndObserver
// -----------

const dndObserver = new DndObserver<AdvancedCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

// ------------
// Pointer drag
// ------------

function onScrollDuringDrag() {
  invalidateListRectCache();
  dndObserver.updateDroppableClientRects();
}

function pointerDragEnd(cancelled: boolean) {
  window.removeEventListener('scroll', onScrollDuringDrag);

  const drag = pointerDrag!;
  const li = drag.item.element;
  const preview = drag.preview;
  pointerDrag = null;

  const cleanup = () => {
    preview.remove();
    li.classList.remove('placeholder');
    listEl.classList.remove('is-dragging');
  };

  if (cancelled) {
    animateTransformsToZero(CANCEL_ANIM_DURATION);
    virtualOrder = null;
    virtualIndexOf = null;
    animatePreviewToTarget(preview, li, CANCEL_ANIM_DURATION, cleanup);
  } else {
    commitOrder();
    animatePreviewToTarget(preview, li, DROP_ANIM_DURATION, cleanup);
  }
}

// ----------------
// Keyboard reorder
// ----------------

function a11yStart(item: ItemData) {
  initVirtualOrder();
  a11yDrag = { item, originalIndex: item.domIndex, currentIndex: item.domIndex };
  item.element.classList.add('a11y-dragging');
  item.element.scrollIntoView({ block: 'nearest' });

  announce(
    `Picked up ${item.label}. Position ${item.domIndex + 1} of ${items.length}. ` +
      `Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
  );
}

function a11yMove(direction: -1 | 1) {
  if (!a11yDrag) return;

  const drag = a11yDrag;
  const newIndex = drag.currentIndex + direction;
  if (newIndex < 0 || newIndex >= items.length) return;

  virtualSwap(drag.currentIndex, newIndex, false);
  drag.currentIndex = newIndex;

  // Scroll using computed position — no DOM read per item needed.
  const freshListRect = listEl.getBoundingClientRect();
  const gap = itemStride - itemHeight;
  const targetTop = freshListRect.top + listOffsetTop + newIndex * itemStride;
  const targetBottom = targetTop + itemHeight;
  if (targetTop - gap < 0) {
    window.scrollBy(0, targetTop - gap);
  } else if (targetBottom + gap > window.innerHeight) {
    window.scrollBy(0, targetBottom + gap - window.innerHeight);
  }

  announce(`${drag.item.label}, position ${newIndex + 1} of ${items.length}.`);
}

function a11yEnd(cancel: boolean) {
  if (!a11yDrag) return;

  const drag = a11yDrag;
  a11yDrag = null;
  drag.item.element.classList.remove('a11y-dragging');

  if (cancel) {
    animateTransformsToZero(CANCEL_ANIM_DURATION);
    virtualOrder = null;
    virtualIndexOf = null;
  } else {
    commitOrder();
  }

  announce(
    cancel
      ? `${drag.item.label} reorder cancelled. Returned to position ${drag.originalIndex + 1}.`
      : `${drag.item.label} dropped at position ${drag.currentIndex + 1} of ${items.length}.`,
  );

  drag.item.link.focus({ preventScroll: true });
}

// ----------------
// Keyboard handler
// ----------------

document.addEventListener('keydown', (e) => {
  if (a11yDrag) {
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
      a11yStart(item);
    }
  }
});

// ----------
// Build list
// ----------

const droppables: Droppable[] = [];
const draggables: Draggable<PointerSensor>[] = [];

for (let i = 0; i < ITEM_COUNT; i++) {
  const label = `Item ${i + 1}`;

  const li = document.createElement('li');
  li.className = 'sortable-item';

  const link = document.createElement('a');
  link.href = 'https://muuri.dev';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.draggable = false;
  link.textContent = label;
  link.setAttribute('aria-roledescription', 'sortable item');
  link.setAttribute('aria-describedby', 'dnd-instructions');
  li.appendChild(link);
  listEl.appendChild(li);

  const pointerSensor = new PointerSensor(link);
  const itemData: ItemData = { label, element: li, link, domIndex: i } as ItemData;
  items.push(itemData);
  itemsByElement.set(li, itemData);

  const droppable = new Droppable(li, {
    data: { item: itemData },
    computeClientRect: () => {
      const idx = getVirtualIndex(itemData.domIndex);
      const listRect = getListRect();
      return {
        x: listRect.left,
        y: listRect.top + listOffsetTop + idx * itemStride,
        width: listRect.width,
        height: itemHeight,
      };
    },
  });
  itemData.droppable = droppable;

  const draggable = new Draggable<PointerSensor>([pointerSensor], {
    elements: () => {
      initVirtualOrder();
      invalidateListRectCache();
      const preview = createPreviewClone(li);
      pointerDrag = { item: itemData, preview, originalIndex: itemData.domIndex };
      return [preview];
    },
    container: () => dragContainer,
    startPredicate: ({ event }) => {
      if (a11yDrag) return false;
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
    frozenStyles: () => ['width', 'height'],
    onStart: () => {
      li.classList.add('placeholder');
      lastSwapFromIdx = -1;
      listEl.classList.add('is-dragging');
      window.addEventListener('scroll', onScrollDuringDrag);
    },
    onMove: () => {
      lastSwapFromIdx = -1;
    },
    onEnd: ({ endEvent }) => {
      pointerDragEnd(endEvent?.type === 'cancel');
    },
  }).use(
    autoScrollPlugin({
      targets: [{ element: window, axis: 'y', padding: { top: Infinity, bottom: Infinity } }],
    }),
  );

  droppables.push(droppable);
  draggables.push(draggable);
}

dndObserver.addDroppables(droppables);
dndObserver.addDraggables(draggables);

// -----------------------
// Collision-based reorder
// -----------------------

dndObserver.on(DndObserverEventType.Collide, ({ collisions }) => {
  if (!pointerDrag || !virtualOrder) return;

  const draggedItem = pointerDrag.item;
  const draggedDomIdx = draggedItem.domIndex;

  for (const collision of collisions) {
    if (collision.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;

    const targetDroppable = dndObserver.droppables.get(collision.droppableId);
    if (!targetDroppable) continue;

    const targetItem = targetDroppable.data.item as ItemData;
    if (targetItem === draggedItem) continue;

    const currentVIdx = getVirtualIndex(draggedDomIdx);
    const targetVIdx = getVirtualIndex(targetItem.domIndex);
    if (currentVIdx === targetVIdx || targetVIdx === lastSwapFromIdx) continue;

    lastSwapFromIdx = currentVIdx;
    virtualSwap(currentVIdx, targetVIdx);
    invalidateListRectCache();
    dndObserver.updateDroppableClientRects();
    break;
  }
});

// -------------------
// Initial measurement
// -------------------

measureItemDimensions();
