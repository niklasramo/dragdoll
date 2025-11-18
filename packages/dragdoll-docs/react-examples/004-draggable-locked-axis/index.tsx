import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  axis,
  zIndexRef,
}: {
  axis: 'x' | 'y';
  zIndexRef: RefObject<number>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [zIndex, setZIndex] = useState(1);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      positionModifiers: [
        (change, { item }) => {
          const { element } = item;
          const allowX = element.classList.contains('axis-x');
          const allowY = element.classList.contains('axis-y');
          if (allowX && !allowY) {
            change.y = 0;
          } else if (allowY && !allowX) {
            change.x = 0;
          }
          return change;
        },
      ],
      onStart: () => {
        setZIndex(++zIndexRef.current);
      },
    }),
    [zIndexRef],
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

  const axisClass = axis === 'x' ? 'axis-x' : 'axis-y';
  const svgPath =
    axis === 'x'
      ? 'M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z'
      : 'M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3l0 293.5L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7l0-293.5 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z';
  const svgViewBox = axis === 'x' ? '0 0 512 512' : '0 0 320 512';

  return (
    <div
      ref={setRefs}
      className={`card draggable ${axisClass} ${drag ? 'dragging' : ''}`}
      style={{ zIndex }}
      tabIndex={0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox}>
        <path d={svgPath} />
      </svg>
    </div>
  );
});

function App() {
  const zIndexRef = useRef(1);
  return (
    <>
      <DraggableCardMemo axis="x" zIndexRef={zIndexRef} />
      <DraggableCardMemo axis="y" zIndexRef={zIndexRef} />
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
