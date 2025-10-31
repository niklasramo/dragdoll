# Examples

## Draggable - Basic (React)

React implementation of the basic draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/001-draggable-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/001-draggable-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const ICONS = ['🪩', '🎯', '🎲', '💿'];

function BasicDraggables() {
  const zIndexRef = useRef(0);

  return (
    <div className="cards">
      {ICONS.map((icon, index) => (
        <Draggable
          key={icon}
          id={`card-${index}`}
          pointerSensor
          keyboardSensor
          keyboardMotionSensor
          onStart={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.add('dragging');
              item.element.style.zIndex = `${++zIndexRef.current}`;
            });
          }}
          onEnd={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.remove('dragging');
            });
          }}
        >
          <button className="card draggable" type="button" aria-label={`Card ${index + 1}`}>
            {icon}
          </button>
        </Draggable>
      ))}
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <BasicDraggables />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Basic (React)</title>
    <meta
      name="description"
      content="React implementation of the basic draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## Draggable - Auto Scroll (React)

React translation of the auto scroll draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/002-draggable-auto-scroll/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/002-draggable-auto-scroll/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { autoScrollPlugin } from 'dragdoll';
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function AutoScrollCard() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLButtonElement | null>(null);

  const { draggable, ref } = useDraggable({
    element: elementRef.current,
    pointerSensor: true,
    keyboardMotionSensor: { computeSpeed: () => 100 },
    container: containerRef.current,
    frozenStyles: () => ['left', 'top'],
    onStart: (drag) => {
      drag.items[0].element.classList.add('dragging');
    },
    onEnd: (drag) => {
      drag.items[0].element.classList.remove('dragging');
    },
  });

  useEffect(() => {
    if (!draggable) return;

    draggable.use(
      autoScrollPlugin({
        targets: [
          {
            element: window,
            axis: 'y',
            padding: { top: Infinity, bottom: Infinity },
          },
        ],
      }),
    );
  }, [draggable]);

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <>
      <div ref={containerRef} className="drag-container" />
      <div className="card-container">
        <button ref={handleRef} className="card draggable" type="button" aria-label="Draggable" />
      </div>
    </>
  );
}

function App() {
  return (
    <DndContextProvider>
      <AutoScrollCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Auto Scroll (React)</title>
    <meta
      name="description"
      content="React translation of the auto scroll draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
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
  transform: translate(-50%, -50%);
}
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
::root {
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

## Draggable - Transformed (React)

React translation of the transformed draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/003-draggable-transformed/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/003-draggable-transformed/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { autoScrollPlugin } from 'dragdoll';
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function TransformedCard() {
  const dragContainerRef = useRef<HTMLDivElement | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);

  const { draggable, ref } = useDraggable({
    element: elementRef.current,
    pointerSensor: true,
    keyboardMotionSensor: { computeSpeed: () => 100 },
    container: dragContainerRef.current,
    frozenStyles: () => ['left', 'top'],
    onStart: (drag) => {
      drag.items[0].element.classList.add('dragging');
    },
    onEnd: (drag) => {
      drag.items[0].element.classList.remove('dragging');
    },
  });

  useEffect(() => {
    if (!draggable) return;

    draggable.use(
      autoScrollPlugin({
        targets: [
          {
            element: window,
            axis: 'y',
            padding: { top: Infinity, bottom: Infinity },
          },
        ],
      }),
    );
  }, [draggable]);

  const handleRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <>
      <div className="drag-container-outer">
        <div ref={dragContainerRef} className="drag-container" />
      </div>
      <div className="card-container-outer">
        <div className="card-container">
          <div ref={handleRef} className="card draggable" />
        </div>
      </div>
    </>
  );
}

