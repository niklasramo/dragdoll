/** @jsxImportSource solid-js */
import {
  useDraggable,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { For } from 'solid-js';
import { render } from 'solid-js/web';

function DraggableCard(props: { id: number; elementRefsMap: Map<number, HTMLDivElement | null> }) {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = {
    elements: () => {
      return Array.from(props.elementRefsMap.values()).filter((ref) => !!ref);
    },
    startPredicate: () => {
      return !element?.classList.contains('dragging');
    },
    onStart: (drag) => {
      drag.items.forEach((item) => {
        item.element.classList.add('dragging');
      });
    },
    onEnd: (drag) => {
      drag.items.forEach((item) => {
        item.element.classList.remove('dragging');
      });
    },
  };

  useDraggable([pointerSensor, keyboardSensor], draggableSettings);

  const setRefs = (node: HTMLDivElement) => {
    element = node;
    setPointerSensorRef(node);
    setKeyboardSensorRef(node);
    props.elementRefsMap.set(props.id, node);
  };

  return (
    <div ref={setRefs} class="card draggable" tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

const CARDS = [0, 1, 2, 3];

function App() {
  const elementRefsMap = new Map<number, HTMLDivElement | null>();
  return (
    <For each={CARDS}>{(id) => <DraggableCard id={id} elementRefsMap={elementRefsMap} />}</For>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
