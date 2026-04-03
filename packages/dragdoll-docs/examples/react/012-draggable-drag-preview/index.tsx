import { getLocalOffset } from 'dragdoll';
import {
  DragPreview,
  useDraggable,
  useDraggableAutoScroll,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

let zIndex = 0;

const DraggableCardMemo = memo(function DraggableCard({
  scrollContainerRef,
}: {
  scrollContainerRef: RefObject<HTMLElement | null>;
}) {
  const cardElementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings = useMemo(
    () => ({
      elements: () => (cardElementRef.current ? [cardElementRef.current] : []),
      dragPreview: true,
      onEnd: (drag: { items: { clientRect: { x: number; y: number } }[] }) => {
        const cardElement = cardElementRef.current;
        const item = drag.items[0];
        if (!cardElement || !item) return;

        // Align the card element to the final viewport position of the drag
        // preview.
        const offset = getLocalOffset(cardElement, item.clientRect.x, item.clientRect.y);
        const translateParts = (getComputedStyle(cardElement).translate || '').split(' ');
        const x = (parseFloat(translateParts[0]) || 0) + offset.x;
        const y = (parseFloat(translateParts[1]) || 0) + offset.y;
        cardElement.style.translate = `${x}px ${y}px`;
        cardElement.style.zIndex = String(++zIndex);
      },
    }),
    [],
  );

  const autoScrollSettings = useMemo(
    () => ({
      targets: () => {
        const el = scrollContainerRef.current;
        return el
          ? [{ element: el, axis: 'y' as const, padding: { top: Infinity, bottom: Infinity } }]
          : [];
      },
    }),
    [scrollContainerRef],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], draggableSettings),
    autoScrollSettings,
  );

  const drag = useDraggableDrag(draggable);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      cardElementRef.current = node;
      setPointerSensorRef(node);
      setKeyboardSensorRef(node);
    },
    [setPointerSensorRef, setKeyboardSensorRef],
  );

  return (
    <>
      <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
        </svg>
      </div>
      <DragPreview draggable={draggable}>
        <div className="preview-content">PREVIEW</div>
      </DragPreview>
    </>
  );
});

function App() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="transform-outer">
      <div ref={scrollContainerRef} className="transform-inner">
        <div className="scroll-content">
          {[0, 1, 2, 3, 4, 5].map((id) => (
            <DraggableCardMemo key={id} scrollContainerRef={scrollContainerRef} />
          ))}
        </div>
      </div>
    </div>
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
