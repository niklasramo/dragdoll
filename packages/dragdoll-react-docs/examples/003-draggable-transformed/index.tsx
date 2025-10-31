import { autoScrollPlugin } from 'dragdoll';
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function TransformedCard() {
  const dragContainerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const { draggable, ref } = useDraggable({
    element: elementRef.current,
    pointerSensor: true,
    keyboardMotionSensor: { computeSpeed: () => 100 },
    container: dragContainerRef.current,
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
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <>
      <div className="drag-container-outer">
        <div ref={dragContainerRef} className="drag-container" />
      </div>
      <div className="card-container-outer">
        <div className="card-container">
          <div ref={handleRef} className="card draggable" />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <DndContextProvider>
      <TransformedCard />
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
