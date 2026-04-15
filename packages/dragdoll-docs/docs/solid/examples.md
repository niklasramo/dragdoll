# Solid Examples

## Draggable Basic

A minimal setup showcasing multiple draggables powered by the SolidJS bindings.

<div class="example"><iframe src="/dragdoll/examples/solid/001-draggable-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/001-draggable-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Basic</title>
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

## Draggable Auto Scroll & Transforms

Demonstrates auto-scrolling during drag and transparent CSS transform handling. The draggable element is always guaranteed to move in sync with the active sensor, regardless of any CSS transforms or zoom in the document. Auto-scroll kicks in when you drag near the window edges.

<div class="example"><iframe src="/dragdoll/examples/solid/002-draggable-auto-scroll/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/002-draggable-auto-scroll/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Auto Scroll &amp; Transforms</title>
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

## Draggable Locked Axis

Here we have two elements which can be dragged on one axis only. You can use this example as the basis of building your own custom position modifiers (a powerful feature that allows you to control a dragged element's position at every step of the drag process).

<div class="example"><iframe src="/dragdoll/examples/solid/003-draggable-locked-axis/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/003-draggable-locked-axis/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Locked Axis</title>
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

## Draggable Snap To Grid

A simple demo on how to use the built-in snap modifier.

<div class="example"><iframe src="/dragdoll/examples/solid/004-draggable-snap-to-grid/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/004-draggable-snap-to-grid/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Snap To Grid</title>
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

## Draggable Containment

A simple demo on how to use the built-in containment modifier. The first argument of `createContainmentModifier` should be a function that returns the client rect of the containment area. That function is called on every drag 'move' event and also on 'start' and 'end' events. The second argument is a boolean whose value is cached on start event to define if the modifier should track drifting of the sensor when the dragged element hits an edge of the containment area and the sensor keeps on moving away. If the drift is being tracked the draggable element will not be moved to the opposing direction until the sensor is back inside the containment area. By default the drift is tracked only for `PointerSensor`.

<div class="example"><iframe src="/dragdoll/examples/solid/005-draggable-containment/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/005-draggable-containment/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Containment</title>
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

## Draggable Combined Modifiers

Demonstrates grid-aware containment. The element has a distance threshold, snaps to a 40px grid, and is contained within the viewport without partial grid cells at the edges.

<div class="example"><iframe src="/dragdoll/examples/solid/006-draggable-combined-modifiers/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/006-draggable-combined-modifiers/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { createContainmentModifier } from 'dragdoll';
import { useDraggable, useDraggableDrag, usePointerSensor } from 'dragdoll-solid';
import { render } from 'solid-js/web';

const THRESHOLD = 5;
const GRID = 40;

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], {
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
  });
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
    <title>Draggable Combined Modifiers</title>
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

## Draggable Center To Pointer

Here we use a custom position modifier to align the dragged element's center with the pointer sensor's position on drag start.

<div class="example"><iframe src="/dragdoll/examples/solid/007-draggable-center-to-pointer/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/007-draggable-center-to-pointer/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Center To Pointer</title>
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

## Draggable Drag Handle

A simple example on how to create a drag handle. There is no built-in 'handle' option, because it would be too limiting. In this example the `PointerSensor` is used for the handle element while the `KeyboardMotionSensor` is used normally for the draggable element. You could also create the `KeyboardMotionSensor` for the handle element if you wished, it's really up to your preferences. Hopefully this showcases how flexible and customizable DragDoll really is with its sensor system.

<div class="example"><iframe src="/dragdoll/examples/solid/008-draggable-drag-handle/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/008-draggable-drag-handle/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable Drag Handle</title>
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

## Draggable - Multiple Elements

Sometimes you might want to drag multiple elements at once and DragDoll provides you an easy way to do that. Just return an array of elements in the `elements` callback and you're good to go.

<div class="example"><iframe src="/dragdoll/examples/solid/009-draggable-multiple-elements/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/009-draggable-multiple-elements/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable - Multiple Elements</title>
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

## Draggable - Start Threshold

A draggable link element that requires 5px of movement before the drag starts. Clicking the link works normally. When drag starts, the element position is offset so the pointer stays at the original position relative to the element.

<div class="example"><iframe src="/dragdoll/examples/solid/010-draggable-start-threshold/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/010-draggable-start-threshold/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import { DraggableModifier, PointerSensor, startOffsetModifier } from 'dragdoll';
import { useDraggable, useDraggableDrag, usePointerSensor } from 'dragdoll-solid';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';

