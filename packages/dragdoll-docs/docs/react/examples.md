# Examples

## Draggable - Basic

A minimal setup with four draggable elements using pointer and keyboard (motion) sensor. You can drag them all at once too if you have a multi-touch device (e.g. phone or tablet).

<div class="example"><iframe src="/dragdoll/react-examples/001-draggable-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/001-draggable-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  useDraggable,
  useDraggableDrag,
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
  const draggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      onStart: () => {
        setZIndex(++zIndexRef.current);
      },
    }),
    [elementRef, zIndexRef],
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

function App() {
  const zIndexRef = useRef(1);
  return [1, 2, 3, 4].map((id) => <DraggableCardMemo key={id} zIndexRef={zIndexRef} />);
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Basic</title>
    <meta
      name="description"
      content="A minimal setup with four draggable elements using pointer and keyboard (motion) sensor. You can drag them all at once too if you have a multi-touch device (e.g. phone or tablet)."
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

## Draggable - Auto Scroll

This example demonstrates quite a lot of things. We use a drag container and freeze `left` and `top` values before we move the dragged element into the drag container. The draggable element has percentage based left and top values, which would not be correct when the element is moved to the drag container, which has different dimensions. Lastly we use the auto scroll plugin and configure it to scroll the viewport on y-axis when the dragged element is close to its edges. Note that we also set auto scroll target's `padding.top` and `padding.bottom` to `Infinity` to allow the scrolling to continue even if you drag the element past the edges.

<div class="example"><iframe src="/dragdoll/react-examples/002-draggable-auto-scroll/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/002-draggable-auto-scroll/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  useDraggable,
  useDraggableAutoScroll,
  UseDraggableAutoScrollSettings,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  dragContainerRef,
}: {
  dragContainerRef: RefObject<HTMLElement | null>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor({
    computeSpeed: () => 100,
  });

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      // We are doing the very thing here we advise against in the docs. We use
      // the container option and provide a React controlled element to the
      // elements option. However, in this case this will work without any
      // issues because we are making sure React has no reason to move the
      // dragged element in the DOM during the drag.
      container: () => dragContainerRef.current || null,
      elements: () => (elementRef.current ? [elementRef.current] : []),
      frozenStyles: () => ['left', 'top'],
    }),
    [dragContainerRef],
  );

  const autoScrollSettings: UseDraggableAutoScrollSettings = useMemo(
    () => ({
      targets: [
        {
          element: window,
          axis: 'y',
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    }),
    [],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], draggableSettings),
    autoScrollSettings,
  );

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
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  const dragContainerRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div ref={dragContainerRef} className="drag-container" />
      <div className="card-container">
        <DraggableCardMemo key="card" dragContainerRef={dragContainerRef} />
      </div>
    </>
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Auto Scroll</title>
    <meta
      name="description"
      content="This example demonstrates quite a lot of things. We use a drag container and freeze `left` and `top` values before we move the dragged element into the drag container. The draggable element has percentage based left and top values, which would not be correct when the element is moved to the drag container, which has different dimensions. Lastly we use the auto scroll plugin and configure it to scroll the viewport on y-axis when the dragged element is close to its edges. Note that we also set auto scroll target's `padding.top` and `padding.bottom` to `Infinity` to allow the scrolling to continue even if you drag the element past the edges."
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

.drag-container {
  position: fixed;
  left: 0;
  top: 0;
  width: 0px;
  height: 0px;
}

.card-container {
  position: absolute;
  inset: 0;
}

