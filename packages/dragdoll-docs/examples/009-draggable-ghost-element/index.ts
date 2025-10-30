import { Draggable, KeyboardMotionSensor, PointerSensor } from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => {
    // Clone the element and align the clone with the original element.
    const elemRect = element.getBoundingClientRect();
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.width = `${elemRect.width}px`;
    clone.style.height = `${elemRect.height}px`;
    clone.style.left = `${elemRect.left}px`;
    clone.style.top = `${elemRect.top}px`;

    // Add the ghost and dragging class to the clone. The ghost element will be
    // in dragging state for the duration of its existence.
    clone.classList.add('ghost', 'dragging');

    // We need to reset the transform to avoid the ghost element being offset
    // unintentionally. In this specific case, if we don't reset the transform,
    // the ghost element will be offset by the original element's transform.
    clone.style.transform = '';

    // Append the ghost element to the body.
    document.body.appendChild(clone);

    return [clone];
  },
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: (drag) => {
    const dragItem = drag.items[0];

    // Move the original element to the ghost element's position. We use DOMMatrix
    // to first combine the original element's transform with the ghost element's
    // transform and then apply the combined transform to the original element.
    const matrix = new DOMMatrix().setMatrixValue(
      `translate(${dragItem.position.x}px, ${dragItem.position.y}px) ${element.style.transform}`,
    );
    element.style.transform = `${matrix}`;

    // Remove the ghost element.
    dragItem.element.remove();

    element.classList.remove('dragging');
  },
});