const THRESHOLD = 5;

function DraggableCard() {
  let element: HTMLAnchorElement | null = null;
  const [zIndex, setZIndex] = createSignal(1);
  let zIndexCounter = 1;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], {
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
  });
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
    <title>Draggable - Start Threshold</title>
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

## Draggable - Touch Delay

A draggable element with a 1 second touch delay. On touch devices, you must hold the element for 1 second before dragging starts, allowing normal scrolling. Mouse and pen input start dragging immediately.

<div class="example"><iframe src="/dragdoll/examples/solid/011-draggable-touch-delay/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/011-draggable-touch-delay/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */
import {
  createTouchDelayPredicate,
  DraggableModifier,
  PointerSensor,
  startOffsetModifier,
} from 'dragdoll';
import { useDraggable, useDraggableDrag, usePointerSensor } from 'dragdoll-solid';
import { render } from 'solid-js/web';

function DraggableCard() {
  let element: HTMLDivElement | null = null;
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();

  const draggable = useDraggable([pointerSensor], {
    elements: () => (element ? [element] : []),
    startPredicate: createTouchDelayPredicate({ touchDelay: 1000 }),
    positionModifiers: [startOffsetModifier as unknown as DraggableModifier<PointerSensor>],
  });
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
    <title>Draggable - Touch Delay</title>
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

## Draggable - Drag Preview

A drag preview inside a scrollable container with complex CSS transforms. The proxy element inherits ancestor transforms via the core's transform normalization, preserving the exact visual shape during drag. Auto-scroll keeps working across the transformed container.

<div class="example"><iframe src="/dragdoll/examples/solid/012-draggable-drag-preview/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/012-draggable-drag-preview/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable - Drag Preview</title>
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

## Draggable - Multi-Item Drag Preview

One draggable moves three items simultaneously via drag previews. Each item sits inside its own overflow-hidden container with different complex CSS transforms (scale, skew, rotation). The core's transform normalization ensures every proxy matches its original's visual shape after reparenting to document.body.

<div class="example"><iframe src="/dragdoll/examples/solid/013-draggable-multi-drag-preview/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/013-draggable-multi-drag-preview/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>Draggable - Multi-Item Drag Preview</title>
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

## DndObserver - Basic

A basic example of using DndObserver with Draggable and Droppable elements. Here we highlight the dropzone element that overlaps most with the dragged element.

<div class="example"><iframe src="/dragdoll/examples/solid/014-dnd-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/014-dnd-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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
    <title>DndObserver - Basic</title>
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

## DndObserver - Advanced Collision Detector

Advanced collision detection with scrollable droppable lists. Here we can see how the advanced collision detector respects the visibility of the droppables. Only the visible parts of the droppables (as seen from the perspective of the draggable) are considered for collisions.

<div class="example"><iframe src="/dragdoll/examples/solid/015-dnd-advanced-collision-detector/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/015-dnd-advanced-collision-detector/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

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

const dragContainer = document.getElementById('drag-container') as HTMLElement;

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
  dragContainer.appendChild(clone);
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
  elementMap: Map<string, HTMLDivElement>;
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
        props.elementMap.set(props.draggableId, node);
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
  elementMap: Map<string, HTMLDivElement>;
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
                  elementMap={props.elementMap}
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
  // O(1) lookup for original elements by draggable id.
  const elementMap = new Map<string, HTMLDivElement>();

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
      const originalElement = elementMap.get(draggableId) || null;
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

      // Compute animation values BEFORE updating Solid state.
      // Solid re-renders synchronously, so the DOM changes
      // immediately when we call moveDraggable(). We need the
      // current positions before that happens.
      const from = getContainerInfo(originalContainer);
      const to = getContainerInfo(targetContainer);
      const baseLeft = parseFloat(previewElement.style.left || '0');
      const baseTop = parseFloat(previewElement.style.top || '0');
      const targetPos = getTargetPosition(targetContainer);
      const currentPos = previewElement.getBoundingClientRect();
      const deltaX = targetPos.left - currentPos.left;
      const deltaY = targetPos.top - currentPos.top;

      // Now update Solid state (triggers synchronous re-render).
      moveDraggable(draggableId, from.listId, from.index, to.listId, to.index);

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
      previewElement.clientHeight;
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
          elementMap={elementMap}
        />
        <ScrollList
          listId="right"
          slots={rightSlots()}
          hiddenIds={hiddenIds()}
          onDragStart={onDragStart}
          scrollContainers={scrollContainers}
          elementMap={elementMap}
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
    <title>DndObserver - Advanced Collision Detector</title>
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
    <div id="drag-container"></div>
    <script type="module" src="index.tsx"></script>
  </body>
</html>
```

```css [index.css]
body {
  width: 100%;
  height: 100%;
}

#drag-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  contain: layout;
  z-index: 9999;
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

## Sortable List - Accessible

A sortable list with two interaction modes. (1) Pointer drag: drag items via mouse or touch -- a DragPreview proxy follows the pointer while the original stays in-flow as a translucent placeholder; DndObserver detects collisions to trigger reorder. (2) Keyboard reorder: focus an item and press Shift+Space or Shift+Enter to pick up, arrow keys to move, Space/Enter to drop, Escape to cancel. During either interaction, items are repositioned visually with CSS transforms while the DOM order stays fixed. The final DOM reorder only happens on drop. A live region announces every position change for screen readers.

<div class="example"><iframe src="/dragdoll/examples/solid/016-sortable-accessible/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/solid/016-sortable-accessible/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
/** @jsxImportSource solid-js */

// Sortable list with pointer drag and keyboard reorder.
//
// Pointer: drag items via mouse/touch. A DragPreview proxy
// follows the pointer while the original stays in-flow as a
// placeholder. DndObserver handles collision-based reorder.
//
// Keyboard: Shift+Space/Enter to pick up, arrows to move,
// Space/Enter to drop, Escape to cancel.
//
// Items are visually repositioned with CSS transforms during
// drag. DOM order only changes on drop.

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

// ---------
// Constants
// ---------

const ITEM_COUNT = 100;
const POINTER_START_THRESHOLD_SQ = 8 * 8;
const SWAP_ANIM_DURATION = 150;
const DROP_ANIM_DURATION = 150;
const CANCEL_ANIM_DURATION = 200;
const SWAP_OVERLAP_THRESHOLD = 51;
const DRAG_PREVIEW_EXIT_TIMEOUT = CANCEL_ANIM_DURATION + 50;

// -----
// Types
// -----

interface ItemData {
  id: string;
  label: string;
  domIndex: number;
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

// ---------
// Utilities
// ---------

function isAboveThreshold(x: number, y: number, sx: number, sy: number, thSq: number): boolean {
  const dx = x - sx;
  const dy = y - sy;
  return dx * dx + dy * dy >= thSq;
}

const detector = (ctx: DndObserver<AdvancedCollisionData>) => new AdvancedCollisionDetector(ctx);

// ---
// App
// ---

function App() {
  // ---------
  // DOM refs
  // ---------

  let listEl: HTMLUListElement | null = null;
  let liveRegion: HTMLDivElement | null = null;
  const dragContainer = document.getElementById('drag-container') as HTMLElement;
  const itemElements = new Map<string, HTMLLIElement>();
  const itemsByElement = new Map<HTMLLIElement, ItemData>();

  // -----
  // State
  // -----

  const [items, setItems] = createSignal<ItemData[]>(
    Array.from({ length: ITEM_COUNT }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      domIndex: i,
    })),
  );

  let itemHeight = 0;
  let itemStride = 0;
  let listOffsetTop = 0;
  let virtualOrder: number[] | null = null;
  let virtualIndexOf: number[] | null = null;
  let cachedListRect: DOMRect | null = null;
  let lastSwapFromIdx = -1;

  const [pointerDrag, setPointerDrag] = createSignal<PointerDragState | null>(null);
  const [a11yDrag, setA11yDrag] = createSignal<A11yDragState | null>(null);
  const [draggingId, setDraggingId] = createSignal<string | null>(null);

  // -----------
  // Measurement
  // -----------

  function measure() {
    const its = items();
    if (its.length < 2) return;
    const el0 = itemElements.get(its[0].id);
    const el1 = itemElements.get(its[1].id);
    if (!el0 || !el1 || !listEl) return;
    const r0 = el0.getBoundingClientRect();
    const r1 = el1.getBoundingClientRect();
    itemHeight = r0.height;
    itemStride = r1.top - r0.top;
    listOffsetTop = r0.top - listEl.getBoundingClientRect().top;
  }

  function invalidateCache() {
    cachedListRect = null;
  }

  function getListRect(): DOMRect {
    return (cachedListRect ??= listEl!.getBoundingClientRect());
  }

  // --------------
  // Virtual layout
  // --------------

  function initVirtual() {
    measure();
    const its = items();
    virtualOrder = its.map((_, i) => i);
    virtualIndexOf = its.map((_, i) => i);
  }

  function vIdx(domIndex: number): number {
    return virtualIndexOf ? virtualIndexOf[domIndex] : domIndex;
  }

  function vSwap(from: number, to: number, animate = true) {
    if (!virtualOrder || !virtualIndexOf || from === to) return;

    const lo = Math.min(from, to);
    const hi = Math.max(from, to);

    const [moved] = virtualOrder.splice(from, 1);
    virtualOrder.splice(to, 0, moved);

    for (let i = lo; i <= hi; i++) {
      virtualIndexOf[virtualOrder[i]] = i;
    }

    const its = items();
    for (let i = lo; i <= hi; i++) {
      const di = virtualOrder[i];
      const el = itemElements.get(its[di].id);
      if (!el) continue;

      const newY = (i - di) * itemStride;
      const prev = parseFloat(el.style.transform?.match(/translateY\((.+?)px\)/)?.[1] || '0');
      if (prev === newY) continue;

      el.style.transform = newY === 0 ? '' : `translateY(${newY}px)`;

      if (animate) {
        const a = el.getAnimations();
        for (let j = 0; j < a.length; j++) a[j].cancel();
        el.animate(
          [
            { transform: `translateY(${prev}px)` },
            {
              transform: newY === 0 ? 'translateY(0px)' : `translateY(${newY}px)`,
            },
          ],
          { duration: SWAP_ANIM_DURATION, easing: 'ease' },
        );
      }
    }
  }

  function commitOrder() {
    if (!virtualOrder) return;

    const its = items();
    const next = virtualOrder.map((di) => ({
      ...its[di],
      domIndex: 0,
    }));
    for (let i = 0; i < next.length; i++) {
      next[i].domIndex = i;
    }

    virtualOrder = null;
    virtualIndexOf = null;
    clearTransforms();
    setItems(next);

    // Rebuild the element→item map after reorder.
    itemsByElement.clear();
    for (const it of next) {
      const el = itemElements.get(it.id);
      if (el) itemsByElement.set(el, it);
    }
  }

  function clearTransforms() {
    for (const el of itemElements.values()) {
      const a = el.getAnimations();
      for (let i = 0; i < a.length; i++) a[i].cancel();
      el.style.transform = '';
    }
  }

  function animToZero(dur: number) {
    for (const el of itemElements.values()) {
      const t = el.style.transform;
      if (!t || t === 'translateY(0px)') continue;
      const a = el.getAnimations();
      for (let i = 0; i < a.length; i++) a[i].cancel();
      el.style.transform = '';
      el.animate([{ transform: t }, { transform: 'translateY(0px)' }], {
        duration: dur,
        easing: 'ease',
      });
    }
  }

  function announce(msg: string) {
    if (liveRegion) liveRegion.textContent = msg;
  }

  // Measure after first render.
  createEffect(() => {
    items();
    measure();
    clearTransforms();
  });

  // -----------
  // DndObserver
  // -----------

  const observer = useDndObserver<AdvancedCollisionData>({
    collisionDetector: detector,
    onCollide: ({ collisions }) => {
      const d = pointerDrag();
      if (!d || !virtualOrder || !virtualIndexOf) return;

      const obs = obsRef;
      const its = items();
      const draggedItem = its.find((it) => it.id === d.itemId);
      if (!draggedItem) return;

      for (const c of collisions) {
        if (c.intersectionScore < SWAP_OVERLAP_THRESHOLD) break;

        const drop = obs?.droppables.get(c.droppableId);
        if (!drop) continue;

        const tid = (drop as Droppable).data.itemId as string;
        if (tid === d.itemId) continue;

        const target = its.find((it) => it.id === tid);
        if (!target) continue;

        const cur = vIdx(draggedItem.domIndex);
        const tgt = vIdx(target.domIndex);
        if (cur === tgt || tgt === lastSwapFromIdx) continue;

        lastSwapFromIdx = cur;
        vSwap(cur, tgt);
        invalidateCache();
        obs?.updateDroppableClientRects();
        break;
      }
    },
  });

  let obsRef: DndObserver<AdvancedCollisionData> | null = null;
  createEffect(() => {
    obsRef = observer();
  });

  // Track drag start/end for placeholder styling.
  createEffect(() => {
    const obs = observer();
    if (!obs) return;
    const sId = obs.on('start', () => {
      const d = pointerDrag();
      if (d) setDraggingId(d.itemId);
    });
    const eId = obs.on('end', () => setDraggingId(null));
    onCleanup(() => {
      obs.off('start', sId);
      obs.off('end', eId);
    });
  });

  // ----------------
  // Keyboard reorder
  // ----------------

  function a11yStart(itemId: string) {
    const its = items();
    const item = its.find((it) => it.id === itemId);
    if (!item) return;

    initVirtual();

    setA11yDrag({
      itemId,
      originalIndex: item.domIndex,
      currentIndex: item.domIndex,
    });

    const el = itemElements.get(itemId);
    if (el) el.scrollIntoView({ block: 'nearest' });

    announce(
      `Picked up ${item.label}. Position ` +
        `${item.domIndex + 1} of ${its.length}. ` +
        `Use arrow keys to move, Space or Enter ` +
        `to drop, Escape to cancel.`,
    );
  }

  function a11yMove(dir: -1 | 1) {
    const d = a11yDrag();
    if (!d || !virtualOrder) return;

    const ni = d.currentIndex + dir;
    if (ni < 0 || ni >= virtualOrder.length) return;

    vSwap(d.currentIndex, ni, false);
    setA11yDrag({ ...d, currentIndex: ni });

    const fr = listEl!.getBoundingClientRect();
    const gap = itemStride - itemHeight;
    const top = fr.top + listOffsetTop + ni * itemStride;
    const bot = top + itemHeight;
    if (top - gap < 0) {
      window.scrollBy(0, top - gap);
    } else if (bot + gap > window.innerHeight) {
      window.scrollBy(0, bot + gap - window.innerHeight);
    }

    const its = items();
    const item = its.find((it) => it.id === d.itemId);
    announce(`${item?.label || ''}, position ` + `${ni + 1} of ${virtualOrder.length}.`);
  }

  function a11yEnd(cancel: boolean) {
    const d = a11yDrag();
    if (!d) return;

    setA11yDrag(null);

    const its = items();
    const item = its.find((it) => it.id === d.itemId);

    if (cancel) {
      animToZero(CANCEL_ANIM_DURATION);
      virtualOrder = null;
      virtualIndexOf = null;
    } else {
      commitOrder();
    }

    announce(
      cancel
        ? `${item?.label || ''} reorder cancelled. ` +
            `Returned to position ` +
            `${d.originalIndex + 1}.`
        : `${item?.label || ''} dropped at position ` + `${d.currentIndex + 1} of ${its.length}.`,
    );

    const el = itemElements.get(d.itemId);
    el?.querySelector('a')?.focus({ preventScroll: true });
  }

  // ----------------
  // Keyboard handler
  // ----------------

  createEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
        const item = li && itemsByElement.get(li);
        if (item) {
          e.preventDefault();
          a11yStart(item.id);
        }
      }
    };

    document.addEventListener('keydown', onKey);
    onCleanup(() => document.removeEventListener('keydown', onKey));
  });

  // ------------
  // SortableItem
  // ------------

  function SortableItem(props: { item: ItemData }) {
    let liRef: HTMLLIElement | null = null;

    // Register element in shared maps.
    createEffect(() => {
      const li = liRef;
      if (li) {
        itemElements.set(props.item.id, li);
        itemsByElement.set(li, props.item);
      }
      onCleanup(() => {
        itemElements.delete(props.item.id);
        if (li) itemsByElement.delete(li);
      });
    });

    const [sensor, setSensorRef] = usePointerSensor();

    // Droppable — rect computed arithmetically.
    const [, setDropRef] = useDroppable({
      data: { itemId: props.item.id },
      computeClientRect: () => {
        if (!listEl || !itemStride) {
          return { x: 0, y: 0, width: 0, height: 0 };
        }
        const idx = vIdx(props.item.domIndex);
        const r = getListRect();
        return {
          x: r.left,
          y: r.top + listOffsetTop + idx * itemStride,
          width: r.width,
          height: itemHeight,
        };
      },
    });

    function onScroll() {
      invalidateCache();
      obsRef?.updateDroppableClientRects();
    }

    // Draggable with drag preview.
    const draggable = useDraggableAutoScroll(
      useDraggable([sensor], {
        elements: () => {
          const li = liRef;
          if (!li) return [];

          // Runs before DndObserver reads rects.
          initVirtual();
          invalidateCache();

          return [li];
        },
        dragPreview: true,
        dragPreviewContainer: dragContainer,
        dragPreviewExitTimeout: DRAG_PREVIEW_EXIT_TIMEOUT,
        startPredicate: ({
          event,
        }: {
          event: {
            x: number;
            y: number;
            startX: number;
            startY: number;
          };
        }) => {
          if (a11yDrag()) return false;
          return isAboveThreshold(
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
          ((c) => {
            c.x = 0;
            return c;
          }) as DraggableModifier<PointerSensor>,
        ],
        frozenStyles: (): ('width' | 'height')[] => ['width', 'height'],
        onStart: () => {
          liRef?.classList.add('placeholder');
          lastSwapFromIdx = -1;
          setPointerDrag({
            itemId: props.item.id,
            originalIndex: props.item.domIndex,
            cancelled: false,
          });
          listEl?.classList.add('is-dragging');
          window.addEventListener('scroll', onScroll);
        },
        onMove: () => {
          lastSwapFromIdx = -1;
        },
        onEnd: ({ endEvent }: { endEvent?: { type: string } | null }) => {
          window.removeEventListener('scroll', onScroll);
          const d = pointerDrag();
          if (!d) return;

          const cancelled = endEvent?.type === 'cancel';
          setPointerDrag({ ...d, cancelled });

          if (cancelled) {
            animToZero(CANCEL_ANIM_DURATION);
            virtualOrder = null;
            virtualIndexOf = null;
          }

          listEl?.classList.remove('is-dragging');
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

    const cn = () =>
      'sortable-item' +
      (draggingId() === props.item.id ? ' placeholder' : '') +
      (a11yDrag()?.itemId === props.item.id ? ' a11y-dragging' : '');

    return (
      <>
        <li
          ref={(n) => {
            liRef = n;
            setDropRef(n);
          }}
          class={cn()}
        >
          <a
            ref={(n) => setSensorRef(n)}
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
            let contentEl: HTMLDivElement | null = null;

            // Run exit animation after the content div
            // is inserted into the proxy by DragPreview.
            if (exiting) {
              queueMicrotask(() => {
                if (!contentEl) {
                  done();
                  return;
                }

                // The proxy is the parent of our content
                // (DragPreview uses insert(), no wrapper).
                const proxy = contentEl.parentElement as HTMLElement;
                const source = sourceElement as HTMLElement;
                const d = pointerDrag();
                const li = liRef;

                // Finish swap animations on the source.
                if (li) {
                  const a = li.getAnimations();
                  for (let i = 0; i < a.length; i++) a[i].finish();
                }

                const pR = proxy.getBoundingClientRect();
                const tR = source.getBoundingClientRect();
                const dx = tR.left - pR.left;
                const dy = tR.top - pR.top;

                const dur = d?.cancelled ? CANCEL_ANIM_DURATION : DROP_ANIM_DURATION;

                const cleanup = () => {
                  if (li) li.classList.remove('placeholder');
                  if (!d?.cancelled) commitOrder();
                  setPointerDrag(null);
                  done();
                };

                if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                  cleanup();
                  return;
                }

                const anim = proxy.animate(
                  [{ translate: '0px 0px' }, { translate: `${dx}px ${dy}px` }],
                  {
                    duration: dur,
                    easing: 'ease',
                    fill: 'forwards',
                    composite: 'add',
                  },
                );
                anim.onfinish = cleanup;
              });
            }

            return (
              <div
                ref={(el) => (contentEl = el)}
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

  // ----------
  // Render
  // ----------

  return (
    <DndObserverContext.Provider value={observer}>
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
        <For each={items()}>{(item) => <SortableItem item={item} />}</For>
      </ul>
    </DndObserverContext.Provider>
  );
}

const root = document.getElementById('root');
if (!root) throw new Error('Failed to find root.');

render(() => <App />, root);
```

```html [index.html]
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Sortable List - Accessible</title>
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
    <div id="drag-container"></div>
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

#drag-container {
  position: fixed;
  inset: 0;
  pointer-events: none;
  contain: layout;
  z-index: 9999;
}

#sortable-list {
  position: relative;
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
