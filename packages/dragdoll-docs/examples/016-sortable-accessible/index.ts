// Sortable list with two interaction modes:
//
// 1. POINTER DRAG — drag items via mouse/touch. A fixed-position clone
//    ("preview") follows the pointer while the original element stays
//    in-flow as a translucent placeholder. DndObserver detects collisions
//    between the preview and other items to trigger reorder.
//
// 2. KEYBOARD REORDER — Shift+Space/Enter to pick up, arrow keys to
//    move one position at a time, Space/Enter to drop, Escape to cancel.
//    Items reorder with FLIP animations and the live region announces
//    every position change for screen readers.

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

//
// Constants
//

const ITEM_COUNT = 100;
const POINTER_START_THRESHOLD_SQ = 8 * 8;
const SWAP_ANIM_DURATION = 150;
const DROP_ANIM_DURATION = 150;
const CANCEL_ANIM_DURATION = 200;
const SWAP_OVERLAP_THRESHOLD = 51;

//
// Types
//

interface ItemData {
  label: string;
  element: HTMLLIElement;
  link: HTMLAnchorElement;
  droppable: Droppable;
}

//
// Pure helpers
//

function insertElementAtIndex(
  parent: HTMLElement,
  element: HTMLElement,
  allItems: ItemData[],
  index: number,
) {
  if (index < allItems.length - 1) {
    parent.insertBefore(element, allItems[index + 1].element);
  } else {
    parent.appendChild(element);
  }
}

function spliceItem(allItems: ItemData[], fromIndex: number, toIndex: number): ItemData {
  const [item] = allItems.splice(fromIndex, 1);
  allItems.splice(toIndex, 0, item);
  return item;
}

function cancelElementAnimations(allItems: ItemData[], lo: number, hi: number) {
  for (let i = lo; i <= hi; i++) {
    const anims = allItems[i].element.getAnimations();
    for (let j = 0; j < anims.length; j++) anims[j].cancel();
  }
}

function capturePositions(allItems: ItemData[], lo: number, hi: number): Map<HTMLElement, number> {
  const positions = new Map<HTMLElement, number>();
  for (let i = lo; i <= hi; i++) {
    const el = allItems[i].element;
    positions.set(el, el.getBoundingClientRect().top);
  }
  return positions;
}

function animatePositionDeltas(
  allItems: ItemData[],
  oldPositions: Map<HTMLElement, number>,
  lo: number,
  hi: number,
  duration: number,
) {
  for (let i = lo; i <= hi; i++) {
    const el = allItems[i].element;
    const delta = oldPositions.get(el)! - el.getBoundingClientRect().top;
    if (delta === 0) continue;
    el.animate([{ transform: `translateY(${delta}px)` }, { transform: 'translateY(0)' }], {
      duration,
      easing: 'ease',
    });
  }
}

function cloneAsFixedPreview(element: HTMLLIElement, className: string): HTMLLIElement {
  const preview = element.cloneNode(true) as HTMLLIElement;
  const rect = element.getBoundingClientRect();
  const style = preview.style;
  style.position = 'fixed';
  style.top = '0';
  style.left = '0';
  style.width = `${rect.width}px`;
  style.willChange = 'transform';
  style.transform = `translate(${rect.left}px, ${rect.top}px)`;
  preview.classList.add(className);
  document.body.appendChild(preview);
  return preview;
}

function animatePreviewDrop(
  preview: HTMLLIElement,
  target: HTMLLIElement,
  duration: number,
  onDone: () => void,
) {
  const targetRect = target.getBoundingClientRect();
  const anim = preview.animate(
    [{ transform: `translate(${targetRect.left}px, ${targetRect.top}px)` }],
    { duration, easing: 'ease', fill: 'forwards' },
  );
  anim.onfinish = onDone;
}

function computeItemPosition(
  listEl: HTMLElement,
  index: number,
  itemStride: number,
): { top: number; bottom: number } {
  const listTop = listEl.getBoundingClientRect().top;
  const top = listTop + index * itemStride;
  return { top, bottom: top + itemHeight };
}

