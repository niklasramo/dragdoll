import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const CARD_IDS = ['card-1', 'card-2', 'card-3', 'card-4'];

interface MultiCardProps {
  id: string;
  register: (id: string, node: HTMLButtonElement | null) => void;
  getElements: () => (HTMLElement | SVGSVGElement)[];
  zIndexRef: React.MutableRefObject<number>;
}

function MultiDraggableCard({ id, register, getElements, zIndexRef }: MultiCardProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null);

  const { ref } = useDraggable({
    element,
    id,
    pointerSensor: true,
    keyboardSensor: true,
    elements: getElements,
    startPredicate: () => {
      return element ? !element.classList.contains('dragging') : true;
    },
    onStart: (drag) => {
      drag.items.forEach((dragItem) => {
        dragItem.element.classList.add('dragging');
        dragItem.element.style.zIndex = `${++zIndexRef.current}`;
      });
    },
    onEnd: (drag) => {
      drag.items.forEach((dragItem) => {
        dragItem.element.classList.remove('dragging');
      });
    },
  });

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      setElement(node);
      register(id, node);
      ref(node);
    },
    [id, ref, register],
  );

  return (
    <button ref={handleRef} id={id} className="card draggable" type="button" aria-label={id} />
  );
}

function MultipleCards() {
  const elementsMap = useRef(new Map<string, HTMLButtonElement>());
  const zIndexRef = useRef(0);

  const register = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (!node) {
      elementsMap.current.delete(id);
    } else {
      elementsMap.current.set(id, node);
    }
  }, []);

  const getElements = useCallback(
    () =>
      Array.from(elementsMap.current.values()).filter(Boolean) as (HTMLElement | SVGSVGElement)[],
    [],
  );

  return (
    <div className="cards">
      {CARD_IDS.map((id) => (
        <MultiDraggableCard
          key={id}
          id={id}
          register={register}
          getElements={getElements}
          zIndexRef={zIndexRef}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <MultipleCards />
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
