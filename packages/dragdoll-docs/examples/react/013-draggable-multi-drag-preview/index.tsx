import { getLocalOffset } from 'dragdoll';
import {
  DragPreview,
  useDraggable,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const LABELS = ['skew(-8deg)', 'rotate(12deg)', 'skew(5deg) rotate(-6deg)'];
const ITEM_COUNT = 3;

function Card({
  id,
  elementRefs,
  isDragging,
}: {
  id: number;
  elementRefs: React.RefObject<(HTMLDivElement | null)[]>;
  isDragging: boolean;
}) {
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRefs.current[id] = node;
    },
    [elementRefs, id],
  );

  return (
    <div ref={setRef} className={`card draggable ${isDragging ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

function App() {
  const cardElementRefs = useRef<(HTMLDivElement | null)[]>(new Array(ITEM_COUNT).fill(null));
  const containerRefs = useRef<(HTMLDivElement | null)[]>(new Array(ITEM_COUNT).fill(null));

  const sensorSettings = useMemo(
    () => ({
      startPredicate: (e: Event) => {
        if ('button' in e && (e as MouseEvent).button > 0) return false;
        const target = e.target as Element | null;
        if (!target) return false;
        return containerRefs.current.some((container) => container?.contains(target));
      },
    }),
    [],
  );

  const keyboardSensorSettings = useMemo(
    () => ({
      startPredicate: () => {
        const focused = document.activeElement;
        if (!focused) return null;
        const card = cardElementRefs.current.find((el) => el?.contains(focused));
        if (!card) return null;
        const { left, top } = card.getBoundingClientRect();
        return { x: left, y: top };
      },
    }),
    [],
  );

  const [pointerSensor] = usePointerSensor(sensorSettings, window);
  const [keyboardSensor] = useKeyboardMotionSensor(keyboardSensorSettings, null);

  const draggableSettings = useMemo(
    () => ({
      dragPreview: true,
      elements: () => cardElementRefs.current.filter((el): el is HTMLDivElement => !!el),
      onEnd: (drag: { items: { clientRect: { x: number; y: number } }[] }) => {
        const items = drag.items;
        const xTranslations: number[] = [];
        const yTranslations: number[] = [];

        // Compute all the translations first in a single pass. This way we
        // don't cause extra reflows by updating the style of one element at a
        // time.
        for (let i = 0; i < items.length; i++) {
          const cardElement = cardElementRefs.current[i];
          const item = items[i];
          if (!cardElement || !item) continue;

          // Align the card element to the final viewport position of the drag
          // preview.
          const offset = getLocalOffset(cardElement, item.clientRect.x, item.clientRect.y);
          const translateParts = (getComputedStyle(cardElement).translate || '').split(' ');
          xTranslations[i] = (parseFloat(translateParts[0]) || 0) + offset.x;
          yTranslations[i] = (parseFloat(translateParts[1]) || 0) + offset.y;
        }

        // Apply all the translations in a single pass.
        for (let i = 0; i < items.length; i++) {
          const cardElement = cardElementRefs.current[i];
          if (!cardElement) continue;
          cardElement.style.translate = `${xTranslations[i]}px ${yTranslations[i]}px`;
        }
      },
    }),
    [],
  );

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setContainerRef = useCallback((id: number, node: HTMLDivElement | null) => {
    containerRefs.current[id] = node;
  }, []);

  return (
    <>
      {[0, 1, 2].map((id) => (
        <div key={id} ref={(node) => setContainerRef(id, node)} className="container">
          <div className="container-inner">
            <Card id={id} elementRefs={cardElementRefs} isDragging={!!drag} />
          </div>
          <div className="container-label">{LABELS[id]}</div>
        </div>
      ))}
      <DragPreview draggable={draggable}>
        {({ index }) => <div className="preview-content">ITEM {index + 1}</div>}
      </DragPreview>
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