function scrollIntoViewport(top: number, bottom: number) {
  if (top < 0) {
    window.scrollBy(0, top);
  } else if (bottom > window.innerHeight) {
    window.scrollBy(0, bottom - window.innerHeight);
  }
}

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

//
// State
//

const items: ItemData[] = [];
let itemHeight = 0;
let itemStride = 0;

// Active while a pointer drag is in progress, null otherwise.
let pointerDrag: {
  item: ItemData;
  preview: HTMLLIElement;
  originalIndex: number;
  startLeft: number;
  startTop: number;
} | null = null;

// During auto-scroll the pointer stays still while the page moves, which
// can cause rapid back-and-forth swaps between two items. This guard
// stores the index the dragged item came FROM in the last swap so we
// don't immediately swap back. It resets on every pointer move so the
// user can still freely move items in either direction.
let lastSwapFromIdx = -1;

// Active while a keyboard reorder is in progress.
let a11yDrag: {
  item: ItemData;
  originalIndex: number;
  currentIndex: number;
} | null = null;

//
// DOM references
//

const listEl = document.getElementById('sortable-list') as HTMLUListElement;
const liveRegion = document.getElementById('dnd-live-region') as HTMLDivElement;

//
// DndObserver — tracks collisions between draggables and droppables.
//

const dndObserver = new DndObserver<AdvancedCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

//
// Utilities
//

function announce(message: string) {
  liveRegion.textContent = message;
}

function getItemIndex(item: ItemData): number {
  return items.indexOf(item);
}

//
// Reorder with FLIP animation
//
// FLIP (First, Last, Invert, Play): capture each element's position
// before the DOM change, apply the change, then animate from the old
// position to the new one.
//

// Reorder without animation (used when the item is fully off-screen).
function moveItem(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return;
  cancelElementAnimations(items, Math.min(fromIndex, toIndex), Math.max(fromIndex, toIndex));
  const item = spliceItem(items, fromIndex, toIndex);
  insertElementAtIndex(listEl, item.element, items, toIndex);
}

// Reorder with FLIP animation (used when items are visible).
function moveItemAnimated(fromIndex: number, toIndex: number) {
  if (fromIndex === toIndex) return;

  const lo = Math.min(fromIndex, toIndex);
  const hi = Math.max(fromIndex, toIndex);

  // Cancel running animations so getBoundingClientRect() returns the
  // final layout position, not a mid-animation position.
  cancelElementAnimations(items, lo, hi);

  // FIRST: capture current positions.
  const oldPositions = capturePositions(items, lo, hi);

  // Mutate array + DOM.
  const item = spliceItem(items, fromIndex, toIndex);
  insertElementAtIndex(listEl, item.element, items, toIndex);

  // LAST + INVERT + PLAY: animate from old positions to new ones.
  animatePositionDeltas(items, oldPositions, lo, hi, SWAP_ANIM_DURATION);
}

//
// Pointer drag — start, move, reorder, end
//

function onScrollDuringDrag() {
  // When the page scrolls, droppable positions change. Tell DndObserver
  // to recompute them so collision detection stays accurate.
  dndObserver.updateDroppableClientRects();
}

function pointerDragEnd(cancelled: boolean) {
  window.removeEventListener('scroll', onScrollDuringDrag);

  const drag = pointerDrag!;
  const li = drag.item.element;
  const preview = drag.preview;
  const currentIndex = getItemIndex(drag.item);

  // Null out immediately so the collision handler becomes a no-op.
  pointerDrag = null;

  const cleanup = () => {
    preview.remove();
    li.classList.remove('placeholder');
    listEl.classList.remove('is-dragging');
  };

  if (cancelled && currentIndex !== drag.originalIndex) {
    moveItemAnimated(currentIndex, drag.originalIndex);
  }

  // Finish any running FLIP animation on the placeholder so
  // getBoundingClientRect() returns the final layout position. This
  // matters when the user releases fast — the last swap's FLIP animation
  // may still be in progress.
  const anims = li.getAnimations();
  for (let i = 0; i < anims.length; i++) anims[i].finish();

  const duration = cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;
  animatePreviewDrop(preview, li, duration, cleanup);
}

