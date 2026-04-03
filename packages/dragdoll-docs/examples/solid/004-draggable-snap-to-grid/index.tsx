/** @jsxImportSource solid-js */
import { createSnapModifier } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  useKeyboardSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { render } from 'solid-js/web';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardSensor({
    moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
  });

  const draggable = useDraggable([pointerSensor, keyboardSensor], {
    elements: () => (element ? [element] : []),
    positionModifiers: [createSnapModifier(GRID_WIDTH, GRID_HEIGHT)],
  });

  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLDivElement) => {
    element = node;
    setPointerSensorRef(node);
    setKeyboardSensorRef(node);
  };

  return (
    <div ref={setRefs} class={`card draggable ${drag() ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

function App() {
  return <DraggableCard />;
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
