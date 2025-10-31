import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const ICONS = ['🪩', '🎯', '🎲', '💿'];

function BasicDraggables() {
  const zIndexRef = useRef(0);

  return (
    <div className="cards">
      {ICONS.map((icon, index) => (
        <Draggable
          key={icon}
          id={`card-${index}`}
          pointerSensor
          keyboardSensor
          keyboardMotionSensor
          onStart={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.add('dragging');
              item.element.style.zIndex = `${++zIndexRef.current}`;
            });
          }}
          onEnd={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.remove('dragging');
            });
          }}
        >
          <button className="card draggable" type="button" aria-label={`Card ${index + 1}`}>
            {icon}
          </button>
        </Draggable>
      ))}
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <BasicDraggables />
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