function App() {
  return (
    <DndContextProvider>
      <TransformedCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Transformed (React)</title>
    <meta
      name="description"
      content="React translation of the transformed draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
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
  transform: translate(-50%, -50%) scale(1.2);
  transform-origin: 50% 50%;
}
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
::root {
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

## Draggable - Locked Axis (React)

React conversion of the locked axis draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/004-draggable-locked-axis/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/004-draggable-locked-axis/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function LockedAxisCards() {
  const zIndexRef = useRef(0);
  const modifiers = useMemo(
    () => [
      (change: { x: number; y: number }, { item }: any) => {
        const allowX = item.element.classList.contains('axis-x');
        const allowY = item.element.classList.contains('axis-y');
        if (allowX && !allowY) change.y = 0;
        if (allowY && !allowX) change.x = 0;
        return change;
      },
    ],
    [],
  );

  return (
    <div className="cards">
      {['axis-x', 'axis-y'].map((axis) => (
        <Draggable
          key={axis}
          pointerSensor
          keyboardSensor
          positionModifiers={modifiers}
          onStart={(drag) => {
            drag.items.forEach((item) => {
              item.element.classList.add('dragging');
              item.element.style.zIndex = `${++zIndexRef.current}`;
            });
          }}
          onEnd={(drag) => {
            drag.items.forEach((item) => item.element.classList.remove('dragging'));
          }}
        >
          <button className={`card draggable ${axis}`} type="button" aria-label={axis} />
        </Draggable>
      ))}
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <LockedAxisCards />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Locked Axis (React)</title>
    <meta
      name="description"
      content="React conversion of the locked axis draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## Draggable - Snap to Grid (React)

React translation of the snap to grid draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/005-draggable-snap-to-grid/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/005-draggable-snap-to-grid/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { createSnapModifier } from 'dragdoll';
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const GRID = 40;

function SnapCard() {
  return (
    <Draggable
      pointerSensor
      keyboardSensor={{ moveDistance: { x: GRID, y: GRID } }}
      positionModifiers={[createSnapModifier(GRID, GRID)]}
      onStart={(drag) => drag.items[0].element.classList.add('dragging')}
      onEnd={(drag) => drag.items[0].element.classList.remove('dragging')}
    >
      <button className="card draggable" type="button" aria-label="Snap draggable" />
    </Draggable>
  );
}

function App() {
  return (
    <DndContextProvider>
      <SnapCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Snap to Grid (React)</title>
    <meta
      name="description"
      content="React translation of the snap to grid draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
.card.draggable {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
}
.card.draggable {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
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
::root {
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

## Draggable - Containment (React)

React version of the containment draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/006-draggable-containment/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/006-draggable-containment/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { createContainmentModifier } from 'dragdoll';
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function ContainedCard() {
  return (
    <Draggable
      pointerSensor
      keyboardSensor
      positionModifiers={[
        createContainmentModifier(() => ({
          x: 0,
          y: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        })),
      ]}
      onStart={(drag) => drag.items[0].element.classList.add('dragging')}
      onEnd={(drag) => drag.items[0].element.classList.remove('dragging')}
    >
      <button className="card draggable" type="button" aria-label="Contained draggable" />
    </Draggable>
  );
}

function App() {
  return (
    <DndContextProvider>
      <ContainedCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Containment (React)</title>
    <meta
      name="description"
      content="React version of the containment draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## Draggable - Center To Pointer (React)

React edition of the center-to-pointer draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/007-draggable-center-to-pointer/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/007-draggable-center-to-pointer/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { PointerSensor } from 'dragdoll';
import { DndContextProvider, Draggable } from 'dragdoll-react';
import { StrictMode, useMemo } from 'react';
import { createRoot } from 'react-dom/client';

function CenterCard() {
  const modifiers = useMemo(
    () => [
      (change: { x: number; y: number }, { drag, item, phase }: any) => {
        if (
          phase === 'start' &&
          drag.sensor instanceof PointerSensor &&
          drag.items[0].element === item.element
        ) {
          const { clientRect } = item;
          const { x, y } = drag.startEvent;
          change.x = x - (clientRect.x + clientRect.width / 2);
          change.y = y - (clientRect.y + clientRect.height / 2);
        }
        return change;
      },
    ],
    [],
  );

  return (
    <Draggable
      pointerSensor
      keyboardSensor
      positionModifiers={modifiers}
      onStart={(drag) => drag.items[0].element.classList.add('dragging')}
      onEnd={(drag) => drag.items[0].element.classList.remove('dragging')}
    >
      <button className="card draggable" type="button" aria-label="Centered draggable" />
    </Draggable>
  );
}

function App() {
  return (
    <DndContextProvider>
      <CenterCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Center To Pointer (React)</title>
    <meta
      name="description"
      content="React edition of the center-to-pointer draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## Draggable - Drag Handle (React)

React version of the drag handle example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/008-draggable-drag-handle/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/008-draggable-drag-handle/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import type { Sensor } from 'dragdoll';
import { KeyboardSensor, PointerSensor } from 'dragdoll';
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

function DragHandleCard() {
  const [buttonNode, setButtonNode] = useState<HTMLButtonElement | null>(null);
  const [handleNode, setHandleNode] = useState<HTMLDivElement | null>(null);
  const [sensors, setSensors] = useState<Sensor[] | undefined>(undefined);

  useEffect(() => {
    if (!buttonNode || !handleNode) return;
    if (sensors) return;
    setSensors([new PointerSensor(handleNode), new KeyboardSensor(buttonNode)]);
  }, [buttonNode, handleNode, sensors]);

  const { ref } = useDraggable({
    element: sensors ? buttonNode : null,
    pointerSensor: false,
    keyboardSensor: false,
    sensors,
    onStart: (drag) => {
      const element = drag.items[0].element;
      element.classList.add('dragging');
      if (drag.sensor instanceof PointerSensor) {
        element.classList.add('pointer-dragging');
      } else {
        element.classList.add('keyboard-dragging');
      }
    },
    onEnd: (drag) => {
      const element = drag.items[0].element;
      element.classList.remove('dragging', 'pointer-dragging', 'keyboard-dragging');
    },
  });

  useEffect(() => {
    if (!buttonNode || !sensors) return;
    ref(buttonNode);
    return () => {
      ref(null);
    };
  }, [buttonNode, sensors, ref]);

  const handleButtonRef = useCallback((node: HTMLButtonElement | null) => {
    setButtonNode(node);
  }, []);

  const handleHandleRef = useCallback((node: HTMLDivElement | null) => {
    setHandleNode(node);
    if (!node) {
      setSensors(undefined);
    }
  }, []);

  return (
    <button
      ref={handleButtonRef}
      className="card draggable"
      type="button"
      aria-label="Handle draggable"
    >
      <div ref={handleHandleRef} className="handle" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
          <path
            fill="currentColor"
            d="M32 96C32 60.7 60.7 32 96 32h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V96zm256 0c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V96zM32 320c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V320zm256 0c0-35.3 28.7-64 64-64h64c35.3 0 64 28.7 64 64v64c0 35.3-28.7 64-64 64h-64c-35.3 0-64-28.7-64-64V320z"
          />
        </svg>
      </div>
    </button>
  );
}

function App() {
  return (
    <DndContextProvider>
      <DragHandleCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Drag Handle (React)</title>
    <meta
      name="description"
      content="React version of the drag handle example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## Draggable - Ghost Element (React)

React version of the ghost element draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/009-draggable-ghost-element/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/009-draggable-ghost-element/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useRef } from 'react';
import { createRoot } from 'react-dom/client';

function GhostCard() {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { ref } = useDraggable({
    element: buttonRef.current,
    pointerSensor: true,
    keyboardSensor: true,
    elements: () => {
      if (!buttonRef.current) return null;
      const rect = buttonRef.current.getBoundingClientRect();
      const clone = buttonRef.current.cloneNode(true) as HTMLElement;
      clone.style.position = 'fixed';
      clone.style.width = `${rect.width}px`;
      clone.style.height = `${rect.height}px`;
      clone.style.left = `${rect.left}px`;
      clone.style.top = `${rect.top}px`;
      clone.style.transform = '';
      clone.classList.add('ghost', 'dragging');
      document.body.appendChild(clone);
      return [clone];
    },
    onStart: () => {
      buttonRef.current?.classList.add('dragging');
    },
    onEnd: (drag) => {
      const original = buttonRef.current;
      if (!original) return;

      const ghostItem = drag.items[0];
      const existing = original.style.transform || '';
      const matrix = new DOMMatrix().setMatrixValue(
        `translate(${ghostItem.position.x}px, ${ghostItem.position.y}px) ${existing}`,
      );
      original.style.transform = `${matrix}`;

      ghostItem.element.remove();
      original.classList.remove('dragging');
    },
  });

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <button ref={handleRef} className="card draggable" type="button" aria-label="Ghost draggable" />
  );
}

function App() {
  return (
    <DndContextProvider>
      <GhostCard />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Ghost Element (React)</title>
    <meta
      name="description"
      content="React version of the ghost element draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## Draggable - Multiple Elements (React)

React version of the multiple elements draggable example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/010-draggable-multiple-elements/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/010-draggable-multiple-elements/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { DndContextProvider, useDraggable } from 'dragdoll-react';
import { StrictMode, useCallback, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

const CARD_IDS = ['card-1', 'card-2', 'card-3', 'card-4'];

interface MultiCardProps {
  id: string;
  register: (id: string, node: HTMLButtonElement | null) => void;
  getElements: () => (HTMLElement | SVGSVGElement)[];
  zIndexRef: React.MutableRefObject<number>;
}

function MultiDraggableCard({ id, register, getElements, zIndexRef }: MultiCardProps) {
  const [element, setElement] = useState<HTMLButtonElement | null>(null);

  const { ref } = useDraggable({
    element,
    id,
    pointerSensor: true,
    keyboardSensor: true,
    elements: getElements,
    startPredicate: () => {
      return element ? !element.classList.contains('dragging') : true;
    },
    onStart: (drag) => {
      drag.items.forEach((dragItem) => {
        dragItem.element.classList.add('dragging');
        dragItem.element.style.zIndex = `${++zIndexRef.current}`;
      });
    },
    onEnd: (drag) => {
      drag.items.forEach((dragItem) => {
        dragItem.element.classList.remove('dragging');
      });
    },
  });

  const handleRef = useCallback(
    (node: HTMLButtonElement | null) => {
      setElement(node);
      register(id, node);
      ref(node);
    },
    [id, ref, register],
  );

  return (
    <button ref={handleRef} id={id} className="card draggable" type="button" aria-label={id} />
  );
}

function MultipleCards() {
  const elementsMap = useRef(new Map<string, HTMLButtonElement>());
  const zIndexRef = useRef(0);

  const register = useCallback((id: string, node: HTMLButtonElement | null) => {
    if (!node) {
      elementsMap.current.delete(id);
    } else {
      elementsMap.current.set(id, node);
    }
  }, []);

  const getElements = useCallback(
    () =>
      Array.from(elementsMap.current.values()).filter(Boolean) as (HTMLElement | SVGSVGElement)[],
    [],
  );

  return (
    <div className="cards">
      {CARD_IDS.map((id) => (
        <MultiDraggableCard
          key={id}
          id={id}
          register={register}
          getElements={getElements}
          zIndexRef={zIndexRef}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <DndContextProvider>
      <MultipleCards />
    </DndContextProvider>
  );
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Multiple Elements (React)</title>
    <meta
      name="description"
      content="React version of the multiple elements draggable example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## DndContext - Basic (React)

React implementation of the basic DndContext example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/011-dnd-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/011-dnd-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import { DndContextProvider, Draggable, Droppable } from 'dragdoll-react';
import { StrictMode, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const DRAG_IDS = ['card-1', 'card-2', 'card-3'];
const DROP_IDS = ['drop-1', 'drop-2', 'drop-3'];

function DraggableBoard() {
  const zIndexRef = useRef(0);

  const handleStart = () => {
    document.querySelectorAll('.droppable').forEach((zone) => {
      zone.classList.remove('draggable-over', 'draggable-dropped');
    });
  };

  return (
    <DndContextProvider
      onStart={({ draggable }) => {
        handleStart();
        const element = draggable.drag?.items[0].element;
        if (element) {
          element.classList.add('dragging');
          element.style.zIndex = `${++zIndexRef.current}`;
        }
      }}
      onCollide={({ contacts }) => {
        document.querySelectorAll('.droppable').forEach((zone) => {
          zone.classList.remove('draggable-over');
        });
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-over');
        }
      }}
      onEnd={({ draggable, contacts }) => {
        const element = draggable.drag?.items[0].element;
        if (element) {
          element.classList.remove('dragging');
        }
        document.querySelectorAll('.droppable').forEach((zone) => {
          zone.classList.remove('draggable-over');
        });
        const firstContact = Array.from(contacts)[0];
        if (firstContact) {
          firstContact.element.classList.add('draggable-dropped');
        }
      }}
    >
      <section className="draggables">
        {DRAG_IDS.map((id) => (
          <Draggable key={id} id={id} pointerSensor keyboardSensor>
            <button className="card draggable" type="button" aria-label={id.toUpperCase()}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z" />
              </svg>
            </button>
          </Draggable>
        ))}
      </section>
      <section className="droppables">
        {DROP_IDS.map((id) => (
          <Droppable key={id} id={id}>
            {({ ref }) => <div ref={ref} className="droppable" aria-label={id.toUpperCase()} />}
          </Droppable>
        ))}
      </section>
    </DndContextProvider>
  );
}

function App() {
  return <DraggableBoard />;
}

const container = document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DndContext - Basic (React)</title>
    <meta
      name="description"
      content="React implementation of the basic DndContext example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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
body {
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
body {
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
::root {
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

## DndContext - Advanced Collision Detector (React)

React implementation of the advanced collision detector example using dragdoll-react.

<div class="example"><iframe src="/dragdoll-react/examples/012-dnd-advanced-collision-detector/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll-react/examples/012-dnd-advanced-collision-detector/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```tsx [index.tsx]
import type { Droppable as DroppableInstance } from 'dragdoll';
import { AdvancedCollisionDetector, type AnyDraggable, autoScrollPlugin } from 'dragdoll';
import { DndContextProvider, Droppable, useDndContextEvents, useDraggable } from 'dragdoll-react';
import { getOffset } from 'mezr';
import React, { StrictMode, useCallback, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';

const ICON_PATH =
  'M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z';

const COLUMNS = [
  { id: 'left', cardId: '1' },
  { id: 'right', cardId: '2' },
];

const DROPPABLES_PER_COLUMN = 16;

type DroppableData = Record<string, never>;

type ScrollRegistrar = (index: number, element: HTMLElement | null) => void;

type CardProps = {
  id: string;
  getScrollContainers: () => HTMLElement[];
};

function Card({ id, getScrollContainers }: CardProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const { ref, draggable } = useDraggable({
    id,
    element: elementRef.current,
    container: typeof document !== 'undefined' ? document.body : null,
    pointerSensor: true,
    keyboardMotionSensor: true,
    frozenStyles: () => ['width', 'height'],
    startPredicate: () => !elementRef.current?.classList.contains('animate'),
    elements: () => (elementRef.current ? [elementRef.current] : null),
    onStart: () => {
      elementRef.current?.classList.add('dragging');
    },
    onEnd: () => {
      elementRef.current?.classList.remove('dragging');
    },
  });

  useEffect(() => {
    if (!draggable) return;
    const containers = getScrollContainers();
    if (!containers.length) return;
    if (!('autoscroll' in draggable.plugins)) {
      draggable.use(
        autoScrollPlugin({
          targets: containers.map((element) => ({
            element,
            axis: 'y',
            padding: { top: 0, bottom: 0 },
          })),
        }),
      );
    }
  }, [draggable, getScrollContainers]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      elementRef.current = node;
      ref(node);
    },
    [ref],
  );

  return (
    <div ref={setRef} className="card draggable" tabIndex={0} data-id={id}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <path d={ICON_PATH} />
      </svg>
    </div>
  );
}

function DroppableCell({
  id,
  initialCardId,
  children,
}: {
  id: string;
  initialCardId?: string;
  children?: React.ReactNode;
}) {
  const data = useMemo<DroppableData>(() => ({}), []);

  return (
    <Droppable id={id} data={data}>
      {({ ref }) => (
        <div
          ref={(node) => {
            ref(node);
            if (node && initialCardId) {
              node.setAttribute('data-draggable-contained', initialCardId);
            }
          }}
          className="droppable"
        >
          {children}
        </div>
      )}
    </Droppable>
  );
}

function ScrollColumn({
  columnIndex,
  cardId,
  registerScroll,
  getScrollContainers,
}: {
  columnIndex: number;
  cardId: string;
  registerScroll: ScrollRegistrar;
  getScrollContainers: () => HTMLElement[];
}) {
  const droppableIds = useMemo(
    () => Array.from({ length: DROPPABLES_PER_COLUMN }, (_, i) => `${columnIndex}-${i}`),
    [columnIndex],
  );

  return (
    <div
      className="scroll-list"
      ref={(node) => {
        registerScroll(columnIndex, node);
      }}
    >
      {droppableIds.map((droppableId, idx) => (
        <DroppableCell
          key={droppableId}
          id={droppableId}
          initialCardId={idx === 0 ? cardId : undefined}
        >
          {idx === 0 && <Card id={cardId} getScrollContainers={getScrollContainers} />}
        </DroppableCell>
      ))}
    </div>
  );
}

function AdvancedDnDExample() {
  const scrollContainersRef = useRef<(HTMLElement | null)[]>(Array(COLUMNS.length).fill(null));
  const bestMatchMap = useRef(new Map<AnyDraggable, DroppableInstance>());

  const registerScroll = useCallback<ScrollRegistrar>((index, element) => {
    scrollContainersRef.current[index] = element;
  }, []);

  const getScrollContainers = useCallback(
    () => scrollContainersRef.current.filter(Boolean) as HTMLElement[],
    [],
  );

  useDndContextEvents({
    collide: ({ draggable, contacts }) => {
      const draggableElement = draggable.drag?.items[0].element as HTMLElement | undefined;
      if (!draggableElement) return;
      const draggableId = draggableElement.getAttribute('data-id');
      if (!draggableId) return;

      let nextBest: DroppableInstance | null = null;
      for (const droppable of contacts) {
        const contained = droppable.element.getAttribute('data-draggable-contained');
        if (contained && contained !== draggableId) continue;
        const over = droppable.element.getAttribute('data-draggable-over');
        if (over && over !== draggableId) continue;
        nextBest = droppable;
        break;
      }

      const currentBest = bestMatchMap.current.get(draggable);
      if (nextBest && nextBest !== currentBest) {
        currentBest?.element.removeAttribute('data-draggable-over');
        nextBest.element.setAttribute('data-draggable-over', draggableId);
        bestMatchMap.current.set(draggable, nextBest);
      }
    },
    end: ({ draggable, canceled }) => {
      const draggableElement = draggable.drag?.items[0].element as HTMLElement | undefined;
      if (!draggableElement) return;
      const bestMatch = bestMatchMap.current.get(draggable) || null;
      const originalContainer = draggableElement.parentElement as HTMLElement | null;
      const targetContainer =
        !canceled && bestMatch ? (bestMatch.element as HTMLElement) : originalContainer;

      if (originalContainer && targetContainer && originalContainer !== targetContainer) {
        const offset = getOffset(originalContainer, targetContainer);
        const transformString = `translate(${offset.left}px, ${offset.top}px) ${draggableElement.style.transform}`;
        draggableElement.style.transform = transformString;
        targetContainer.appendChild(draggableElement);
        originalContainer.removeAttribute('data-draggable-contained');
        targetContainer.setAttribute(
          'data-draggable-contained',
          draggableElement.getAttribute('data-id') || '',
        );
      }

      const matrix = new DOMMatrix().setMatrixValue(
        draggableElement.style.transform || 'matrix(1, 0, 0, 1, 0, 0)',
      );
      if (!matrix.isIdentity) {
        draggableElement.classList.add('animate');
        const onTransitionEnd = (event: TransitionEvent) => {
          if (event.target === draggableElement && event.propertyName === 'transform') {
            draggableElement.classList.remove('animate');
            document.body.removeEventListener('transitionend', onTransitionEnd);
          }
        };
        document.body.addEventListener('transitionend', onTransitionEnd);
        draggableElement.clientHeight;
        draggableElement.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
      }

      bestMatch?.element.removeAttribute('data-draggable-over');
      bestMatchMap.current.delete(draggable);
    },
  });

  return (
    <DndContextProvider
      options={{
        collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx as any) as any,
      }}
    >
      <div className="container">
        {COLUMNS.map((column, index) => (
          <ScrollColumn
            key={column.id}
            columnIndex={index}
            cardId={column.cardId}
            registerScroll={registerScroll}
            getScrollContainers={getScrollContainers}
          />
        ))}
      </div>
    </DndContextProvider>
  );
}

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AdvancedDnDExample />
    </StrictMode>,
  );
}
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DndContext - Advanced Collision Detector (React)</title>
    <meta
      name="description"
      content="React implementation of the advanced collision detector example using dragdoll-react."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="../assets/base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div id="root"></div>
    <script src="index.umd.js"></script>
  </body>
</html>
```

```css [index.css]
body {
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

@media (width < 600px) {
  .scroll-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-content: safe center;
  }
}
body {
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

@media (width < 600px) {
  .scroll-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-content: safe center;
  }
}
body {
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

@media (width < 600px) {
  .scroll-list {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    justify-content: safe center;
  }
}
```

```css [base.css]
::root {
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
