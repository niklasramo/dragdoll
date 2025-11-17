import {
  useDraggable,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  id,
  elementRefsMap,
}: {
  id: number;
  elementRefsMap: RefObject<Map<number, HTMLDivElement | null>>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => {
        return Array.from(elementRefsMap.current.values()).filter((ref) => !!ref);
      },
      startPredicate: () => {
        return !elementRef.current?.classList.contains('dragging');
      },
      onStart: (drag) => {
        drag.items.forEach((item) => {
          item.element.classList.add('dragging');
        });
      },
      onEnd: (drag) => {
        drag.items.forEach((item) => {
          item.element.classList.remove('dragging');
        });
      },
    }),
    [elementRefsMap],
  );

  useDraggable([pointerSensor, keyboardSensor], draggableSettings);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorRef(node);
      setKeyboardSensorRef(node);
      if (node) {
        elementRefsMap.current.set(id, node);
      } else {
        elementRefsMap.current.delete(id);
      }
    },
    [elementRefsMap, id, setPointerSensorRef, setKeyboardSensorRef],
  );

  return (
    <div ref={setRefs} className="card draggable" tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  const elementRefsMap = useRef<Map<number, HTMLDivElement | null>>(new Map());
  return (
    <>
      {[0, 1, 2, 3].map((id) => (
        <DraggableCardMemo key={id} id={id} elementRefsMap={elementRefsMap} />
      ))}
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
