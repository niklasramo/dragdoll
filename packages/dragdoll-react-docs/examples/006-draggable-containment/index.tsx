import { createContainmentModifier } from 'dragdoll';
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function ContainedCard() {
  return (
    <Draggable
      pointerSensor
      keyboardSensor
      positionModifiers={[
        createContainmentModifier(() => ({
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        })),
      ]}
      onStart={(drag) => drag.items[0].element.classList.add('dragging')}
      onEnd={(drag) => drag.items[0].element.classList.remove('dragging')}
    >
      <button className="card draggable" type="button" aria-label="Contained draggable" />
    </Draggable>
  );
}

function App() {
  return (
    <DndContextProvider>
      <ContainedCard />
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
