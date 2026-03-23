// Sortable list with two interaction modes:
//
// 1. POINTER DRAG — drag items via mouse/touch. A fixed-position clone
//    ("preview") follows the pointer while the original element stays
//    in-flow as a translucent placeholder. DndObserver detects collisions
//    between the preview and other items to trigger reorder.
//
// 2. KEYBOARD REORDER — Shift+Space/Enter to pick up, arrow keys to
//    move one position at a time, Space/Enter to drop, Escape to cancel.
//
// During either interaction, items are repositioned using CSS transforms
// (DOM order stays fixed). The final DOM reorder only happens on drop.

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
  preview.setAttribute('aria-hidden', 'true');
  document.body.appendChild(preview);
  return preview;
}

function animatePreviewDrop(
  preview: HTMLLIElement,
  target: HTMLLIElement,
  duration: number,
  onDone: () => void,
) {
  const anims = target.getAnimations();
  for (let i = 0; i < anims.length; i++) anims[i].finish();

  const targetRect = target.getBoundingClientRect();
  const anim = preview.animate(
    [{ transform: `translate(${targetRect.left}px, ${targetRect.top}px)` }],
    { duration, easing: 'ease', fill: 'forwards' },
  );
  anim.onfinish = onDone;
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
// Virtual layout helpers
//
// During drag, items stay in their original DOM positions. Visual reordering
// is done with translateY transforms based on each item's virtual index vs
// its DOM index. The DOM is only reordered on drop.
//

// The virtual order (item indices into the `items` array). null when idle.
let virtualOrder: number[] | null = null;

function initVirtualOrder() {
  virtualOrder = items.map((_, i) => i);
}

function getVirtualIndex(itemIndex: number): number {
  return virtualOrder ? virtualOrder.indexOf(itemIndex) : itemIndex;
}

function virtualSwap(fromVirtualIdx: number, toVirtualIdx: number) {
  if (!virtualOrder || fromVirtualIdx === toVirtualIdx) return;

  const lo = Math.min(fromVirtualIdx, toVirtualIdx);
  const hi = Math.max(fromVirtualIdx, toVirtualIdx);

  // Splice the item in the virtual order.
  const [moved] = virtualOrder.splice(fromVirtualIdx, 1);
  virtualOrder.splice(toVirtualIdx, 0, moved);

  // Apply transforms to affected items.
  for (let vi = lo; vi <= hi; vi++) {
    const domIdx = virtualOrder[vi];
    const el = items[domIdx].element;
    const newY = (vi - domIdx) * itemStride;

    const prevY = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
    if (prevY === newY) continue;

    el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

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

function commitOrder() {
  if (!virtualOrder) return;

  // Build the new items array from virtual order.
  const newItems = virtualOrder.map((domIdx) => items[domIdx]);

  // Reorder DOM to match.
  for (const item of newItems) {
    listEl.appendChild(item.element);
  }

  // Replace items array contents.
  items.length = 0;
  items.push(...newItems);

  // Clear all transforms (DOM now matches visual order).
  clearAllTransforms();

  virtualOrder = null;
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

//
// Pointer drag — start, move, reorder, end
//

function onScrollDuringDrag() {
  dndObserver.updateDroppableClientRects();
}

function pointerDragEnd(cancelled: boolean) {
  window.removeEventListener('scroll', onScrollDuringDrag);

  const drag = pointerDrag!;
  const li = drag.item.element;
  const preview = drag.preview;

  // Null out immediately so the collision handler becomes a no-op.
  pointerDrag = null;

  if (cancelled) {
    // Animate items back to their DOM positions, then clean up.
    animateTransformsToZero(CANCEL_ANIM_DURATION);
    virtualOrder = null;

    const cleanup = () => {
      preview.remove();
      li.classList.remove('placeholder');
      listEl.classList.remove('is-dragging');
    };

    animatePreviewDrop(preview, li, CANCEL_ANIM_DURATION, cleanup);
  } else {
    // Commit: reorder DOM to match virtual order, then animate preview
    // to the item's final position.
    const cleanup = () => {
      preview.remove();
      li.classList.remove('placeholder');
      listEl.classList.remove('is-dragging');
    };

    // Commit must happen before the preview animation reads the target
    // rect, so the target is at its final DOM position.
    commitOrder();
    animatePreviewDrop(preview, li, DROP_ANIM_DURATION, cleanup);
  }
}

//
// Keyboard reorder — start, move, end
//
// A separate interaction mode for keyboard/screen reader users. Not
// driven by DragDoll's sensors — it directly manipulates the virtual
// order and announces changes via the live region.
//

function a11yStart(item: ItemData) {
  const index = items.indexOf(item);
  initVirtualOrder();
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

  virtualSwap(drag.currentIndex, newIndex);
  drag.currentIndex = newIndex;

  // Scroll the item into view (getBoundingClientRect respects transforms).
  requestAnimationFrame(() => {
    drag.item.element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

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

//
// Keyboard event handler
//

document.addEventListener('keydown', (e) => {
  // While a keyboard reorder is active, handle reorder keys.
  // Unrecognized keys (Tab, Ctrl+shortcuts, etc.) pass through.
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
  link.setAttribute('aria-roledescription', 'sortable item');
  link.setAttribute('aria-describedby', 'dnd-instructions');
  li.appendChild(link);
  listEl.appendChild(li);

  const pointerSensor = new PointerSensor(link);
  const itemData: ItemData = { label, element: li, link } as ItemData;
  items.push(itemData);

  // Each item is a droppable for collision detection. The rect is computed
  // arithmetically using the virtual index during drag, falling back to
  // the DOM index when idle.
  const droppable = new Droppable(li, {
    data: { item: itemData },
    computeClientRect: () => {
      const domIdx = items.indexOf(itemData);
      const idx = getVirtualIndex(domIdx);
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
    positionModifiers: [
      startOffsetModifier as unknown as DraggableModifier<PointerSensor>,
      (change) => {
        change.x = 0;
        return change;
      },
    ],
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
      initVirtualOrder();
      pointerDrag = {
        item: itemData,
        preview,
        originalIndex: items.indexOf(itemData),
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
// dragged item with the target in the virtual order.
//

dndObserver.on(DndObserverEventType.Collide, ({ collisions }) => {
  if (!pointerDrag || !virtualOrder) return;
  const draggedItem = pointerDrag.item;
  const draggedDomIdx = items.indexOf(draggedItem);

  for (const collision of collisions) {
    if (collision.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;
    const targetDroppable = dndObserver.droppables.get(collision.droppableId);
    if (!targetDroppable) continue;
    const targetItem = targetDroppable.data.item as ItemData;
    if (targetItem === draggedItem) continue;

    const currentVIdx = getVirtualIndex(draggedDomIdx);
    const targetVIdx = getVirtualIndex(items.indexOf(targetItem));
    if (currentVIdx === targetVIdx || targetVIdx === lastSwapFromIdx) continue;

    lastSwapFromIdx = currentVIdx;
    virtualSwap(currentVIdx, targetVIdx);
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
