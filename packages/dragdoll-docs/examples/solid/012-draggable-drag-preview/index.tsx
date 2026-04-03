/** @jsxImportSource solid-js */
import { getLocalOffset } from 'dragdoll';
import {
  DragPreview,
  useDraggable,
  useDraggableAutoScroll,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { For } from 'solid-js';
import { render } from 'solid-js/web';

let zIndex = 0;

function DraggableCard(props: { getScrollContainer: () => HTMLElement | null }) {
  let cardElement: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], {
      elements: () => (cardElement ? [cardElement] : []),
      dragPreview: true,
      onEnd: (drag: { items: { clientRect: { x: number; y: number } }[] }) => {
        const item = drag.items[0];
        if (!cardElement || !item) return;

        const offset = getLocalOffset(cardElement, item.clientRect.x, item.clientRect.y);
        const translateParts = (getComputedStyle(cardElement).translate || '').split(' ');
        const x = (parseFloat(translateParts[0]) || 0) + offset.x;
        const y = (parseFloat(translateParts[1]) || 0) + offset.y;
        cardElement.style.translate = `${x}px ${y}px`;
        cardElement.style.zIndex = String(++zIndex);
      },
    }),
    {
      targets: () => {
        const el = props.getScrollContainer();
        return el
          ? [{ element: el, axis: 'y' as const, padding: { top: Infinity, bottom: Infinity } }]
          : [];
      },
    },
  );

  const drag = useDraggableDrag(draggable);

  return (
    <>
      <div
        ref={(node) => {
          cardElement = node;
          setPointerSensorRef(node);
          setKeyboardSensorRef(node);
        }}
        class={`card draggable ${drag() ? 'dragging' : ''}`}
        tabIndex={0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
        </svg>
      </div>
      <DragPreview draggable={draggable}>
        <div class="preview-content">PREVIEW</div>
      </DragPreview>
    </>
  );
}

const CARDS = [0, 1, 2, 3, 4, 5];

function App() {
  let scrollContainer: HTMLDivElement | null = null;

  return (
    <div class="transform-outer">
      <div ref={(el) => (scrollContainer = el)} class="transform-inner">
        <div class="scroll-content">
          <For each={CARDS}>
            {() => <DraggableCard getScrollContainer={() => scrollContainer} />}
          </For>
        </div>
      </div>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