//
// Keyboard reorder — start, move, end
//
// A separate interaction mode for keyboard/screen reader users. Not
// driven by DragDoll's sensors — it directly manipulates the items
// array and announces changes via the live region.
//

function a11yStart(item: ItemData) {
  const index = getItemIndex(item);
  a11yDrag = { item, originalIndex: index, currentIndex: index };
  item.element.classList.add('a11y-dragging');
  announce(
    `Picked up ${item.label}. Position ${index + 1} of ${items.length}. ` +
      `Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
  );
}

function a11yMove(direction: -1 | 1) {
  if (!a11yDrag) return;

  const drag = a11yDrag;
  const newIndex = drag.currentIndex + direction;
  if (newIndex < 0 || newIndex >= items.length) return;

  // Check if the item's target position is outside the viewport.
  const pos = computeItemPosition(listEl, newIndex, itemStride);
  const isOffScreen = pos.bottom <= 0 || pos.top >= window.innerHeight;

  // Off-screen items snap instantly (no point animating what's not
  // visible). Visible items get a FLIP animation.
  if (isOffScreen) {
    moveItem(drag.currentIndex, newIndex);
  } else {
    moveItemAnimated(drag.currentIndex, newIndex);
  }
  drag.currentIndex = newIndex;

  // Scroll the item into view.
  if (isOffScreen) {
    // For non-animated moves, read the actual element rect (it's
    // accurate since there's no FLIP transform offset).
    const rect = drag.item.element.getBoundingClientRect();
    scrollIntoViewport(rect.top, rect.bottom);
  } else {
    // For animated moves, use the computed position (the element's
    // actual rect includes the FLIP transform offset).
    scrollIntoViewport(pos.top, pos.bottom);
  }

  announce(`${drag.item.label}, position ${newIndex + 1} of ${items.length}.`);
}

function a11yEnd(cancel: boolean) {
  if (!a11yDrag) return;

  const drag = a11yDrag;
  a11yDrag = null;
  drag.item.element.classList.remove('a11y-dragging');

  if (cancel && drag.currentIndex !== drag.originalIndex) {
    moveItemAnimated(drag.currentIndex, drag.originalIndex);
  }

  announce(
    cancel
      ? `${drag.item.label} reorder cancelled. Returned to position ${drag.originalIndex + 1}.`
      : `${drag.item.label} dropped at position ${drag.currentIndex + 1} of ${items.length}.`,
  );

  drag.item.link.focus({ preventScroll: true });
}

//
// Keyboard event handler
//

document.addEventListener('keydown', (e) => {
  // While a keyboard reorder is active, consume all relevant keys.
  if (a11yDrag) {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        return a11yMove(-1);
      case 'ArrowDown':
        return a11yMove(1);
      case ' ':
      case 'Enter':
        return a11yEnd(false);
      case 'Escape':
        return a11yEnd(true);
    }
    return;
  }

  // Shift+Space or Shift+Enter on a sortable item starts keyboard reorder.
  if (e.shiftKey && (e.key === ' ' || e.key === 'Enter')) {
    const li = (e.target as Element).closest('.sortable-item') as HTMLLIElement | null;
    const item = li && items.find((it) => it.element === li);
    if (item) {
      e.preventDefault();
      a11yStart(item);
    }
  }
});

//
// Build the list
//

const droppables: Droppable[] = [];
const draggables: Draggable<PointerSensor>[] = [];

for (let i = 0; i < ITEM_COUNT; i++) {
  const label = `Item ${i + 1}`;

  // Create the list item element.
  const li = document.createElement('li');
  li.className = 'sortable-item';

  const link = document.createElement('a');
  link.href = 'https://muuri.dev';
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.draggable = false;
  link.textContent = label;
  link.setAttribute('aria-roledescription', 'sortable link');
  link.setAttribute('aria-describedby', 'dnd-instructions');
  li.appendChild(link);
  listEl.appendChild(li);

  // Item data. The droppable field is assigned after creation because
  // itemData and droppable reference each other.
  const pointerSensor = new PointerSensor(link);
  const itemData: ItemData = { label, element: li, link } as ItemData;
  items.push(itemData);

  // Each item is a droppable for collision detection. The rect is
  // computed arithmetically from (listTop + index * stride) instead of
  // reading the DOM — this avoids getting mid-FLIP-animation rects.
  const droppable = new Droppable(li, {
    data: { item: itemData },
    computeClientRect: () => {
      const idx = items.indexOf(itemData);
      const listRect = listEl.getBoundingClientRect();
      return {
        x: listRect.left,
        y: listRect.top + idx * itemStride,
        width: listRect.width,
        height: itemHeight,
      };
    },
  });
  itemData.droppable = droppable;

  // The element (li) stays in-flow as a placeholder during drag. We
  // override applyPosition to move the preview clone (not the li) and
  // computeClientRect to return the preview's rect for collision detection.
  // startOffsetModifier compensates for the start threshold distance.
  const draggable = new Draggable<PointerSensor>([pointerSensor], {
    elements: () => [li],
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
    positionModifiers: [startOffsetModifier as unknown as DraggableModifier<PointerSensor>],
    applyPosition: ({ item, phase }) => {
      if (!pointerDrag || phase === 'end' || phase === 'end-align') return;
      const drag = pointerDrag;
      const x = drag.startLeft + item.position.x;
      const y = drag.startTop + item.position.y;
      drag.preview.style.transform = `translate(${x}px, ${y}px)`;
    },
    computeClientRect: () => {
      if (!pointerDrag) return null;
      const rect = pointerDrag.preview.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
    },
    onStart: () => {
      const rect = li.getBoundingClientRect();
      const preview = cloneAsFixedPreview(li, 'drag-preview');
      li.classList.add('placeholder');
      lastSwapFromIdx = -1;
      pointerDrag = {
        item: itemData,
        preview,
        originalIndex: getItemIndex(itemData),
        startLeft: rect.left,
        startTop: rect.top,
      };
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
      targets: [
        {
          element: window,
          axis: 'y',
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    }),
  );

  droppables.push(droppable);
  draggables.push(draggable);
}

// Register all items with DndObserver.
dndObserver.addDroppables(droppables);
dndObserver.addDraggables(draggables);

//
// Collision-based reorder
//
// When the preview overlaps a droppable by more than 51%, swap the
// dragged item with the target.
//

dndObserver.on(DndObserverEventType.Collide, ({ collisions }) => {
  if (!pointerDrag) return;
  const draggedItem = pointerDrag.item;

  for (const collision of collisions) {
    if (collision.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;
    const targetDroppable = dndObserver.droppables.get(collision.droppableId);
    if (!targetDroppable) continue;
    const targetItem = targetDroppable.data.item as ItemData;
    if (targetItem === draggedItem) continue;

    const currentIdx = getItemIndex(draggedItem);
    const targetIdx = getItemIndex(targetItem);
    if (currentIdx === targetIdx || targetIdx === lastSwapFromIdx) continue;

    lastSwapFromIdx = currentIdx;
    moveItemAnimated(currentIdx, targetIdx);

    // Droppable rects depend on item indices, which just changed.
    dndObserver.updateDroppableClientRects();
    break;
  }
});

//
// Measure item dimensions (must happen after the list is built).
//

itemHeight = items[0].element.getBoundingClientRect().height;
itemStride =
  items[1].element.getBoundingClientRect().top - items[0].element.getBoundingClientRect().top;
