# Solid Examples

## Solid - Draggable Basic

A minimal setup showcasing multiple draggables powered by the SolidJS bindings.

<div class="example"><iframe src="/dragdoll/solid-examples/001-draggable-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/001-draggable-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import {
  useDraggable,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal, For } from 'solid-js';
import { render } from 'solid-js/web';

function DraggableCard(props: { nextZIndex: () => number }) {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();
  const [zIndex, setZIndex] = createSignal(1);

  const draggable = useDraggable([pointerSensor, keyboardSensor], () => ({
    elements: () => (element ? [element] : []),
    onStart: () => {
      setZIndex(props.nextZIndex());
    },
  }));

  const drag = useDraggableDrag(draggable);

  const setElement = (node: HTMLDivElement | null) => {
    element = node;
    setPointerSensorRef(node);
    setKeyboardSensorRef(node);
  };

  return (
    <div
      ref={setElement}
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

const CARDS = [0, 1, 2, 3];

function App() {
  let currentZIndex = 1;
  const nextZIndex = () => ++currentZIndex;

  return (
    <div class="card-grid">
      <For each={CARDS}>{() => <DraggableCard nextZIndex={nextZIndex} />}</For>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Basic</title>
    <meta
      name="description"
      content="A minimal setup showcasing multiple draggables powered by the SolidJS bindings."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root,
.card-grid {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
}

@media (width < 430px) {
  .card.draggable {
    width: calc((100% - 50px) / 4);
    aspect-ratio: 1 / 1;
    height: auto;
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Auto Scroll & Transforms

Demonstrates auto-scrolling during drag and transparent CSS transform handling. The draggable element is always guaranteed to move in sync with the active sensor, regardless of any CSS transforms or zoom in the document. Auto-scroll kicks in when you drag near the window edges.

<div class="example"><iframe src="/dragdoll/solid-examples/002-draggable-auto-scroll/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/002-draggable-auto-scroll/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import {
  useDraggable,
  useDraggableAutoScroll,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { render } from 'solid-js/web';

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor({
    computeSpeed: () => 100,
  });

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], () => ({
      elements: () => (element ? [element] : []),
    })),
    {
      targets: [
        {
          element: window,
          axis: 'y' as const,
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    },
  );

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
  return (
    <div class="card-container-outer">
      <div class="card-container">
        <DraggableCard />
      </div>
    </div>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Auto Scroll &amp; Transforms</title>
    <meta
      name="description"
      content="Demonstrates auto-scrolling during drag and transparent CSS transform handling. The draggable element is always guaranteed to move in sync with the active sensor, regardless of any CSS transforms or zoom in the document. Auto-scroll kicks in when you drag near the window edges."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  height: 300%;
  overflow-y: auto;
}

.card-container-outer {
  position: absolute;
  inset: 0;
  transform: scale(1.2);
}

.card-container {
  position: absolute;
  inset: 0;
  transform: scale(0.5) skew(-5deg, -5deg);
}

.card.draggable {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) scale(1.2);
  transform-origin: 50% 50%;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Locked Axis

Here we have two elements which can be dragged on one axis only. You can use this example as the basis of building your own custom position modifiers (a powerful feature that allows you to control a dragged element's position at every step of the drag process).

<div class="example"><iframe src="/dragdoll/solid-examples/003-draggable-locked-axis/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/003-draggable-locked-axis/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Locked Axis</title>
    <meta
      name="description"
      content="Here we have two elements which can be dragged on one axis only. You can use this example as the basis of building your own custom position modifiers (a powerful feature that allows you to control a dragged element's position at every step of the drag process)."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;

  &.axis-x {
    cursor: ew-resize;
  }

  &.axis-y {
    cursor: ns-resize;
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Snap To Grid

A simple demo on how to use the built-in snap modifier.

<div class="example"><iframe src="/dragdoll/solid-examples/004-draggable-snap-to-grid/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/004-draggable-snap-to-grid/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Snap To Grid</title>
    <meta name="description" content="A simple demo on how to use the built-in snap modifier." />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  position: relative;
  width: 100%;
  height: 100%;
}

.card.draggable {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Containment

A simple demo on how to use the built-in containment modifier. The first argument of `createContainmentModifier` should be a function that returns the client rect of the containment area. That function is called on every drag 'move' event and also on 'start' and 'end' events. The second argument is a boolean whose value is cached on start event to define if the modifier should track drifting of the sensor when the dragged element hits an edge of the containment area and the sensor keeps on moving away. If the drift is being tracked the draggable element will not be moved to the opposing direction until the sensor is back inside the containment area. By default the drift is tracked only for `PointerSensor`.

<div class="example"><iframe src="/dragdoll/solid-examples/005-draggable-containment/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/005-draggable-containment/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { createContainmentModifier } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { render } from 'solid-js/web';

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggable = useDraggable([pointerSensor, keyboardSensor], {
    elements: () => (element ? [element] : []),
    positionModifiers: [
      createContainmentModifier(() => {
        return {
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      }),
    ],
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Containment</title>
    <meta
      name="description"
      content="A simple demo on how to use the built-in containment modifier. The first argument of `createContainmentModifier` should be a function that returns the client rect of the containment area. That function is called on every drag 'move' event and also on 'start' and 'end' events. The second argument is a boolean whose value is cached on start event to define if the modifier should track drifting of the sensor when the dragged element hits an edge of the containment area and the sensor keeps on moving away. If the drift is being tracked the draggable element will not be moved to the opposing direction until the sensor is back inside the containment area. By default the drift is tracked only for `PointerSensor`."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Combined Modifiers

Demonstrates grid-aware containment. The element has a distance threshold, snaps to a 40px grid, and is contained within the viewport without partial grid cells at the edges.

<div class="example"><iframe src="/dragdoll/solid-examples/006-draggable-combined-modifiers/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/006-draggable-combined-modifiers/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { createContainmentModifier, PointerSensor } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  usePointerSensor,
} from 'dragdoll-solid';
import { render } from 'solid-js/web';

const THRESHOLD = 5;
const GRID = 40;

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggableSettings: UseDraggableSettings<PointerSensor> = {
    elements: () => (element ? [element] : []),
    startPredicate: ({ event }) => {
      const dx = event.x - event.startX;
      const dy = event.y - event.startY;
      return Math.sqrt(dx * dx + dy * dy) >= THRESHOLD ? true : undefined;
    },
    positionModifiers: [
      createContainmentModifier(
        () => ({
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }),
        { snapX: GRID, snapY: GRID },
      ),
    ],
  };

  const draggable = useDraggable([pointerSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLDivElement) => {
    element = node;
    setPointerSensorRef(node);
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Combined Modifiers</title>
    <meta
      name="description"
      content="Demonstrates grid-aware containment. The element has a distance threshold, snaps to a 40px grid, and is contained within the viewport without partial grid cells at the edges."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

.card.draggable {
  position: relative;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Center To Pointer

Here we use a custom position modifier to align the dragged element's center with the pointer sensor's position on drag start.

<div class="example"><iframe src="/dragdoll/solid-examples/007-draggable-center-to-pointer/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/007-draggable-center-to-pointer/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { PointerSensor } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { render } from 'solid-js/web';

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = {
    elements: () => (element ? [element] : []),
    positionModifiers: [
      (change, { drag, item, phase }) => {
        // Align the dragged element so that the pointer
        // is in the center of the element.
        if (phase === 'start' && drag.sensor instanceof PointerSensor) {
          const { clientRect } = item;
          const { x, y } = drag.startEvent;
          const targetX = clientRect.x + clientRect.width / 2;
          const targetY = clientRect.y + clientRect.height / 2;
          change.x = x - targetX;
          change.y = y - targetY;
        }
        return change;
      },
    ],
  };

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Center To Pointer</title>
    <meta
      name="description"
      content="Here we use a custom position modifier to align the dragged element's center with the pointer sensor's position on drag start."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable Drag Handle

A simple example on how to create a drag handle. There is no built-in 'handle' option, because it would be too limiting. In this example the `PointerSensor` is used for the handle element while the `KeyboardMotionSensor` is used normally for the draggable element. You could also create the `KeyboardMotionSensor` for the handle element if you wished, it's really up to your preferences. Hopefully this showcases how flexible and customizable DragDoll really is with its sensor system.

<div class="example"><iframe src="/dragdoll/solid-examples/008-draggable-drag-handle/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/008-draggable-drag-handle/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { PointerSensor } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();
  const [sensorType, setSensorType] = createSignal<'pointer' | 'keyboard' | null>(null);

  const draggableSettings: UseDraggableSettings = {
    elements: () => (element ? [element] : []),
    onStart: (drag) => {
      setSensorType(drag.sensor instanceof PointerSensor ? 'pointer' : 'keyboard');
    },
    onEnd: () => {
      setSensorType(null);
    },
  };

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setElementRef = (node: HTMLDivElement) => {
    element = node;
    setKeyboardSensorRef(node);
  };

  return (
    <div
      ref={setElementRef}
      class={`card draggable ${drag() ? 'dragging' : ''} ${drag() && sensorType() ? `${sensorType()}-dragging` : ''}`}
      tabIndex={0}
    >
      <div ref={setPointerSensorRef} class="handle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
        </svg>
      </div>
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable Drag Handle</title>
    <meta
      name="description"
      content="A simple example on how to create a drag handle. There is no built-in 'handle' option, because it would be too limiting. In this example the `PointerSensor` is used for the handle element while the `KeyboardMotionSensor` is used normally for the draggable element. You could also create the `KeyboardMotionSensor` for the handle element if you wished, it's really up to your preferences. Hopefully this showcases how flexible and customizable DragDoll really is with its sensor system."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  cursor: auto;
  touch-action: auto;

  & .handle {
    touch-action: none;
    display: flex;
    justify-content: safe center;
    align-items: safe center;
    cursor: grab;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    width: 40px;
    height: 40px;
    position: absolute;
    top: 4px;
    right: 4px;

    .card.pointer-dragging & {
      cursor: grabbing;
    }

    .card.keyboard-dragging & {
      cursor: auto;
    }

    & svg {
      width: 24px;
      height: 24px;
    }

    @media (hover: hover) and (pointer: fine) {
      .card:not(.keyboard-dragging) &:hover,
      .card.pointer-dragging & {
        background-color: rgba(0, 0, 0, 0.3);
      }
    }
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable - Multiple Elements

Sometimes you might want to drag multiple elements at once and DragDoll provides you an easy way to do that. Just return an array of elements in the `elements` callback and you're good to go.

<div class="example"><iframe src="/dragdoll/solid-examples/009-draggable-multiple-elements/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/009-draggable-multiple-elements/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable - Multiple Elements</title>
    <meta
      name="description"
      content="Sometimes you might want to drag multiple elements at once and DragDoll provides you an easy way to do that. Just return an array of elements in the `elements` callback and you're good to go."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px 10px;
  padding: 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
}

@media (width < 430px) {
  .card.draggable {
    width: calc((100% - 50px) / 4);
    aspect-ratio: 1 / 1;
    height: auto;
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable - Start Threshold

A draggable link element that requires 5px of movement before the drag starts. Clicking the link works normally. When drag starts, the element position is offset so the pointer stays at the original position relative to the element.

<div class="example"><iframe src="/dragdoll/solid-examples/010-draggable-start-threshold/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/010-draggable-start-threshold/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { DraggableModifier, PointerSensor, startOffsetModifier } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

const THRESHOLD = 5;

function DraggableCard() {
  let element: HTMLAnchorElement | null = null;
  const [zIndex, setZIndex] = createSignal(1);
  let zIndexCounter = 1;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggableSettings: UseDraggableSettings<PointerSensor> = {
    elements: () => (element ? [element] : []),
    startPredicate: ({ event }) => {
      const dx = event.x - event.startX;
      const dy = event.y - event.startY;
      return Math.sqrt(dx * dx + dy * dy) >= THRESHOLD ? true : undefined;
    },
    positionModifiers: [startOffsetModifier as unknown as DraggableModifier<PointerSensor>],
    onStart: () => {
      setZIndex(++zIndexCounter);
    },
  };

  const draggable = useDraggable([pointerSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLAnchorElement) => {
    element = node;
    setPointerSensorRef(node);
  };

  return (
    <a
      ref={setRefs}
      href="https://muuri.dev"
      class={`card draggable ${drag() ? 'dragging' : ''}`}
      style={{ 'z-index': zIndex() }}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512">
        <path d="M579.8 267.7c56.5-56.5 56.5-148 0-204.5c-50-50-128.8-56.5-186.3-15.4l-1.6 1.1c-14.4 10.3-17.7 30.3-7.4 44.6s30.3 17.7 44.6 7.4l1.6-1.1c32.1-22.9 76-19.3 103.8 8.6c31.5 31.5 31.5 82.5 0 114L422.3 334.8c-31.5 31.5-82.5 31.5-114 0c-27.9-27.9-31.5-71.8-8.6-103.8l1.1-1.6c10.3-14.4 6.9-34.4-7.4-44.6s-34.4-6.9-44.6 7.4l-1.1 1.6C680.8 251.2 170.6 330 220.6 380c56.5 56.5 148 56.5 204.5 0L579.8 267.7zM60.2 244.3c-56.5 56.5-56.5 148 0 204.5c50 50 128.8 56.5 186.3 15.4l1.6-1.1c14.4-10.3 17.7-30.3 7.4-44.6s-30.3-17.7-44.6-7.4l-1.6 1.1c-32.1 22.9-76 19.3-103.8-8.6C74 372.1 74 321.1 105.5 289.5L217.7 177.2c31.5-31.5 82.5-31.5 114 0c27.9 27.9 31.5 71.8 8.6 103.9l-1.1 1.6c-10.3 14.4-6.9 34.4 7.4 44.6s34.4 6.9 44.6-7.4l1.1-1.6C540.8 260.8 470.6 182 420.6 132c-56.5-56.5-148-56.5-204.5 0L60.2 244.3z" />
      </svg>
      <span>muuri.dev</span>
    </a>
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable - Start Threshold</title>
    <meta
      name="description"
      content="A draggable link element that requires 5px of movement before the drag starts. Clicking the link works normally. When drag starts, the element position is offset so the pointer stays at the original position relative to the element."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-flow: row nowrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
  width: 120px;
  height: 120px;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;

  /* Prevent touch scrolling - REQUIRED for touch dragging */
  touch-action: none;

  /* Prevent tap highlight on mobile */
  -webkit-tap-highlight-color: transparent;

  /* Prevent long-press context menu on mobile */
  -webkit-touch-callout: none;

  & svg {
    width: 2em;
    height: 2em;
  }

  & span {
    color: inherit;
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable - Touch Delay

A draggable element with a 1 second touch delay. On touch devices, you must hold the element for 1 second before dragging starts, allowing normal scrolling. Mouse and pen input start dragging immediately.

<div class="example"><iframe src="/dragdoll/solid-examples/011-draggable-touch-delay/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/011-draggable-touch-delay/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import {
  createTouchDelayPredicate,
  DraggableModifier,
  PointerSensor,
  startOffsetModifier,
} from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  usePointerSensor,
} from 'dragdoll-solid';
import { render } from 'solid-js/web';

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggableSettings: UseDraggableSettings<PointerSensor> = {
    elements: () => (element ? [element] : []),
    startPredicate: createTouchDelayPredicate({ touchDelay: 1000 }),
    positionModifiers: [startOffsetModifier as unknown as DraggableModifier<PointerSensor>],
  };

  const draggable = useDraggable([pointerSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setRefs = (node: HTMLDivElement) => {
    element = node;
    setPointerSensorRef(node);
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable - Touch Delay</title>
    <meta
      name="description"
      content="A draggable element with a 1 second touch delay. On touch devices, you must hold the element for 1 second before dragging starts, allowing normal scrolling. Mouse and pen input start dragging immediately."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: safe center;
  align-items: safe center;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable - Drag Preview

A drag preview inside a scrollable container with complex CSS transforms. The proxy element inherits ancestor transforms via the core's transform normalization, preserving the exact visual shape during drag. Auto-scroll keeps working across the transformed container.

<div class="example"><iframe src="/dragdoll/solid-examples/012-draggable-drag-preview/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/012-draggable-drag-preview/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable - Drag Preview</title>
    <meta
      name="description"
      content="A drag preview inside a scrollable container with complex CSS transforms. The proxy element inherits ancestor transforms via the core's transform normalization, preserving the exact visual shape during drag. Auto-scroll keeps working across the transformed container."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
.transform-outer {
  position: fixed;
  inset: 0;
  transform: scale(0.85) rotate(-2deg);
  transform-origin: center center;
  overflow: hidden;
}

.transform-inner {
  position: absolute;
  inset: 0;
  transform: skew(-3deg, -3deg);
  overflow-y: auto;
}

.scroll-content {
  position: relative;
  min-height: 250%;
  padding: 20px;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  gap: 20px;
}

.card.draggable {
  position: relative;
  flex-shrink: 0;
  transform: scale(1.1) rotate(3deg);
  transform-origin: 50% 50%;

  &.dragging {
    opacity: 0.3;
  }
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--card-bgColor--drag);
  color: var(--card-color--drag);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 14px;
  font-weight: 600;
  font-family: monospace;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Draggable - Multi-Item Drag Preview

One draggable moves three items simultaneously via drag previews. Each item sits inside its own overflow-hidden container with different complex CSS transforms (scale, skew, rotation). The core's transform normalization ensures every proxy matches its original's visual shape after reparenting to document.body.

<div class="example"><iframe src="/dragdoll/solid-examples/013-draggable-multi-drag-preview/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/013-draggable-multi-drag-preview/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - Draggable - Multi-Item Drag Preview</title>
    <meta
      name="description"
      content="One draggable moves three items simultaneously via drag previews. Each item sits inside its own overflow-hidden container with different complex CSS transforms (scale, skew, rotation). The core's transform normalization ensures every proxy matches its original's visual shape after reparenting to document.body."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
#root {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: stretch;
  gap: 10px;
  padding: 10px;
}

.container {
  position: relative;
  flex: 1;
  overflow: hidden;
  border-radius: 10px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.03);
}

.container-inner {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container:nth-child(1) .container-inner {
  transform: scale(0.7) skew(-8deg, -8deg);
}

.container:nth-child(2) .container-inner {
  transform: scale(0.6) rotate(12deg);
}

.container:nth-child(3) .container-inner {
  transform: scale(0.8) skew(5deg, 5deg) rotate(-6deg);
}

.card.draggable {
  position: relative;
  transform: scale(1.15);
  transform-origin: 50% 50%;

  &.dragging {
    opacity: 0.3;
  }
}

.container-label {
  position: absolute;
  bottom: 6px;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 10px;
  font-family: monospace;
  color: rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.preview-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--card-bgColor--drag);
  color: var(--card-color--drag);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 12px;
  font-weight: 600;
  font-family: monospace;
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - DndObserver - Basic

A basic example of using DndObserver with Draggable and Droppable elements. Here we highlight the dropzone element that overlaps most with the dragged element.

<div class="example"><iframe src="/dragdoll/solid-examples/014-dnd-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/014-dnd-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - DndObserver - Basic</title>
    <meta
      name="description"
      content="A basic example of using DndObserver with Draggable and Droppable elements. Here we highlight the dropzone element that overlaps most with the dragged element."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  flex-flow: column nowrap;
  align-items: normal;
  justify-content: safe center;
  gap: 10px;
  width: 100%;
  height: 100%;
  padding: 10px;
  display: flex;
}

.draggables,
.droppables {
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: safe center;
  align-items: safe center;
  align-content: safe center;
  gap: 10px;
}

.card.draggable {
  position: relative;
  flex-grow: 0;
  flex-shrink: 0;
}

.droppable {
  width: 100px;
  height: 100px;
  background-color: var(--bg-color);
  border-radius: 7px;
  border: 1.5px solid var(--theme-color);
  transition:
    border-color 0.2s ease-out,
    box-shadow 0.2s ease-out;
  box-shadow:
    0 0 0 2px transparent,
    0 0 0 3.5px transparent;

  &.draggable-dropped {
    border-color: var(--card-bgColor--drag);
    box-shadow:
      0 0 0 2px transparent,
      0 0 0 3.5px transparent;
  }

  &.draggable-over {
    border-color: var(--card-bgColor--focus);
    box-shadow:
      0 0 0 2px var(--bg-color),
      0 0 0 3.5px var(--card-bgColor--focus);
  }
}

@media (width < 430px) {
  .card.draggable,
  .droppable {
    width: calc((100% - 50px) / 4);
    aspect-ratio: 1 / 1;
    height: auto;
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - DndObserver - Advanced Collision Detector

Advanced collision detection with scrollable droppable lists. Here we can see how the advanced collision detector respects the visibility of the droppables. Only the visible parts of the droppables (as seen from the perspective of the draggable) are considered for collisions.

<div class="example"><iframe src="/dragdoll/solid-examples/015-dnd-advanced-collision-detector/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/015-dnd-advanced-collision-detector/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  AnyDraggable,
  DndObserver,
  Droppable,
} from 'dragdoll';
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableAutoScroll,
  useDraggableDrag,
  useDroppable,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-solid';
import { createSignal, For, JSX, Show } from 'solid-js';
import { render } from 'solid-js/web';

type ListId = 'left' | 'right';

function getContainerInfo(container: HTMLElement): { listId: ListId; index: number } {
  return {
    listId: (container.getAttribute('data-list-id') || 'left') as ListId,
    index: parseInt(container.getAttribute('data-index') || '0', 10),
  };
}

function createDragPreviewElement(element: HTMLElement, draggableId: string): HTMLElement {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.transform = '';
  clone.classList.add('drag-preview', 'dragging');
  clone.setAttribute('data-id', draggableId);
  document.body.appendChild(clone);
  return clone;
}

function cleanupDrag(
  previewElement: HTMLElement | null,
  originalElement: HTMLElement | null,
  draggableId: string,
  bestMatch: Droppable | null,
  setHiddenIds: (fn: (prev: Set<string>) => Set<string>) => void,
  bestMatchMap: Map<AnyDraggable, Droppable>,
  draggable: AnyDraggable,
  includeAnimate = false,
) {
  try {
    previewElement?.remove();
  } catch {
    // Ignore removal errors
  }
  if (originalElement) {
    originalElement.classList.remove('dragging', 'hidden');
    if (includeAnimate) {
      originalElement.classList.remove('animate');
    }
  }
  setHiddenIds((prev) => {
    if (!prev.has(draggableId)) return prev;
    const next = new Set(prev);
    next.delete(draggableId);
    return next;
  });
  bestMatch?.element?.removeAttribute('data-draggable-over');
  bestMatchMap.delete(draggable);
}

function findBestMatch(contacts: ReadonlySet<Droppable>, draggableId: string): Droppable | null {
  for (const droppable of contacts) {
    const containedId = droppable.element?.getAttribute('data-draggable-contained') || '';
    if (containedId && containedId !== draggableId) continue;
    const overId = droppable.element?.getAttribute('data-draggable-over') || '';
    if (overId && overId !== draggableId) continue;
    return droppable;
  }
  return null;
}

function getTargetPosition(container: HTMLElement) {
  const rect = container.getBoundingClientRect();
  const style = getComputedStyle(container);
  const borderLeft = parseFloat(style.borderLeftWidth || '0') || 0;
  const borderTop = parseFloat(style.borderTopWidth || '0') || 0;
  return {
    left: rect.left + borderLeft + 10,
    top: rect.top + borderTop + 10,
  };
}

const collisionDetector = (ctx: DndObserver<AdvancedCollisionData>) =>
  new AdvancedCollisionDetector(ctx);

const ANIMATION_EPSILON = 0.5;

function DraggableCard(props: {
  draggableId: string;
  scrollContainers: HTMLElement[];
  onDragStart: (draggableId: string) => void;
  isHidden: boolean;
}) {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], {
      elements: () => {
        if (!element) return [];
        return [createDragPreviewElement(element, props.draggableId)];
      },
      frozenStyles: (): ('width' | 'height')[] => ['width', 'height'],
      startPredicate: () => !element?.classList.contains('animate'),
      onStart: () => {
        element?.classList.add('dragging', 'hidden');
        props.onDragStart(props.draggableId);
      },
    }),
    {
      targets: () =>
        props.scrollContainers.map((sc) => ({
          element: sc,
          axis: 'y' as const,
          padding: { top: 0, bottom: 0 },
        })),
    },
  );

  useDraggableDrag(draggable);

  return (
    <div
      ref={(node) => {
        element = node;
        setPointerSensorRef(node);
        setKeyboardSensorRef(node);
      }}
      class={`card draggable ${props.isHidden ? 'hidden' : ''}`}
      tabIndex={0}
      data-id={props.draggableId}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
}

function DroppableZone(props: {
  containedDraggableId?: string;
  listId: ListId;
  index: number;
  children?: JSX.Element;
}) {
  const [_droppable, setDroppableRef] = useDroppable({ data: {} });

  return (
    <div
      ref={setDroppableRef}
      class="droppable"
      data-list-id={props.listId}
      data-index={props.index}
      {...(props.containedDraggableId
        ? { 'data-draggable-contained': props.containedDraggableId }
        : {})}
    >
      {props.children}
    </div>
  );
}

function ScrollList(props: {
  listId: ListId;
  slots: Array<string | null>;
  hiddenIds: Set<string>;
  onDragStart: (draggableId: string) => void;
  scrollContainers: HTMLElement[];
}) {
  return (
    <div
      ref={(node) => {
        if (node && !props.scrollContainers.includes(node)) {
          props.scrollContainers.push(node);
        }
      }}
      class="scroll-list"
      data-list-id={props.listId}
    >
      <For each={props.slots}>
        {(slotDraggableId, i) => (
          <DroppableZone
            listId={props.listId}
            index={i()}
            containedDraggableId={slotDraggableId || undefined}
          >
            <Show when={slotDraggableId}>
              {(id) => (
                <DraggableCard
                  draggableId={id()}
                  scrollContainers={props.scrollContainers}
                  onDragStart={props.onDragStart}
                  isHidden={props.hiddenIds.has(id())}
                />
              )}
            </Show>
          </DroppableZone>
        )}
      </For>
    </div>
  );
}

function App() {
  // Stable mutable refs — Solid components run once.
  const scrollContainers: HTMLElement[] = [];
  const bestMatchMap = new Map<AnyDraggable, Droppable>();

  const [leftSlots, setLeftSlots] = createSignal<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '1' : null)),
  );
  const [rightSlots, setRightSlots] = createSignal<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '2' : null)),
  );
  const [hiddenIds, setHiddenIds] = createSignal<Set<string>>(new Set());

  const onDragStart = (id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const updateSlot = (listId: ListId, index: number, value: string | null) => {
    const setter = listId === 'left' ? setLeftSlots : setRightSlots;
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const moveDraggable = (
    id: string,
    fromList: ListId,
    fromIndex: number,
    toList: ListId,
    toIndex: number,
  ) => {
    if (fromList === toList && fromIndex === toIndex) return;
    updateSlot(fromList, fromIndex, null);
    updateSlot(toList, toIndex, id);
  };

  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ draggable, contacts }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const nextBestMatch = findBestMatch(contacts, draggableId);
      const currentBestMatch = bestMatchMap.get(draggable);

      if (nextBestMatch && nextBestMatch !== currentBestMatch) {
        currentBestMatch?.element?.removeAttribute('data-draggable-over');
        nextBestMatch?.element?.setAttribute('data-draggable-over', draggableId);
        bestMatchMap.set(draggable, nextBestMatch);
      }
    },
    onEnd: ({ draggable, canceled }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const bestMatch = bestMatchMap.get(draggable) || null;
      const originalElement = document.querySelector(
        `.card.draggable[data-id="${draggableId}"]`,
      ) as HTMLElement | null;
      const originalContainer = originalElement?.parentElement as HTMLElement | null;
      const targetContainer =
        !canceled && bestMatch ? (bestMatch.element as HTMLElement) : originalContainer;

      if (!originalContainer || !targetContainer) {
        cleanupDrag(
          previewElement,
          originalElement,
          draggableId,
          bestMatch,
          setHiddenIds,
          bestMatchMap,
          draggable,
        );
        return;
      }

      const from = getContainerInfo(originalContainer);
      const to = getContainerInfo(targetContainer);
      moveDraggable(draggableId, from.listId, from.index, to.listId, to.index);

      // Animate preview to final position
      const baseLeft = parseFloat(previewElement.style.left || '0');
      const baseTop = parseFloat(previewElement.style.top || '0');
      const targetPos = getTargetPosition(targetContainer);
      const currentPos = previewElement.getBoundingClientRect();
      const deltaX = targetPos.left - currentPos.left;
      const deltaY = targetPos.top - currentPos.top;

      if (Math.abs(deltaX) < ANIMATION_EPSILON && Math.abs(deltaY) < ANIMATION_EPSILON) {
        cleanupDrag(
          previewElement,
          originalElement,
          draggableId,
          bestMatch,
          setHiddenIds,
          bestMatchMap,
          draggable,
        );
        return;
      }

      const finalTranslateX = targetPos.left - baseLeft;
      const finalTranslateY = targetPos.top - baseTop;
      previewElement.classList.add('animating');
      previewElement.clientHeight; // Force reflow
      previewElement.style.transform = `translate(${finalTranslateX}px, ${finalTranslateY}px)`;

      const onTransitionEnd = (e: TransitionEvent) => {
        if (e.target === previewElement && e.propertyName === 'transform') {
          cleanupDrag(
            previewElement,
            originalElement,
            draggableId,
            bestMatch,
            setHiddenIds,
            bestMatchMap,
            draggable,
            true,
          );
          document.body.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      document.body.addEventListener('transitionend', onTransitionEnd);
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div class="container">
        <ScrollList
          listId="left"
          slots={leftSlots()}
          hiddenIds={hiddenIds()}
          onDragStart={onDragStart}
          scrollContainers={scrollContainers}
        />
        <ScrollList
          listId="right"
          slots={rightSlots()}
          hiddenIds={hiddenIds()}
          onDragStart={onDragStart}
          scrollContainers={scrollContainers}
        />
      </div>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find the root element');
}

render(() => <App />, root);
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Solid - DndObserver - Advanced Collision Detector</title>
    <meta
      name="description"
      content="Advanced collision detection with scrollable droppable lists. Here we can see how the advanced collision detector respects the visibility of the droppables. Only the visible parts of the droppables (as seen from the perspective of the draggable) are considered for collisions."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#root {
  display: flex;
  align-items: safe center;
  justify-content: safe center;
  width: 100%;
  height: 100%;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: safe center;
  justify-content: safe center;
  flex-direction: row;
  gap: 20px;
  padding: 20px;
}

.scroll-list {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  justify-content: safe center;
  gap: 20px;
  padding: 20px;
  display: grid;
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 7px;
  width: 260px;
  height: min(520px, 100%);
  overflow: hidden scroll;
}

.droppable {
  position: relative;
  width: 100%;
  min-width: 0;
  aspect-ratio: 1 / 1;
  background-color: var(--bg-color);
  border-radius: 17px;
  border: 1.5px solid var(--theme-color);
  transition:
    border-color 0.2s ease-out,
    box-shadow 0.2s ease-out;
  box-shadow:
    0 0 0 2px transparent,
    0 0 0 3.5px transparent;

  &[data-draggable-over] {
    border-color: var(--card-bgColor--focus);
    box-shadow:
      0 0 0 2px var(--bg-color),
      0 0 0 3.5px var(--card-bgColor--focus);
  }
}

.card.draggable {
  position: absolute;
  top: 10px;
  left: 10px;
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  z-index: 100;

  &.animate {
    transition: transform 0.3s cubic-bezier(0.33, 0.975, 0, 1.65);
  }
}

.card.draggable.hidden {
  visibility: hidden;
}

.drag-preview {
  z-index: 1000;
  pointer-events: none;

  &.animating {
    transition: transform 0.3s cubic-bezier(0.33, 0.975, 0, 1.65);
  }
}

@media (width < 600px) {
  .scroll-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-content: safe center;
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::

## Solid - Sortable List - Accessible

A sortable list with two interaction modes. (1) Pointer drag: drag items via mouse or touch -- a DragPreview proxy follows the pointer while the original stays in-flow as a translucent placeholder; DndObserver detects collisions to trigger reorder. (2) Keyboard reorder: focus an item and press Shift+Space or Shift+Enter to pick up, arrow keys to move, Space/Enter to drop, Escape to cancel. During either interaction, items are repositioned visually with CSS transforms while the DOM order stays fixed. The final DOM reorder only happens on drop. A live region announces every position change for screen readers.

<div class="example"><iframe src="/dragdoll/solid-examples/016-sortable-accessible/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/solid-examples/016-sortable-accessible/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */

// Sortable list with two interaction modes:
//
// 1. POINTER DRAG — drag items via mouse/touch. A DragPreview proxy follows
//    the pointer while the original element stays in-flow as a translucent
//    placeholder. DndObserver detects collisions between the preview and
//    other items to trigger reorder.
//
// 2. KEYBOARD REORDER — Shift+Space/Enter to pick up, arrow keys to
//    move one position at a time, Space/Enter to drop, Escape to cancel.
//
// During either interaction, items are repositioned using CSS transforms
// (DOM order stays fixed). The final DOM reorder + state commit only
// happens on drop or cancel.

import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  DndObserver,
  DraggableModifier,
  Droppable,
  PointerSensor,
  startOffsetModifier,
} from 'dragdoll';
import {
  DndObserverContext,
  DragPreview,
  useDndObserver,
  useDraggable,
  useDraggableAutoScroll,
  useDroppable,
  usePointerSensor,
} from 'dragdoll-solid';
import { createEffect, createSignal, For, onCleanup } from 'solid-js';
import { render } from 'solid-js/web';

//
// Constants
//

const ITEM_COUNT = 100;
const POINTER_START_THRESHOLD_SQ = 8 * 8;
const SWAP_ANIM_DURATION = 150;
const DROP_ANIM_DURATION = 150;
const CANCEL_ANIM_DURATION = 200;
const SWAP_OVERLAP_THRESHOLD = 51;
const DRAG_PREVIEW_EXIT_TIMEOUT = CANCEL_ANIM_DURATION + 50;

//
// Types
//

interface ItemData {
  id: string;
  label: string;
}

interface PointerDragState {
  itemId: string;
  originalIndex: number;
  cancelled: boolean;
}

interface A11yDragState {
  itemId: string;
  originalIndex: number;
  currentIndex: number;
}

//
// Pure helpers
//

function isPointerDistanceAboveThreshold(
  x: number,
  y: number,
  startX: number,
  startY: number,
  thresholdSq: number,
): boolean {
  const dx = x - startX;
  const dy = y - startY;
  return dx * dx + dy * dy >= thresholdSq;
}

function announce(liveRegion: HTMLElement | null, message: string) {
  if (liveRegion) liveRegion.textContent = message;
}

//
// Virtual layout helpers
//

function applyVirtualTransforms(
  itemElements: Map<string, HTMLLIElement>,
  domOrder: ItemData[],
  virtualOrder: string[],
  itemStride: number,
  affectedIds: string[],
  animate: boolean,
) {
  for (const id of affectedIds) {
    const el = itemElements.get(id);
    if (!el) continue;

    const domIdx = domOrder.findIndex((it) => it.id === id);
    const virtualIdx = virtualOrder.indexOf(id);
    const newY = (virtualIdx - domIdx) * itemStride;

    const prevY = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
    if (prevY === newY) continue;

    el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

    if (animate) {
      const anims = el.getAnimations();
      for (let i = 0; i < anims.length; i++) anims[i].cancel();

      el.animate(
        [
          { transform: `translateY(${prevY}px)` },
          { transform: newY === 0 ? 'translateY(0px)' : `translateY(${newY}px)` },
        ],
        { duration: SWAP_ANIM_DURATION, easing: 'ease' },
      );
    }
  }
}

function clearAllTransforms(itemElements: Map<string, HTMLLIElement>) {
  for (const el of itemElements.values()) {
    const anims = el.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].cancel();
    el.style.transform = '';
  }
}

function animateTransformsToZero(itemElements: Map<string, HTMLLIElement>, duration: number) {
  for (const el of itemElements.values()) {
    const currentTransform = el.style.transform;
    if (!currentTransform || currentTransform === 'translateY(0px)') continue;

    const anims = el.getAnimations();
    for (let i = 0; i < anims.length; i++) anims[i].cancel();

    el.style.transform = '';
    el.animate([{ transform: currentTransform }, { transform: 'translateY(0px)' }], {
      duration,
      easing: 'ease',
    });
  }
}

//
// Collision detector factory
//

const collisionDetector = (ctx: DndObserver<AdvancedCollisionData>) =>
  new AdvancedCollisionDetector(ctx);

//
// SortableItem component
//

function SortableItem(props: {
  item: ItemData;
  isDragging: boolean;
  isA11yDragging: boolean;
  pointerDrag: PointerDragState | null;
  setPointerDrag: (v: PointerDragState | null) => void;
  lastSwapFromIdx: { current: number };
  a11yDrag: A11yDragState | null;
  listEl: HTMLUListElement | null;
  itemElements: Map<string, HTMLLIElement>;
  items: ItemData[];
  virtualOrder: { current: string[] | null };
  dndObserver: { current: DndObserver<AdvancedCollisionData> | null };
  itemStride: { current: number };
  onPointerDrop: { current: () => void };
  virtualSwap: (fromIndex: number, toIndex: number) => void;
}) {
  let liRef: HTMLLIElement | null = null;

  // Register/unregister element in the shared map.
  createEffect(() => {
    const li = liRef;
    if (li) props.itemElements.set(props.item.id, li);
    onCleanup(() => {
      props.itemElements.delete(props.item.id);
    });
  });

  // Pointer sensor on the link element.
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  // Droppable — each item is a drop target for collision detection.
  const [, setDroppableRef] = useDroppable({
    data: { itemId: props.item.id },
    computeClientRect: () => {
      const listEl = props.listEl;
      const itemStride = props.itemStride.current;
      if (!listEl || !props.items.length || !itemStride) {
        return { x: 0, y: 0, width: 0, height: 0 };
      }

      const order = props.virtualOrder.current;
      const idx = order
        ? order.indexOf(props.item.id)
        : props.items.findIndex((it) => it.id === props.item.id);

      if (idx < 0) return { x: 0, y: 0, width: 0, height: 0 };
      const listRect = listEl.getBoundingClientRect();
      const el = props.itemElements.get(props.item.id);
      const height = el ? el.getBoundingClientRect().height : itemStride;
      return {
        x: listRect.left,
        y: listRect.top + idx * itemStride,
        width: listRect.width,
        height,
      };
    },
  });

  function onScrollDuringDrag() {
    props.dndObserver.current?.updateDroppableClientRects();
  }

  // Draggable settings — uses DragPreview for the pointer-following proxy.
  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor], {
      elements: () => {
        const li = liRef;
        return li ? [li] : [];
      },
      dragPreview: true,
      dragPreviewExitTimeout: DRAG_PREVIEW_EXIT_TIMEOUT,
      startPredicate: ({
        event,
      }: {
        event: { x: number; y: number; startX: number; startY: number };
      }) => {
        if (props.a11yDrag) return false;
        return isPointerDistanceAboveThreshold(
          event.x,
          event.y,
          event.startX,
          event.startY,
          POINTER_START_THRESHOLD_SQ,
        )
          ? true
          : undefined;
      },
      positionModifiers: [
        startOffsetModifier as unknown as DraggableModifier<PointerSensor>,
        (change) => {
          change.x = 0;
          return change;
        },
      ],
      computeClientRect: ({
        drag,
      }: {
        drag: { items: { element: HTMLElement | SVGSVGElement }[] };
      }) => {
        const el = drag.items[0]?.element;
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        return { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
      },
      onStart: () => {
        const li = liRef;
        if (!li) return;

        props.virtualOrder.current = props.items.map((it) => it.id);

        li.classList.add('placeholder');
        props.lastSwapFromIdx.current = -1;
        props.setPointerDrag({
          itemId: props.item.id,
          originalIndex: props.items.findIndex((it) => it.id === props.item.id),
          cancelled: false,
        });
        props.listEl?.classList.add('is-dragging');
        window.addEventListener('scroll', onScrollDuringDrag);
      },
      onMove: () => {
        props.lastSwapFromIdx.current = -1;
      },
      onEnd: ({ endEvent }: { endEvent?: { type: string } | null }) => {
        window.removeEventListener('scroll', onScrollDuringDrag);

        const drag = props.pointerDrag;
        if (!drag) return;

        const cancelled = endEvent?.type === 'cancel';
        props.setPointerDrag({ ...drag, cancelled });

        if (cancelled) {
          animateTransformsToZero(props.itemElements, CANCEL_ANIM_DURATION);
          props.virtualOrder.current = null;
        }

        props.listEl?.classList.remove('is-dragging');
      },
    }),
    {
      targets: [
        {
          element: window,
          axis: 'y' as const,
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    },
  );

  const className = () =>
    `sortable-item${props.isDragging ? ' placeholder' : ''}${props.isA11yDragging ? ' a11y-dragging' : ''}`;

  return (
    <>
      <li
        ref={(node) => {
          liRef = node;
          setDroppableRef(node);
        }}
        class={className()}
      >
        <a
          ref={(node) => {
            setPointerSensorRef(node);
          }}
          href="https://muuri.dev"
          target="_blank"
          rel="noopener noreferrer"
          draggable={false}
          aria-roledescription="sortable item"
          aria-describedby="dnd-instructions"
        >
          {props.item.label}
        </a>
      </li>
      <DragPreview draggable={draggable}>
        {({ sourceElement, exiting, done }) => {
          let contentRef: HTMLDivElement | null = null;

          // Handle exit animation.
          if (exiting && contentRef) {
            // Use queueMicrotask to run after DOM insertion.
            queueMicrotask(() => {
              if (!contentRef) return;
              const proxy = contentRef.parentElement as HTMLElement;
              const source = sourceElement as HTMLElement;
              const drag = props.pointerDrag;

              const anims = source.getAnimations();
              for (let i = 0; i < anims.length; i++) anims[i].finish();

              const proxyRect = proxy.getBoundingClientRect();
              const sourceRect = source.getBoundingClientRect();
              const dx = sourceRect.left - proxyRect.left;
              const dy = sourceRect.top - proxyRect.top;

              const duration = drag?.cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;

              const cleanup = () => {
                source.classList.remove('placeholder');
                if (!drag?.cancelled) {
                  props.onPointerDrop.current();
                }
                props.setPointerDrag(null);
                done();
              };

              if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                cleanup();
                return;
              }

              const anim = proxy.animate(
                [{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }],
                { duration, easing: 'ease', fill: 'forwards', composite: 'add' },
              );
              anim.onfinish = cleanup;
            });
          }

          return (
            <div
              ref={(el) => (contentRef = el)}
              class="sortable-item drag-preview"
              aria-hidden="true"
            >
              <a>{props.item.label}</a>
            </div>
          );
        }}
      </DragPreview>
    </>
  );
}

//
// App component
//

function App() {
  // Item order state.
  const [items, setItems] = createSignal<ItemData[]>(
    Array.from({ length: ITEM_COUNT }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
    })),
  );

  // Mutable refs — Solid components run once so these are stable.
  let listEl: HTMLUListElement | null = null;
  let liveRegion: HTMLDivElement | null = null;
  const itemElements = new Map<string, HTMLLIElement>();
  const itemStride = { current: 0 };
  const virtualOrder: { current: string[] | null } = { current: null };
  const lastSwapFromIdx = { current: -1 };
  let swapCooldown = false;

  // Pointer drag state (imperative).
  const [pointerDrag, setPointerDrag] = createSignal<PointerDragState | null>(null);

  // Keyboard reorder state.
  const [a11yDrag, setA11yDrag] = createSignal<A11yDragState | null>(null);

  // Track which item is being pointer-dragged.
  const [draggingId, setDraggingId] = createSignal<string | null>(null);

  // Measure item dimensions after first render.
  createEffect(() => {
    const _items = items(); // Track items changes.
    if (itemElements.size < 2) return;
    const ids = Array.from(itemElements.keys());
    const el0 = itemElements.get(ids[0]);
    const el1 = itemElements.get(ids[1]);
    if (el0 && el1) {
      itemStride.current = el1.getBoundingClientRect().top - el0.getBoundingClientRect().top;
    }
  });

  // After a state commit (drop), clear all inline transforms.
  createEffect(() => {
    items(); // Track items changes.
    clearAllTransforms(itemElements);
  });

  // Swap two items in the virtual order and animate the affected items.
  const virtualSwap = (fromIndex: number, toIndex: number) => {
    const order = virtualOrder.current;
    if (!order || fromIndex === toIndex) return;

    const lo = Math.min(fromIndex, toIndex);
    const hi = Math.max(fromIndex, toIndex);
    const affectedIds = order.slice(lo, hi + 1);

    const [moved] = order.splice(fromIndex, 1);
    order.splice(toIndex, 0, moved);

    // Prevent rapid cascading swaps — wait for the animation to settle.
    swapCooldown = true;
    setTimeout(() => {
      swapCooldown = false;
    }, SWAP_ANIM_DURATION);

    applyVirtualTransforms(itemElements, items(), order, itemStride.current, affectedIds, true);
  };

  // Commit the virtual order to state (called on drop).
  const commitOrder = () => {
    const order = virtualOrder.current;
    if (!order) return;
    virtualOrder.current = null;
    setItems((prev) => order.map((id) => prev.find((it) => it.id === id)!));
  };

  // Ref for SortableItem to call on pointer drop completion.
  const onPointerDrop = { current: commitOrder };

  // DndObserver ref for imperative access.
  const dndObserverRef: { current: DndObserver<AdvancedCollisionData> | null } = { current: null };

  // DndObserver with collision-based reorder.
  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ collisions }) => {
      const drag = pointerDrag();
      const order = virtualOrder.current;
      if (!drag || !order || swapCooldown) return;

      const observer = dndObserverRef.current;

      for (const collision of collisions) {
        if (collision.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;
        const targetDroppable = observer?.droppables.get(collision.droppableId);
        if (!targetDroppable) continue;
        const targetItemId = (targetDroppable as Droppable).data.itemId as string;
        if (targetItemId === drag.itemId) continue;

        const currentIdx = order.indexOf(drag.itemId);
        const targetIdx = order.indexOf(targetItemId);
        if (currentIdx === targetIdx || targetIdx === lastSwapFromIdx.current) continue;

        lastSwapFromIdx.current = currentIdx;
        virtualSwap(currentIdx, targetIdx);
        observer?.updateDroppableClientRects();
        break;
      }
    },
  });

  // Keep dndObserverRef in sync.
  createEffect(() => {
    dndObserverRef.current = dndObserver();
  });

  // Track pointer drag start/end for placeholder styling.
  createEffect(() => {
    const obs = dndObserver();
    if (!obs) return;
    const startId = obs.on('start', () => {
      const drag = pointerDrag();
      if (drag) setDraggingId(drag.itemId);
    });
    const endId = obs.on('end', () => {
      setDraggingId(null);
    });
    onCleanup(() => {
      obs.off('start', startId);
      obs.off('end', endId);
    });
  });

  //
  // Keyboard reorder
  //

  const a11yStart = (itemId: string) => {
    const currentItems = items();
    const index = currentItems.findIndex((it) => it.id === itemId);
    if (index < 0) return;
    const item = currentItems[index];

    virtualOrder.current = currentItems.map((it) => it.id);

    setA11yDrag({ itemId, originalIndex: index, currentIndex: index });
    announce(
      liveRegion,
      `Picked up ${item.label}. Position ${index + 1} of ${currentItems.length}. ` +
        `Use arrow keys to move, Space or Enter to drop, Escape to cancel.`,
    );
  };

  const a11yMove = (direction: -1 | 1) => {
    const drag = a11yDrag();
    const order = virtualOrder.current;
    if (!drag || !order) return;

    const newIndex = drag.currentIndex + direction;
    if (newIndex < 0 || newIndex >= order.length) return;

    virtualSwap(drag.currentIndex, newIndex);

    const updatedDrag = { ...drag, currentIndex: newIndex };
    setA11yDrag(updatedDrag);

    requestAnimationFrame(() => {
      const el = itemElements.get(drag.itemId);
      if (el) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });

    const item = items().find((it) => it.id === drag.itemId);
    announce(liveRegion, `${item?.label || ''}, position ${newIndex + 1} of ${order.length}.`);
  };

  const a11yEnd = (cancel: boolean) => {
    const drag = a11yDrag();
    if (!drag) return;

    setA11yDrag(null);

    const currentItems = items();
    const item = currentItems.find((it) => it.id === drag.itemId);

    if (cancel) {
      animateTransformsToZero(itemElements, CANCEL_ANIM_DURATION);
      virtualOrder.current = null;
    } else {
      commitOrder();
    }

    announce(
      liveRegion,
      cancel
        ? `${item?.label || ''} reorder cancelled. Returned to position ${drag.originalIndex + 1}.`
        : `${item?.label || ''} dropped at position ${drag.currentIndex + 1} of ${currentItems.length}.`,
    );

    const el = itemElements.get(drag.itemId);
    const link = el?.querySelector('a');
    link?.focus({ preventScroll: true });
  };

  // Global keyboard handler for a11y reorder.
  createEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (a11yDrag()) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            return a11yMove(-1);
          case 'ArrowDown':
            e.preventDefault();
            return a11yMove(1);
          case ' ':
          case 'Enter':
            e.preventDefault();
            return a11yEnd(false);
          case 'Escape':
            e.preventDefault();
            return a11yEnd(true);
        }
        return;
      }

      if (e.shiftKey && (e.key === ' ' || e.key === 'Enter')) {
        const li = (e.target as Element).closest('.sortable-item') as HTMLLIElement | null;
        if (!li) return;
        const itemId = Array.from(itemElements.entries()).find(([, el]) => el === li)?.[0];
        if (itemId) {
          e.preventDefault();
          a11yStart(itemId);
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    onCleanup(() => document.removeEventListener('keydown', onKeyDown));
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div id="dnd-instructions" class="sr-only">
        Press Shift plus Space or Shift plus Enter to reorder. Use arrow keys to move. Press Space
        or Enter to drop, or Escape to cancel.
      </div>
      <div
        id="dnd-live-region"
        ref={(el) => (liveRegion = el)}
        class="sr-only"
        aria-live="assertive"
        aria-atomic="true"
      />
      <ul id="sortable-list" ref={(el) => (listEl = el)} role="list" aria-label="Sortable items">
        <For each={items()}>
          {(item) => (
            <SortableItem
              item={item}
              isDragging={draggingId() === item.id}
              isA11yDragging={a11yDrag()?.itemId === item.id}
              pointerDrag={pointerDrag()}
              setPointerDrag={setPointerDrag}
              lastSwapFromIdx={lastSwapFromIdx}
              a11yDrag={a11yDrag()}
              listEl={listEl}
              itemElements={itemElements}
              items={items()}
              virtualOrder={virtualOrder}
              dndObserver={dndObserverRef}
              itemStride={itemStride}
              onPointerDrop={onPointerDrop}
              virtualSwap={virtualSwap}
            />
          )}
        </For>
      </ul>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find the root element');

render(() => <App />, root);
```

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Solid - Sortable List - Accessible</title>
    <meta
      name="description"
      content="A sortable list with two interaction modes. (1) Pointer drag: drag items via mouse or touch -- a DragPreview proxy follows the pointer while the original stays in-flow as a translucent placeholder; DndObserver detects collisions to trigger reorder. (2) Keyboard reorder: focus an item and press Shift+Space or Shift+Enter to pick up, arrow keys to move, Space/Enter to drop, Escape to cancel. During either interaction, items are repositioned visually with CSS transforms while the DOM order stays fixed. The final DOM reorder only happens on drop. A live region announces every position change for screen readers."
    />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
:root {
  --color: rgba(255, 255, 245, 0.86);
  --bg-color: #111;

  --list-gap: 6px;

  --item-border-radius: 6px;
  --item-height: 40px;
  --item-padding-inline: 12px;

  --item-color: rgba(255, 255, 245, 0.86);
  --item-color-hover: rgba(255, 255, 245, 0.9);
  --item-color-focus: #fff;
  --item-color-dragging: rgba(255, 255, 245, 1);
  --item-bg-color: #222;
  --item-bg-color-hover: #2a2a2a;
  --item-bg-color-focus: #333;
  --item-bg-color-dragging: #1a3a1a;
  --item-border-color: #333;
  --item-border-color-hover: #444;
  --item-border-color-focus: #555;
  --item-border-color-dragging: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: auto;
  font-family:
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(100%);
  border: 0;
  white-space: nowrap;
}

#sortable-list {
  list-style: none;
  margin: 0;
  padding: 20px 0;
  width: 100%;
  max-width: 400px;
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: var(--list-gap);
}

[data-drag-preview-proxy] {
  z-index: 1000;
}

.sortable-item {
  list-style: none;
  overflow-anchor: none;
  margin: 0;
  padding: 0;
  border-radius: var(--item-border-radius);

  &.placeholder {
    opacity: 0.4;
  }

  &.a11y-dragging {
    position: relative;
    z-index: 1;
  }

  &.drag-preview {
    pointer-events: none;
  }

  & a {
    display: flex;
    align-items: center;
    height: var(--item-height);
    padding: 0 var(--item-padding-inline);
    color: var(--item-color);
    background: var(--item-bg-color);
    border: 1px solid var(--item-border-color);
    touch-action: none;
    border-radius: inherit;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    outline: none;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;

    box-shadow: 0 4px 16px rgba(0, 0, 0, 0);

    transition:
      color 150ms ease,
      background-color 150ms ease,
      border-color 150ms ease,
      box-shadow 150ms ease;

    :not(.is-dragging) > .sortable-item > &:hover {
      color: var(--item-color-hover);
      background: var(--item-bg-color-hover);
      border-color: var(--item-border-color-hover);
    }

    &:focus {
      outline: none;
    }

    &:focus-visible {
      color: var(--item-color-focus);
      background: var(--item-bg-color-focus);
      border-color: var(--item-border-color-focus);
      box-shadow: 0 0 0 2px var(--item-border-color-focus);
    }

    .sortable-item.drag-preview & {
      color: var(--item-color-dragging);
      background: var(--item-bg-color-dragging);
      border-color: var(--item-border-color-dragging);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
      cursor: grabbing;
    }

    .sortable-item.a11y-dragging & {
      color: var(--item-color-dragging);
      background: var(--item-bg-color-dragging);
      border-color: var(--item-border-color-dragging);
    }
  }
}
```

```css [base.css]
:root {
  --bg-color: #111;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: rgba(0, 0, 0, 0.7);
  --card-bgColor: var(--theme-color);
  --card-color--focus: var(--card-color);
  --card-bgColor--focus: #db55ff;
  --card-color--drag: var(--card-color);
  --card-bgColor--drag: #55ff9c;
}

* {
  box-sizing: border-box;
}

html {
  height: 100%;
  background: var(--bg-color);
  color: var(--color);
  background-size: 40px 40px;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
  overflow: hidden;
}

.card {
  display: flex;
  justify-content: safe center;
  align-items: safe center;
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 7px;
  border: 1.5px solid var(--bg-color);
  font-size: 30px;

  & svg {
    width: 1em;
    height: 1em;
    fill: var(--card-color);
  }

  @media (hover: hover) and (pointer: fine) {
    &:hover,
    &:focus-visible {
      background-color: var(--card-bgColor--focus);
      color: var(--card-color--focus);

      & svg {
        fill: var(--card-color--focus);
      }
    }

    &:focus-visible {
      outline-offset: 4px;
      outline: 1px solid var(--card-bgColor--focus);
    }
  }

  &.draggable {
    cursor: grab;
    touch-action: none;
  }

  &.dragging {
    cursor: grabbing;
    background-color: var(--card-bgColor--drag);
    color: var(--card-color--drag);

    & svg {
      fill: var(--card-color--drag);
    }

    @media (hover: hover) and (pointer: fine) {
      &:focus-visible {
        outline: 1px solid var(--card-bgColor--drag);
      }
    }
  }
}
```

:::
