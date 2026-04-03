/** @jsxImportSource solid-js */
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

function DraggableCard(props: { axis: 'x' | 'y'; nextZIndex: () => number }) {
  let element: HTMLDivElement | null = null;
  const [zIndex, setZIndex] = createSignal(1);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = {
    elements: () => (element ? [element] : []),
    positionModifiers: [
      (change) => {
        if (props.axis === 'x') change.y = 0;
        else change.x = 0;
        return change;
      },
    ],
    onStart: () => {
      setZIndex(props.nextZIndex());
    },
  };

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLDivElement) => {
    element = node;
    setPointerSensorRef(node);
    setKeyboardSensorRef(node);
  };

  const axisClass = props.axis === 'x' ? 'axis-x' : 'axis-y';
  const svgPath =
    props.axis === 'x'
      ? 'M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z'
      : 'M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3l0 293.5L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7l0-293.5 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z';
  const svgViewBox = props.axis === 'x' ? '0 0 512 512' : '0 0 320 512';

  return (
    <div
      ref={setRefs}
      class={`card draggable ${axisClass} ${drag() ? 'dragging' : ''}`}
      style={{ 'z-index': zIndex() }}
      tabIndex={0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox}>
        <path d={svgPath} />
      </svg>
    </div>
  );
}

function App() {
  let currentZIndex = 1;
  const nextZIndex = () => ++currentZIndex;

  return (
    <>
      <DraggableCard axis="x" nextZIndex={nextZIndex} />
      <DraggableCard axis="y" nextZIndex={nextZIndex} />
    </>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