.card.draggable {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
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

## Draggable - Transformed

Draggable automagically handles (2D) transformed ancestors and the dragged element itself, out of the box, performantly. The draggable element is always guaranteed to move in sync with the active sensor, to the same direction and the same distance, regardless of any CSS transforms or zoom in any part of the document. In this example we showcase a scenario where the draggable element is within two differently transformed containers with different transform origins and uses a differently transformed drag container that's also wrapped in an extra transformed container. The draggable element itself also has transforms applied.

<div class="example"><iframe src="/dragdoll/react-examples/003-draggable-transformed/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/003-draggable-transformed/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  useDraggable,
  useDraggableAutoScroll,
  UseDraggableAutoScrollSettings,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  dragContainerRef,
}: {
  dragContainerRef: RefObject<HTMLElement | null>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor({
    computeSpeed: () => 100,
  });

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      // We are doing the very thing here we advise against in the docs. We use
      // the container option and provide a React controlled element to the
      // elements option. However, in this case this will work without any
      // issues because we are making sure React has no reason to move the
      // dragged element in the DOM during the drag.
      container: () => dragContainerRef.current || null,
      elements: () => (elementRef.current ? [elementRef.current] : []),
      frozenStyles: () => ['left', 'top'],
    }),
    [dragContainerRef],
  );

  const autoScrollSettings: UseDraggableAutoScrollSettings = useMemo(
    () => ({
      targets: [
        {
          element: window,
          axis: 'y',
          padding: { top: Infinity, bottom: Infinity },
        },
      ],
    }),
    [],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], draggableSettings),
    autoScrollSettings,
  );

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
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  const dragContainerRef = useRef<HTMLDivElement | null>(null);
  return (
    <>
      <div className="drag-container-outer">
        <div ref={dragContainerRef} className="drag-container" />
      </div>
      <div className="card-container-outer">
        <div className="card-container">
          <DraggableCardMemo key="card" dragContainerRef={dragContainerRef} />
        </div>
      </div>
    </>
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Transformed</title>
    <meta
      name="description"
      content="Draggable automagically handles (2D) transformed ancestors and the dragged element itself, out of the box, performantly. The draggable element is always guaranteed to move in sync with the active sensor, to the same direction and the same distance, regardless of any CSS transforms or zoom in any part of the document. In this example we showcase a scenario where the draggable element is within two differently transformed containers with different transform origins and uses a differently transformed drag container that's also wrapped in an extra transformed container. The draggable element itself also has transforms applied."
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

.drag-container-outer {
  position: fixed;
  left: 0;
  top: 0;
  width: 0px;
  height: 0px;
  transform: scale(0.3) skew(10deg, 10deg);
  transform-origin: 17px 37px;
}

.drag-container {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 0px;
  height: 0px;
  transform: scale(0.7) skew(10deg, 10deg);
  transform-origin: 27px 47px;
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

## Draggable - Locked Axis

Here we have two elements which can be dragged on one axis only. You can use this example as the basis of building your own custom position modifiers (a powerful feature that allows you to control a dragged element's position at every step of the drag process).

<div class="example"><iframe src="/dragdoll/react-examples/004-draggable-locked-axis/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/004-draggable-locked-axis/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  axis,
  zIndexRef,
}: {
  axis: 'x' | 'y';
  zIndexRef: RefObject<number>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [zIndex, setZIndex] = useState(1);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      positionModifiers: [
        (change, { item }) => {
          const { element } = item;
          const allowX = element.classList.contains('axis-x');
          const allowY = element.classList.contains('axis-y');
          if (allowX && !allowY) {
            change.y = 0;
          } else if (allowY && !allowX) {
            change.x = 0;
          }
          return change;
        },
      ],
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

  const axisClass = axis === 'x' ? 'axis-x' : 'axis-y';
  const svgPath =
    axis === 'x'
      ? 'M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z'
      : 'M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3l0 293.5L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7l0-293.5 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z';
  const svgViewBox = axis === 'x' ? '0 0 512 512' : '0 0 320 512';

  return (
    <div
      ref={setRefs}
      className={`card draggable ${axisClass} ${drag ? 'dragging' : ''}`}
      style={{ zIndex }}
      tabIndex={0}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox={svgViewBox}>
        <path d={svgPath} />
      </svg>
    </div>
  );
});

function App() {
  const zIndexRef = useRef(1);
  return (
    <>
      <DraggableCardMemo axis="x" zIndexRef={zIndexRef} />
      <DraggableCardMemo axis="y" zIndexRef={zIndexRef} />
    </>
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Locked Axis</title>
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

## Draggable - Snap To Grid

A simple demo on how to use the built-in snap modifier.

<div class="example"><iframe src="/dragdoll/react-examples/005-draggable-snap-to-grid/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/005-draggable-snap-to-grid/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { createSnapModifier } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const DraggableCardMemo = memo(function DraggableCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardSensor({
    moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
  });

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      positionModifiers: [createSnapModifier(GRID_WIDTH, GRID_HEIGHT)],
    }),
    [],
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
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  return <DraggableCardMemo />;
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Snap To Grid</title>
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

## Draggable - Containment

