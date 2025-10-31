import { DndContextProvider, Draggable, Droppable } from 'dragdoll-react';
import { StrictMode, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DRAG_IDS = ['card-1', 'card-2', 'card-3'];
const DROP_IDS = ['drop-1', 'drop-2', 'drop-3'];

function DraggableBoard() {
  const zIndexRef = useRef(0);

  const handleStart = () => {
    document.querySelectorAll('.droppable').forEach((zone) => {
      zone.classList.remove('draggable-over', 'draggable-dropped');
    });
  };

  return (
    <DndContextProvider
      onStart={({ draggable }) => {
        handleStart();
        const element = draggable.drag?.items[0].element;
        if (element) {
          element.classList.add('dragging');
          element.style.zIndex = `${++zIndexRef.current}`;
        }
      }}
      onCollide={({ contacts }) => {
        document.querySelectorAll('.droppable').forEach((zone) => {
          zone.classList.remove('draggable-over');
        });
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-over');
        }
      }}
      onEnd={({ draggable, contacts }) => {
        const element = draggable.drag?.items[0].element;
        if (element) {
          element.classList.remove('dragging');
        }
        document.querySelectorAll('.droppable').forEach((zone) => {
          zone.classList.remove('draggable-over');
        });
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-dropped');
        }
      }}
    >
      <section className="draggables">
        {DRAG_IDS.map((id) => (
          <Draggable key={id} id={id} pointerSensor keyboardSensor>
            <button className="card draggable" type="button" aria-label={id.toUpperCase()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
              </svg>
            </button>
          </Draggable>
        ))}
      </section>
      <section className="droppables">
        {DROP_IDS.map((id) => (
          <Droppable key={id} id={id}>
            {({ ref }) => <div ref={ref} className="droppable" aria-label={id.toUpperCase()} />}
          </Droppable>
        ))}
      </section>
    </DndContextProvider>
  );
}

function App() {
  return <DraggableBoard />;
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
