import { Draggable, getLocalOffset, KeyboardMotionSensor, PointerSensor } from 'dragdoll';

const cards = Array.from(document.querySelectorAll<HTMLElement>('.card.draggable'));

const pointerSensor = new PointerSensor(window, {
  startPredicate: (e) => {
    if ('button' in e && (e as MouseEvent).button > 0) return false;
    const target = e.target as Element | null;
    if (!target) return false;
    return cards.some((card) => card.contains(target));
  },
});

const keyboardSensor = new KeyboardMotionSensor(null, {
  startPredicate: () => {
    const focused = document.activeElement;
    if (!focused) return null;
    const card = cards.find((c) => c.contains(focused));
    if (!card) return null;
    const { left, top } = card.getBoundingClientRect();
    return { x: left, y: top };
  },
});

new Draggable([pointerSensor, keyboardSensor], {
  elements: () => {
    const clones: HTMLElement[] = [];
    const cloneOffsets: ({ x: number; y: number } | undefined)[] = [];

    // Writes: clone each card, set styles, and append to the parent.
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];

      // Clone the card element.
      const clone = card.cloneNode(true) as HTMLElement;

      // Clone should not be clickable and it should not affect the layout.
      clone.style.pointerEvents = 'none';
      clone.style.contain = 'layout';

      // Add dragging class.
      clone.classList.add('dragging');

      // We don't have to do any position alignment if the element is already
      // positioned absolutely or fixed, the clone should be guaranteed to be
      // visually aligned with the original.
      const clonePos = getComputedStyle(clone).position;
      if (clonePos !== 'absolute' && clonePos !== 'fixed') {
        // Set the position of the clone to absolute, and position it at the
        // top left of the parent element.
        clone.style.position = 'absolute';
        clone.style.left = '0px';
        clone.style.top = '0px';
        clone.style.margin = '0';

        // We need offsets only for non-absolute/fixed positioned elements.
        cloneOffsets[i] = { x: 0, y: 0 };
      }

      // Append the clone to the parent element.
      card.parentElement!.appendChild(clone);
      clones[i] = clone;
    }

    // Reads: compute the offset between each original element and its clone.
    for (let i = 0; i < clones.length; i++) {
      const clone = clones[i];
      const offset = cloneOffsets[i];
      if (!offset) continue;
      const cardRect = cards[i].getBoundingClientRect();
      getLocalOffset(clone, cardRect.x, cardRect.y, offset);
    }

    // Writes: position each clone at the computed offset.
    for (let i = 0; i < clones.length; i++) {
      const offset = cloneOffsets[i];
      if (!offset) continue;
      clones[i].style.left = `${offset.x}px`;
      clones[i].style.top = `${offset.y}px`;
    }

    return clones;
  },
  container: () => document.body,
  onStart: () => {
    for (const card of cards) card.classList.add('dragging');
  },
  onEnd: (drag) => {
    const items = drag.items;
    const xTranslations: number[] = [];
    const yTranslations: number[] = [];

    // Compute all the translations first in a single pass. This way we
    // don't cause extra reflows by updating the style of one element at a
    // time.
    for (let i = 0; i < items.length; i++) {
      const card = cards[i];
      const dragItem = items[i];
      if (!card) continue;

      // Compute the offset between the original element and the drag preview.
      const offset = getLocalOffset(card, dragItem.clientRect.x, dragItem.clientRect.y);
      const parts = (getComputedStyle(card).translate || '').split(' ');
      const x = (parseFloat(parts[0]) || 0) + offset.x;
      const y = (parseFloat(parts[1]) || 0) + offset.y;
      xTranslations[i] = x;
      yTranslations[i] = y;
    }

    // Apply all DOM writes in a single pass.
    for (let i = 0; i < items.length; i++) {
      const card = cards[i];
      const dragItem = items[i];
      if (!card || !dragItem) continue;

      // Apply the computed translations.
      card.style.translate = `${xTranslations[i]}px ${yTranslations[i]}px`;

      // Remove the drag preview clone.
      dragItem.element.remove();

      // Remove the dragging class.
      card.classList.remove('dragging');
    }
  },
});