A simple demo on how to use the built-in containment modifier. The first argument of `createContainmentModifier` should be a function that returns the client rect of the containment area. That function is called on every drag 'move' event and also on 'start' and 'end' events. The second argument is a boolean whose value is cached on start event to define if the modifier should track drifting of the sensor when the dragged element hits an edge of the containment area and the sensor keeps on moving away. If the drift is being tracked the draggable element will not be moved to the opposing direction until the sensor is back inside the containment area. By default the drift is tracked only for `PointerSensor`.

<div class="example"><iframe src="/dragdoll/react-examples/006-draggable-containment/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/006-draggable-containment/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { createContainmentModifier } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
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
    }),
    [],
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
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  return <DraggableCardMemo />;
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Containment</title>
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
npbody {
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

## Draggable - Center To Pointer

Here we use a custom position modifier to align the dragged element's center with the pointer sensor's position on drag start.

<div class="example"><iframe src="/dragdoll/react-examples/007-draggable-center-to-pointer/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/007-draggable-center-to-pointer/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { PointerSensor } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      positionModifiers: [
        (change, { drag, item, phase }) => {
          // Align the dragged element so that the pointer
          // is in the center of the element.
          if (
            // Only apply the alignment on the start phase.
            phase === 'start' &&
            // Only apply the alignment for the pointer sensor.
            drag.sensor instanceof PointerSensor &&
            // Only apply the alignment for the primary drag element.
            drag.items[0].element === item.element
          ) {
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
    }),
    [],
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
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  return <DraggableCardMemo />;
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Center To Pointer</title>
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

## Draggable - Drag Handle

A simple example on how to create a drag handle. There is no built-in 'handle' option, because it would be too limiting. In this example the `PointerSensor` is used for the handle element while the `KeyboardMotionSensor` is used normally for the draggable element. You could also create the `KeyboardMotionSensor` for the handle element if you wished, it's really up to your preferences. Hopefully this showcases how flexible and customizable DragDoll really is with its sensor system.

<div class="example"><iframe src="/dragdoll/react-examples/008-draggable-drag-handle/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/008-draggable-drag-handle/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { PointerSensor } from 'dragdoll';
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, StrictMode, useCallback, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();
  const [sensorType, setSensorType] = useState<'pointer' | 'keyboard' | null>(null);

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => (elementRef.current ? [elementRef.current] : []),
      onStart: (drag) => {
        setSensorType(drag.sensor instanceof PointerSensor ? 'pointer' : 'keyboard');
      },
      onEnd: () => {
        setSensorType(null);
      },
    }),
    [],
  );

  const draggable = useDraggable([pointerSensor, keyboardSensor], draggableSettings);
  const drag = useDraggableDrag(draggable);

  const setElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setKeyboardSensorRef(node);
    },
    [setKeyboardSensorRef],
  );

  const setHandleRef = useCallback(
    (node: HTMLDivElement | null) => {
      setPointerSensorRef(node);
    },
    [setPointerSensorRef],
  );

  return (
    <div
      ref={setElementRef}
      className={`card draggable ${drag ? 'dragging' : ''} ${drag && sensorType ? `${sensorType}-dragging` : ''}`}
      tabIndex={0}
    >
      <div ref={setHandleRef} className="handle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
        </svg>
      </div>
    </div>
  );
});

