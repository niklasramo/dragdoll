/** @jsxImportSource solid-js */
import { getLocalOffset } from 'dragdoll';
import {
  DragPreview,
  useDraggable,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { For } from 'solid-js';
import { render } from 'solid-js/web';

const LABELS = ['skew(-8deg)', 'rotate(12deg)', 'skew(5deg) rotate(-6deg)'];
const ITEM_COUNT = 3;

function Card(props: { id: number; elementRefs: (HTMLDivElement | null)[]; isDragging: boolean }) {
  return (
    <div
      ref={(node) => {
        props.elementRefs[props.id] = node;
      }}
      class={`card draggable ${props.isDragging ? 'dragging' : ''}`}
      tabIndex={0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

function App() {
  const cardElementRefs: (HTMLDivElement | null)[] = new Array(ITEM_COUNT).fill(null);
  const containerRefs: (HTMLDivElement | null)[] = new Array(ITEM_COUNT).fill(null);

  const sensorSettings = {
    startPredicate: (e: Event) => {
      if ('button' in e && (e as MouseEvent).button > 0) return false;
      const target = e.target as Element | null;
      if (!target) return false;
      return containerRefs.some((container) => container?.contains(target));
    },
  };

  const keyboardSensorSettings = {
    startPredicate: () => {
      const focused = document.activeElement;
      if (!focused) return null;
      const card = cardElementRefs.find((el) => el?.contains(focused));
      if (!card) return null;
      const { left, top } = card.getBoundingClientRect();
      return { x: left, y: top };
    },
  };

  const [pointerSensor] = usePointerSensor(sensorSettings, window);
  const [keyboardSensor] = useKeyboardMotionSensor(keyboardSensorSettings, null);

  const draggableSettings = {
    dragPreview: true,
    elements: () => cardElementRefs.filter((el): el is HTMLDivElement => !!el),
    onEnd: (drag: { items: { clientRect: { x: number; y: number } }[] }) => {
      const items = drag.items;
      const xTranslations: number[] = [];
      const yTranslations: number[] = [];

      // Compute all the translations first in a single pass. This way we
      // don't cause extra reflows by updating the style of one element at a
      // time.
      for (let i = 0; i < items.length; i++) {
        const cardElement = cardElementRefs[i];
        const item = items[i];
        if (!cardElement || !item) continue;

        // Align the card element to the final viewport position of the drag
        // preview.
        const offset = getLocalOffset(cardElement, item.clientRect.x, item.clientRect.y);
        const translateParts = (getComputedStyle(cardElement).translate || '').split(' ');
        xTranslations[i] = (parseFloat(translateParts[0]) || 0) + offset.x;
        yTranslations[i] = (parseFloat(translateParts[1]) || 0) + offset.y;
      }

      // Apply all the translations in a single pass.
      for (let i = 0; i < items.length; i++) {
        const cardElement = cardElementRefs[i];
        if (!cardElement) continue;
        cardElement.style.translate = `${xTranslations[i]}px ${yTranslations[i]}px`;
      }
    },
  };

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  return (
    <>
      <For each={[0, 1, 2]}>
        {(id) => (
          <div ref={(node) => (containerRefs[id] = node)} class="container">
            <div class="container-inner">
              <Card id={id} elementRefs={cardElementRefs} isDragging={!!drag()} />
            </div>
            <div class="container-label">{LABELS[id]}</div>
          </div>
        )}
      </For>
      <DragPreview draggable={draggable}>
        {({ index }) => <div class="preview-content">ITEM {index + 1}</div>}
      </DragPreview>
    </>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
