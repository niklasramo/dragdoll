import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function LockedAxisCards() {
  const zIndexRef = useRef(0);
  const modifiers = useMemo(
    () => [
      (change: { x: number; y: number }, { item }: any) => {
        const allowX = item.element.classList.contains('axis-x');
        const allowY = item.element.classList.contains('axis-y');
        if (allowX && !allowY) change.y = 0;
        if (allowY && !allowX) change.x = 0;
        return change;
      },
    ],
    [],
  );

  return (
    <div className="cards">
      {['axis-x', 'axis-y'].map((axis) => (
        <Draggable
          key={axis}
          pointerSensor
          keyboardSensor
          positionModifiers={modifiers}
          onStart={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.add('dragging');
              item.element.style.zIndex = `${++zIndexRef.current}`;
            });
          }}
          onEnd={(drag) => {
            drag.items.forEach((item) => item.element.classList.remove('dragging'));
          }}
        >
          <button className={`card draggable ${axis}`} type="button" aria-label={axis} />
        </Draggable>
      ))}
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <LockedAxisCards />
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
