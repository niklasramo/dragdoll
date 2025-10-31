import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function GhostCard() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { ref } = useDraggable({
    element: buttonRef.current,
    pointerSensor: true,
    keyboardSensor: true,
    elements: () => {
      if (!buttonRef.current) return null;
      const rect = buttonRef.current.getBoundingClientRect();
      const clone = buttonRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.transform = '';
      clone.classList.add('ghost', 'dragging');
      document.body.appendChild(clone);
      return [clone];
    },
    onStart: () => {
      buttonRef.current?.classList.add('dragging');
    },
    onEnd: (drag) => {
      const original = buttonRef.current;
      if (!original) return;

      const ghostItem = drag.items[0];
      const existing = original.style.transform || '';
      const matrix = new DOMMatrix().setMatrixValue(
        `translate(${ghostItem.position.x}px, ${ghostItem.position.y}px) ${existing}`,
      );
      original.style.transform = `${matrix}`;

      ghostItem.element.remove();
      original.classList.remove('dragging');
    },
  });

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <button ref={handleRef} className="card draggable" type="button" aria-label="Ghost draggable" />
  );
}

function App() {
  return (
    <DndContextProvider>
      <GhostCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