function App() {
  return <DraggableCardMemo />;
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Drag Handle</title>
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

## Draggable - Ghost Element

A commong drag and drop pattern is using a temporary 'ghost' element during the drag operation while letting the actual draggable element stay in the DOM as is. This example demonstrates how easy it is to accomplish that with DragDoll. The first step is _conjuring_ (it's up to you how) the ghost element within the `elements` option and aligning it visually with the draggable element. Then just return the ghost element (in an array) instead of the draggable element in the `elements` callback. Finally, on drag `end` event, you'll need to align the draggable element with the ghost element and hide/remove the ghost element. That's it. This way you have full programmatic power to build any kind of custom scenario with your ghost elements.

<div class="example"><iframe src="/dragdoll/react-examples/009-draggable-ghost-element/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/009-draggable-ghost-element/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  useDraggable,
  useDraggableDrag,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard() {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => {
        const element = elementRef.current;
        if (!element) return [];

        // Clone the element and align the clone with the original element.
        const elemRect = element.getBoundingClientRect();
        const clone = element.cloneNode(true) as HTMLElement;
        clone.style.position = 'fixed';
        clone.style.width = `${elemRect.width}px`;
        clone.style.height = `${elemRect.height}px`;
        clone.style.left = `${elemRect.left}px`;
        clone.style.top = `${elemRect.top}px`;

        // Add the ghost and dragging class to the clone. The ghost element will
        // be in dragging state for the duration of its existence.
        clone.classList.add('ghost', 'dragging');

        // We need to reset the transform to avoid the ghost element being
        // offset unintentionally. In this specific case, if we don't reset the
        // transform, the ghost element will be offset by the original element's
        // transform.
        clone.style.transform = '';

        // Append the ghost element to the body.
        document.body.appendChild(clone);

        return [clone];
      },

      onEnd: (drag) => {
        const element = elementRef.current;
        if (!element) return;

        const dragItem = drag.items[0];

        // Move the original element to the ghost element's position. We use
        // DOMMatrix to first combine the original element's transform with the
        // ghost element's transform and then apply the combined transform to the
        // original element.
        const matrix = new DOMMatrix().setMatrixValue(
          `translate(${dragItem.position.x}px, ${dragItem.position.y}px) ${element.style.transform}`,
        );
        element.style.transform = `${matrix}`;

        // Remove the ghost element.
        dragItem.element.remove();
      },
    }),
    [],
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
    <div ref={setRefs} className={`card draggable ${drag ? 'dragging' : ''}`} tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  return <DraggableCardMemo />;
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Ghost Element</title>
    <meta
      name="description"
      content="A commong drag and drop pattern is using a temporary 'ghost' element during the drag operation while letting the actual draggable element stay in the DOM as is. This example demonstrates how easy it is to accomplish that with DragDoll. The first step is _conjuring_ (it's up to you how) the ghost element within the `elements` option and aligning it visually with the draggable element. Then just return the ghost element (in an array) instead of the draggable element in the `elements` callback. Finally, on drag `end` event, you'll need to align the draggable element with the ghost element and hide/remove the ghost element. That's it. This way you have full programmatic power to build any kind of custom scenario with your ghost elements."
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

  &.dragging:not(.ghost) {
    opacity: 0.5;
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

<div class="example"><iframe src="/dragdoll/react-examples/010-draggable-multiple-elements/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/010-draggable-multiple-elements/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  useDraggable,
  UseDraggableSettings,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import { memo, RefObject, StrictMode, useCallback, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DraggableCardMemo = memo(function DraggableCard({
  id,
  elementRefsMap,
}: {
  id: number;
  elementRefsMap: RefObject<Map<number, HTMLDivElement | null>>;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => {
        return Array.from(elementRefsMap.current.values()).filter((ref) => !!ref);
      },
      startPredicate: () => {
        return !elementRef.current?.classList.contains('dragging');
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
    }),
    [elementRefsMap],
  );

  useDraggable([pointerSensor, keyboardSensor], draggableSettings);

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      setPointerSensorRef(node);
      setKeyboardSensorRef(node);
      if (node) {
        elementRefsMap.current.set(id, node);
      } else {
        elementRefsMap.current.delete(id);
      }
    },
    [elementRefsMap, id, setPointerSensorRef, setKeyboardSensorRef],
  );

  return (
    <div ref={setRefs} className="card draggable" tabIndex={0}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

function App() {
  const elementRefsMap = useRef<Map<number, HTMLDivElement | null>>(new Map());
  return (
    <>
      {[0, 1, 2, 3].map((id) => (
        <DraggableCardMemo key={id} id={id} elementRefsMap={elementRefsMap} />
      ))}
    </>
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

## DndObserver - Basic

A basic example of using DndObserver with Draggable and Droppable elements. Here we highlight the dropzone element that overlaps most with the dragged element.

<div class="example"><iframe src="/dragdoll/react-examples/011-dnd-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/011-dnd-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
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

<div class="example"><iframe src="/dragdoll/react-examples/012-dnd-advanced-collision-detector/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/react-examples/012-dnd-advanced-collision-detector/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
  AnyDraggable,
  Droppable,
} from 'dragdoll';
import {
  DndObserverContext,
  useDndObserver,
  useDraggable,
  useDraggableAutoScroll,
  UseDraggableAutoScrollSettings,
  useDraggableDrag,
  UseDraggableSettings,
  useDroppable,
  useKeyboardMotionSensor,
  usePointerSensor,
} from 'dragdoll-react';
import {
  memo,
  ReactNode,
  RefObject,
  StrictMode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createRoot } from 'react-dom/client';

type ListId = 'left' | 'right';

// Helper to get container info from a droppable element
function getContainerInfo(container: HTMLElement): { listId: ListId; index: number } {
  return {
    listId: (container.getAttribute('data-list-id') || 'left') as ListId,
    index: parseInt(container.getAttribute('data-index') || '0', 10),
  };
}

// Helper to create a ghost/preview element
function createGhostElement(element: HTMLElement, draggableId: string): HTMLElement {
  const rect = element.getBoundingClientRect();
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'fixed';
  clone.style.width = `${rect.width}px`;
  clone.style.height = `${rect.height}px`;
  clone.style.left = `${rect.left}px`;
  clone.style.top = `${rect.top}px`;
  clone.style.transform = '';
  clone.classList.add('ghost', 'dragging');
  clone.setAttribute('data-id', draggableId);
  document.body.appendChild(clone);
  return clone;
}

// Helper to cleanup after drag ends
function cleanupDrag(
  previewElement: HTMLElement | null,
  originalElement: HTMLElement | null,
  draggableId: string,
  bestMatch: Droppable | null,
  setHiddenIds: React.Dispatch<React.SetStateAction<Set<string>>>,
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

// Helper to find the best matching droppable from contacts
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

// Helper to calculate target position for animation
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

// Collision detector factory
const collisionDetector = (ctx: any) => new AdvancedCollisionDetector(ctx);

// Constants
const ANIMATION_EPSILON = 0.5; // Minimum distance to trigger animation

const DraggableCardMemo = memo(function DraggableCard({
  draggableId,
  scrollContainerRefs,
  onDragStart,
  isHidden,
}: {
  draggableId: string;
  scrollContainerRefs: RefObject<HTMLElement[]>;
  onDragStart: (draggableId: string) => void;
  isHidden: boolean;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [pointerSensor, setPointerSensorRef] = usePointerSensor();
  const [keyboardSensor, setKeyboardSensorRef] = useKeyboardMotionSensor();

  const draggableSettings: UseDraggableSettings = useMemo(
    () => ({
      elements: () => {
        const element = elementRef.current;
        if (!element) return [];
        return [createGhostElement(element, draggableId)];
      },
      container: document.body,
      frozenStyles: () => ['width', 'height'],
      startPredicate: () => !elementRef.current?.classList.contains('animate'),
      onStart: () => {
        elementRef.current?.classList.add('dragging', 'hidden');
        onDragStart(draggableId);
      },
    }),
    [draggableId, onDragStart],
  );

  const autoScrollSettings: UseDraggableAutoScrollSettings = useMemo(
    () => ({
      targets: () =>
        (scrollContainerRefs.current || []).map((scrollContainer) => ({
          element: scrollContainer,
          axis: 'y',
          padding: { top: 0, bottom: 0 },
        })),
    }),
    [scrollContainerRefs],
  );

  const draggable = useDraggableAutoScroll(
    useDraggable([pointerSensor, keyboardSensor], draggableSettings),
    autoScrollSettings,
  );

  useDraggableDrag(draggable);

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
      className={`card draggable ${isHidden ? 'hidden' : ''}`}
      tabIndex={0}
      data-id={draggableId}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
      </svg>
    </div>
  );
});

const DroppableZoneMemo = memo(function DroppableZone({
  containedDraggableId,
  listId,
  index,
  children,
}: {
  containedDraggableId?: string;
  listId: ListId;
  index: number;
  children?: ReactNode;
}) {
  const [_droppable, setDroppableElementRef] = useDroppable({ data: {} });

  return (
    <div
      ref={setDroppableElementRef}
      className="droppable"
      data-list-id={listId}
      data-index={index}
      {...(containedDraggableId ? { 'data-draggable-contained': containedDraggableId } : {})}
    >
      {children}
    </div>
  );
});

const ScrollListMemo = memo(function ScrollList({
  listId,
  slots,
  hiddenIds,
  onDragStart,
  scrollContainerRefs,
}: {
  listId: ListId;
  slots: Array<string | null>;
  hiddenIds: Set<string>;
  onDragStart: (draggableId: string) => void;
  scrollContainerRefs: RefObject<HTMLElement[]>;
}) {
  const setScrollListRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (node && scrollContainerRefs.current && !scrollContainerRefs.current.includes(node)) {
        scrollContainerRefs.current.push(node);
      }
    },
    [scrollContainerRefs],
  );

  return (
    <div ref={setScrollListRef} className="scroll-list" data-list-id={listId}>
      {slots.map((slotDraggableId, i) => (
        <DroppableZoneMemo
          key={i}
          listId={listId}
          index={i}
          containedDraggableId={slotDraggableId || undefined}
        >
          {slotDraggableId && (
            <DraggableCardMemo
              draggableId={slotDraggableId}
              scrollContainerRefs={scrollContainerRefs}
              onDragStart={onDragStart}
              isHidden={hiddenIds.has(slotDraggableId)}
            />
          )}
        </DroppableZoneMemo>
      ))}
    </div>
  );
});

function App() {
  const scrollContainerRefs = useRef<HTMLElement[]>([]);
  const bestMatchMapRef = useRef<Map<AnyDraggable, Droppable>>(new Map());
  const [leftSlots, setLeftSlots] = useState<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '1' : null)),
  );
  const [rightSlots, setRightSlots] = useState<Array<string | null>>(
    Array.from({ length: 16 }, (_, i) => (i === 0 ? '2' : null)),
  );
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  const onDragStart = useCallback((id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const updateSlot = useCallback((listId: ListId, index: number, value: string | null) => {
    const setter = listId === 'left' ? setLeftSlots : setRightSlots;
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const moveDraggableWithinReact = useCallback(
    (id: string, fromList: ListId, fromIndex: number, toList: ListId, toIndex: number) => {
      if (fromList === toList && fromIndex === toIndex) return;
      updateSlot(fromList, fromIndex, null);
      updateSlot(toList, toIndex, id);
    },
    [updateSlot],
  );

  const dndObserver = useDndObserver<AdvancedCollisionData>({
    collisionDetector,
    onCollide: ({ draggable, contacts }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const nextBestMatch = findBestMatch(contacts, draggableId);
      const currentBestMatch = bestMatchMapRef.current.get(draggable);

      if (nextBestMatch && nextBestMatch !== currentBestMatch) {
        currentBestMatch?.element?.removeAttribute('data-draggable-over');
        nextBestMatch?.element?.setAttribute('data-draggable-over', draggableId);
        bestMatchMapRef.current.set(draggable, nextBestMatch);
      }
    },
    onEnd: ({ draggable, canceled }) => {
      const previewElement = draggable.drag?.items[0].element as HTMLElement | null;
      if (!previewElement) return;

      const draggableId = previewElement.getAttribute('data-id') || '';
      if (!draggableId) return;

      const bestMatch = bestMatchMapRef.current.get(draggable) || null;
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
          bestMatchMapRef.current,
          draggable,
        );
        return;
      }

      // Move item in React state if needed
      const from = getContainerInfo(originalContainer);
      const to = getContainerInfo(targetContainer);
      moveDraggableWithinReact(draggableId, from.listId, from.index, to.listId, to.index);

      // Animate preview to final position
      const baseLeft = parseFloat(previewElement.style.left || '0');
      const baseTop = parseFloat(previewElement.style.top || '0');
      const targetPos = getTargetPosition(targetContainer);
      const currentPos = previewElement.getBoundingClientRect();
      const deltaX = targetPos.left - currentPos.left;
      const deltaY = targetPos.top - currentPos.top;

      // Skip animation if already at target position
      if (Math.abs(deltaX) < ANIMATION_EPSILON && Math.abs(deltaY) < ANIMATION_EPSILON) {
        cleanupDrag(
          previewElement,
          originalElement,
          draggableId,
          bestMatch,
          setHiddenIds,
          bestMatchMapRef.current,
          draggable,
        );
        return;
      }

      // Animate preview to target position
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
            bestMatchMapRef.current,
            draggable,
            true, // Include 'animate' class removal
          );
          document.body.removeEventListener('transitionend', onTransitionEnd);
        }
      };
      document.body.addEventListener('transitionend', onTransitionEnd);
    },
  });

  return (
    <DndObserverContext.Provider value={dndObserver}>
      <div className="container">
        <ScrollListMemo
          listId="left"
          slots={leftSlots}
          hiddenIds={hiddenIds}
          onDragStart={onDragStart}
          scrollContainerRefs={scrollContainerRefs}
        />
        <ScrollListMemo
          listId="right"
          slots={rightSlots}
          hiddenIds={hiddenIds}
          onDragStart={onDragStart}
          scrollContainerRefs={scrollContainerRefs}
        />
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

.ghost {
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
