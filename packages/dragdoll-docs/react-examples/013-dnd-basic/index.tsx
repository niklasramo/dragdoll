import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useDroppable,
  UseDroppableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  zIndexRef,
}: {
  zIndexRef: RefObject<number>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [zIndex, setZIndex] = useState(1);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      startPredicate: () => !elementRef.current?.classList.contains('dragging'),
      onStart: () => {
        setZIndex(++zIndexRef.current);
      },
    }),
    [zIndexRef],
  );

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);

  const drag = useDraggableDrag(draggable);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorRef(node);
      setKeyboardSensorRef(node);
    },
    [setPointerSensorRef, setKeyboardSensorRef],
  );

  return (
    <div
      ref={setRefs}
      className={`card draggable ${drag ? 'dragging' : ''}`}
      style={{ zIndex }}
      tabIndex={0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

const DropZoneMemo = memo(function DropZone() {
  const droppableSettings: UseDroppableSettings = useMemo(
    () => ({
      data: {
        overIds: new Set<number>(),
        droppedIds: new Set<number>(),
      },
    }),
    [],
  );

  const [_droppable, setDroppableElementRef] = useDroppable(droppableSettings);

  return <div ref={setDroppableElementRef} className="droppable" />;
});

function App() {
  const zIndexRef = useRef(1);
  const dndObserver = useDndObserver({
    // On drag start loop through all target droppables and remove the draggable id
    // from the dropped ids set. If the dropped ids set is empty, remove the
    // "draggable-dropped" class from the droppable element.
    onStart: (data) => {
      const { draggable, targets } = data;
      targets.forEach((droppable) => {
        droppable.data.droppedIds.delete(draggable.id);
        if (droppable.data.droppedIds.size === 0) {
          droppable.element?.classList.remove('draggable-dropped');
        }
      });
    },

    // On each collision change, keep track of the overIds set for each droppable
    // and update the "draggable-over" class based on the over ids set.
    onCollide: (data) => {
      const { draggable, contacts, removedContacts } = data;

      // Remove the draggable id from the droppables that stopped colliding and
      // remove the "draggable-over" class from the droppable element if there are
      // no more draggable ids in the over ids set.
      removedContacts.forEach((target) => {
        target.data.overIds.delete(draggable.id);
        if (target.data.overIds.size === 0) {
          target.element?.classList.remove('draggable-over');
        }
      });

      // Add the draggable to the first colliding droppable (best match), and remove
      // the draggable from the other colliding droppables. Update the
      // "draggable-over" class based on the over ids set.
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

    // For the first colliding droppable (best match), add the draggable id to the
    // dropped ids set, add the "draggable-dropped" class to the droppable
    // element, and remove the draggable id from the over ids set. If the over ids
    // set is empty, remove the "draggable-over" class from the droppable element.
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
      <div className="draggables">
        {[0, 1, 2, 3].map((id) => (
          <DraggableCardMemo key={id} zIndexRef={zIndexRef} />
        ))}
      </div>
      <div className="droppables">
        {[0, 1, 2, 3].map((id) => (
          <DropZoneMemo key={id} />
        ))}
      </div>
    </DndObserverContext.Provider>
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
