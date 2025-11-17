import {
  useDraggable,
  useDraggableAutoScroll,
  UseDraggableAutoScrollSettings,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  dragContainerRef,
}: {
  dragContainerRef: RefObject<HTMLElement | null>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor({
    computeSpeed: () => 100,
  });

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      // We are doing the very thing here we advise against in the docs. We use
      // the container option and provide a React controlled element to the
      // elements option. However, in this case this will work without any
      // issues because we are making sure React has no reason to move the
      // dragged element in the DOM during the drag.
      container: () => dragContainerRef.current || null,
      elements: () => (elementRef.current ? [elementRef.current] : []),
      frozenStyles: () => ['left', 'top'],
    }),
    [dragContainerRef],
  );

  const autoScrollSettings: UseDraggableAutoScrollSettings = useMemo(
    () => ({
      targets: [
        {
          element: window,
          axis: 'y',
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    }),
    [],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], draggableSettings),
    autoScrollSettings,
  );

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
  const dragContainerRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div className="drag-container-outer">
        <div ref={dragContainerRef} className="drag-container" />
      </div>
      <div className="card-container-outer">
        <div className="card-container">
          <DraggableCardMemo key="card" dragContainerRef={dragContainerRef} />
        </div>
      </div>
    </>
  );
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
