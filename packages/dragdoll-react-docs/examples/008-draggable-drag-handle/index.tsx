import type { Sensor } from 'dragdoll';
import { KeyboardSensor, PointerSensor } from 'dragdoll';
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function DragHandleCard() {
  const [buttonNode, setButtonNode] = useState<HTMLButtonElement | null>(null);
  const [handleNode, setHandleNode] = useState<HTMLDivElement | null>(null);
  const [sensors, setSensors] = useState<Sensor[] | undefined>(undefined);

  useEffect(() => {
    if (!buttonNode || !handleNode) return;
    if (sensors) return;
    setSensors([new PointerSensor(handleNode), new KeyboardSensor(buttonNode)]);
  }, [buttonNode, handleNode, sensors]);

  const { ref } = useDraggable({
    element: sensors ? buttonNode : null,
    pointerSensor: false,
    keyboardSensor: false,
    sensors,
    onStart: (drag) => {
      const element = drag.items[0].element;
      element.classList.add('dragging');
      if (drag.sensor instanceof PointerSensor) {
        element.classList.add('pointer-dragging');
      } else {
        element.classList.add('keyboard-dragging');
      }
    },
    onEnd: (drag) => {
      const element = drag.items[0].element;
      element.classList.remove('dragging', 'pointer-dragging', 'keyboard-dragging');
    },
  });

  useEffect(() => {
    if (!buttonNode || !sensors) return;
    ref(buttonNode);
    return () => {
      ref(null);
    };
  }, [buttonNode, sensors, ref]);

  const handleButtonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonNode(node);
  }, []);

  const handleHandleRef = useCallback((node: HTMLDivElement | null) => {
    setHandleNode(node);
    if (!node) {
      setSensors(undefined);
    }
  }, []);

  return (
    <button
      ref={handleButtonRef}
      className="card draggable"
      type="button"
      aria-label="Handle draggable"
    >
      <div ref={handleHandleRef} className="handle" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            fill="currentColor"
            d="M32 96C32 60.7 60.7 32 96 32h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V96zm256 0c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V96zM32 320c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V320zm256 0c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V320z"
          />
        </svg>
      </div>
    </button>
  );
}

function App() {
  return (
    <DndContextProvider>
      <DragHandleCard />
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
