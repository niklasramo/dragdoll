import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => {
        const element = elementRef.current;
        if (!element) return [];

        // Clone the element and align the clone with the original element.
        const elemRect = element.getBoundingClientRect();
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.width = `${elemRect.width}px`;
        clone.style.height = `${elemRect.height}px`;
        clone.style.left = `${elemRect.left}px`;
        clone.style.top = `${elemRect.top}px`;

        // Add the ghost and dragging class to the clone. The ghost element will
        // be in dragging state for the duration of its existence.
        clone.classList.add('ghost', 'dragging');

        // We need to reset the transform to avoid the ghost element being
        // offset unintentionally. In this specific case, if we don't reset the
        // transform, the ghost element will be offset by the original element's
        // transform.
        clone.style.transform = '';

        // Append the ghost element to the body.
        document.body.appendChild(clone);

        return [clone];
      },

      onEnd: (drag) => {
        const element = elementRef.current;
        if (!element) return;

        const dragItem = drag.items[0];

        // Move the original element to the ghost element's position. We use
        // DOMMatrix to first combine the original element's transform with the
        // ghost element's transform and then apply the combined transform to the
        // original element.
        const matrix = new DOMMatrix().setMatrixValue(
          `translate(${dragItem.position.x}px, ${dragItem.position.y}px) ${element.style.transform}`,
        );
        element.style.transform = `${matrix}`;

        // Remove the ghost element.
        dragItem.element.remove();
      },
    }),
    [],
  );

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);

  const drag = useDraggableDrag(draggable);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorRef(node);
      setKeyboardSensorRef(node);
    },
    [setPointerSensorRef, setKeyboardSensorRef],
  );

  return (
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  return <DraggableCardMemo />;
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
