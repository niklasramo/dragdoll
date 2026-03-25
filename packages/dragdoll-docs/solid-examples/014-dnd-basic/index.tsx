/** @jsxImportSource solid-js */
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableDrag,
  useDroppable,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal, For } from 'solid-js';
import { render } from 'solid-js/web';

// Shared mutable counter — Solid components run once so this is stable.
let currentZIndex = 1;

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [zIndex, setZIndex] = createSignal(1);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  // Settings object is created once (Solid components don't re-run).
  const draggable = useDraggable([pointerSensor, keyboardSensor], {
    elements: () => (element ? [element] : []),
    startPredicate: () => !element?.classList.contains('dragging'),
    onStart: () => {
      setZIndex(++currentZIndex);
    },
  });

  const drag = useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
        setKeyboardSensorRef(node);
      }}
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      style={{ 'z-index': zIndex() }}
      tabIndex={0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

function DropZone() {
  // Each DropZone creates its own data object — stable since component runs once.
  const [_droppable, setDroppableRef] = useDroppable({
    data: {
      overIds: new Set<number>(),
      droppedIds: new Set<number>(),
    },
  });

  return <div ref={setDroppableRef} class="droppable" />;
}

const DRAGGABLES = [0, 1, 2, 3];
const DROPPABLES = [0, 1, 2, 3];

function App() {
  const dndObserver = useDndObserver({
    onStart: (data) => {
      const { draggable, targets } = data;
      targets.forEach((droppable) => {
        droppable.data.droppedIds.delete(draggable.id);
        if (droppable.data.droppedIds.size === 0) {
          droppable.element?.classList.remove('draggable-dropped');
        }
      });
    },

    onCollide: (data) => {
      const { draggable, contacts, removedContacts } = data;

      removedContacts.forEach((target) => {
        target.data.overIds.delete(draggable.id);
        if (target.data.overIds.size === 0) {
          target.element?.classList.remove('draggable-over');
        }
      });

      let i = 0;
      for (const droppable of contacts) {
        if (i === 0) {
          droppable.data.overIds.add(draggable.id);
          droppable.element?.classList.add('draggable-over');
        } else {
          droppable.data.overIds.delete(draggable.id);
          if (droppable.data.overIds.size === 0) {
            droppable.element?.classList.remove('draggable-over');
          }
        }
        ++i;
      }
    },

    onEnd: (data) => {
      const { draggable, contacts } = data;
      for (const droppable of contacts) {
        droppable.data.droppedIds.add(draggable.id);
        droppable.element?.classList.add('draggable-dropped');
        droppable.data.overIds.delete(draggable.id);
        if (droppable.data.overIds.size === 0) {
          droppable.element?.classList.remove('draggable-over');
        }
        return;
      }
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div class="draggables">
        <For each={DRAGGABLES}>{() => <DraggableCard />}</For>
      </div>
      <div class="droppables">
        <For each={DROPPABLES}>{() => <DropZone />}</For>
      </div>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
