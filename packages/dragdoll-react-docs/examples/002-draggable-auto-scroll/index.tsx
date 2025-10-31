import { autoScrollPlugin } from 'dragdoll';
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function AutoScrollCard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLButtonElement | null>(null);

  const { draggable, ref } = useDraggable({
    element: elementRef.current,
    pointerSensor: true,
    keyboardMotionSensor: { computeSpeed: () => 100 },
    container: containerRef.current,
    frozenStyles: () => ['left', 'top'],
    onStart: (drag) => {
      drag.items[0].element.classList.add('dragging');
    },
    onEnd: (drag) => {
      drag.items[0].element.classList.remove('dragging');
    },
  });

  useEffect(() => {
    if (!draggable) return;

    draggable.use(
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
  }, [draggable]);

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <>
      <div ref={containerRef} className="drag-container" />
      <div className="card-container">
        <button ref={handleRef} className="card draggable" type="button" aria-label="Draggable" />
      </div>
    </>
  );
}

function App() {
  return (
    <DndContextProvider>
      <AutoScrollCard />
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
