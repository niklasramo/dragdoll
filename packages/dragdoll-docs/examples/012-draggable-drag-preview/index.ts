import {
  autoScrollPlugin,
  Draggable,
  getLocalOffset,
  KeyboardMotionSensor,
  PointerSensor,
} from 'dragdoll';

const scrollContainer = document.querySelector('.transform-inner') as HTMLElement;
const cards = document.querySelectorAll<HTMLElement>('.card.draggable');
let zIndex = 0;

cards.forEach((card) => {
  const pointerSensor = new PointerSensor(card);
  const keyboardSensor = new KeyboardMotionSensor(card);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => {
      // Clone the card element.
      const clone = card.cloneNode(true) as HTMLElement;

      clone.style.pointerEvents = 'none';
      clone.style.contain = 'layout';
      clone.classList.add('dragging');

      // We don't have to do any position alignment if the element is already
      // positioned absolutely or fixed, the clone should be guaranteed to be
      // visually aligned with the original.
      const clonePos = getComputedStyle(clone).position;
      if (clonePos === 'absolute' || clonePos === 'fixed') {
        card.parentElement!.appendChild(clone);
        return [clone];
      }

      // Set the position of the clone to absolute, and position it at the top
      // left of the parent element.
      clone.style.position = 'absolute';
      clone.style.left = `0px`;
      clone.style.top = `0px`;
      clone.style.margin = '0';

      // Append the clone to the parent element.
      card.parentElement!.appendChild(clone);

      // Compute the offset between the original element and the drag preview.
      const cardRect = card.getBoundingClientRect();
      const cloneOffset = getLocalOffset(clone, cardRect.x, cardRect.y);

      // Position the clone at the computed offset.
      clone.style.left = `${cloneOffset.x}px`;
      clone.style.top = `${cloneOffset.y}px`;

      return [clone];
    },
    container: () => document.body,
    onStart: () => {
      card.classList.add('dragging');
    },
    onEnd: (drag) => {
      const dragItem = drag.items[0];

      // Align the original element to the final viewport position of the drag
      // preview.
      const offset = getLocalOffset(card, dragItem.clientRect.x, dragItem.clientRect.y);
      const parts = (getComputedStyle(card).translate || '').split(' ');
      const x = (parseFloat(parts[0]) || 0) + offset.x;
      const y = (parseFloat(parts[1]) || 0) + offset.y;
      card.style.translate = `${x}px ${y}px`;
      card.style.zIndex = String(++zIndex);

      // Remove the drag preview clone.
      dragItem.element.remove();

      // Remove the dragging class.
      card.classList.remove('dragging');
    },
  }).use(
    autoScrollPlugin({
      targets: () => [
        {
          element: scrollContainer,
          axis: 'y',
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    }),
  );
});
