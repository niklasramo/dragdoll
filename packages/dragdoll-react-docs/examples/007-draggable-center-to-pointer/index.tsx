import { PointerSensor } from 'dragdoll';
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

function CenterCard() {
  const modifiers = useMemo(
    () => [
      (change: { x: number; y: number }, { drag, item, phase }: any) => {
        if (
          phase === 'start' &&
          drag.sensor instanceof PointerSensor &&
          drag.items[0].element === item.element
        ) {
          const { clientRect } = item;
          const { x, y } = drag.startEvent;
          change.x = x - (clientRect.x + clientRect.width / 2);
          change.y = y - (clientRect.y + clientRect.height / 2);
        }
        return change;
      },
    ],
    [],
  );

  return (
    <Draggable
      pointerSensor
      keyboardSensor
      positionModifiers={modifiers}
      onStart={(drag) => drag.items[0].element.classList.add('dragging')}
      onEnd={(drag) => drag.items[0].element.classList.remove('dragging')}
    >
      <button className="card draggable" type="button" aria-label="Centered draggable" />
    </Draggable>
  );
}

function App() {
  return (
    <DndContextProvider>
      <CenterCard />
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
