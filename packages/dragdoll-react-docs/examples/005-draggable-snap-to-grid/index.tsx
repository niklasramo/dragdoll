import { createSnapModifier } from 'dragdoll';
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const GRID = 40;

function SnapCard() {
  return (
    <Draggable
      pointerSensor
      keyboardSensor={{ moveDistance: { x: GRID, y: GRID } }}
      positionModifiers={[createSnapModifier(GRID, GRID)]}
      onStart={(drag) => drag.items[0].element.classList.add('dragging')}
      onEnd={(drag) => drag.items[0].element.classList.remove('dragging')}
    >
      <button className="card draggable" type="button" aria-label="Snap draggable" />
    </Draggable>
  );
}

function App() {
  return (
    <DndContextProvider>
      <SnapCard />
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
