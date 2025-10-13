# Examples

## Draggable - Basic

A minimal setup with four draggable elements using pointer and keyboard (motion) sensor. You can drag them all at once too if you have a multi-touch device (e.g. phone or tablet).

<div class="example"><iframe src="/dragdoll/examples/001-draggable-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/001-draggable-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

let zIndex = 0;

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => [element],
    onStart: () => {
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
});
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
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
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

This example demonstrates quite a lot of things. We use a drag container and freeze `left` and `top` values before we move the dragged element into the drag container. The draggable element has percetage based left and top values, which would not be correct when the element is moved to the drag container, which has different dimensions. Lastly we use the auto scroll plugin and configure it to scroll the viewport on y-axis when the dragged element is close to it's edges. Note that we also set auto scroll target's `padding.top` and `padding.bottom` to `Infinity` to allow the scrolling to continue even if you drag the element past the edges.

<div class="example"><iframe src="/dragdoll/examples/002-draggable-auto-scroll/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/002-draggable-auto-scroll/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { autoScrollPlugin } from 'dragdoll/draggable/plugins/auto-scroll';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const dragContainer = document.querySelector('.drag-container') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element, {
  computeSpeed: () => 100,
});
new Draggable([pointerSensor, keyboardSensor], {
  container: dragContainer,
  elements: () => [element],
  frozenStyles: () => ['left', 'top'],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
}).use(
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
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Auto Scroll</title>
    <meta
      name="description"
      content="This example demonstrates quite a lot of things. We use a drag container and freeze `left` and `top` values before we move the dragged element into the drag container. The draggable element has percetage based left and top values, which would not be correct when the element is moved to the drag container, which has different dimensions. Lastly we use the auto scroll plugin and configure it to scroll the viewport on y-axis when the dragged element is close to it's edges. Note that we also set auto scroll target's `padding.top` and `padding.bottom` to `Infinity` to allow the scrolling to continue even if you drag the element past the edges."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="drag-container"></div>
    <div class="card-container">
      <div class="card draggable" tabindex="0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
          />
        </svg>
      </div>
    </div>
    <script type="module" src="index.ts"></script>
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

<div class="example"><iframe src="/dragdoll/examples/003-draggable-transformed/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/003-draggable-transformed/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { autoScrollPlugin } from 'dragdoll/draggable/plugins/auto-scroll';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const dragContainer = document.querySelector('.drag-container') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element, {
  computeSpeed: () => 100,
});
new Draggable([pointerSensor, keyboardSensor], {
  container: dragContainer,
  elements: () => [element],
  frozenStyles: () => ['left', 'top'],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
}).use(
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
    <div class="drag-container-outer">
      <div class="drag-container"></div>
    </div>
    <div class="card-container-outer">
      <div class="card-container">
        <div class="card draggable" tabindex="0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
            <path
              d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
            />
          </svg>
        </div>
      </div>
    </div>
    <script type="module" src="index.ts"></script>
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

<div class="example"><iframe src="/dragdoll/examples/004-draggable-locked-axis/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/004-draggable-locked-axis/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

let zIndex = 0;

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => [element],
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
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
});
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
    <div class="card draggable axis-x" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M406.6 374.6l96-96c12.5-12.5 12.5-32.8 0-45.3l-96-96c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224l-293.5 0 41.4-41.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 288l293.5 0-41.4 41.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0z"
        />
      </svg>
    </div>
    <div class="card draggable axis-y" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M182.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-96 96c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L128 109.3l0 293.5L86.6 361.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l96 96c12.5 12.5 32.8 12.5 45.3 0l96-96c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7l0-293.5 41.4 41.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-96-96z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
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

<div class="example"><iframe src="/dragdoll/examples/005-draggable-snap-to-grid/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/005-draggable-snap-to-grid/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { createSnapModifier } from 'dragdoll/draggable/modifiers/snap';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element, {
  moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
});
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],

  positionModifiers: [createSnapModifier(GRID_WIDTH, GRID_HEIGHT)],
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
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
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
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

A simple demo on how to use the built-in containment modifier. The first argument of `createContainmentModifier` should be a function that returns the client rect of the containment area. That function is called on every drag 'move' event and also on 'start' and 'end' events. The second argument is a boolean which's value is cached on start event to define if the modifier should track drifting of the sensor when the dragged element hits an edge of the containment area and the sensor keeps on moving away. If the drift is being tracked the draggable element will not be moved to the opposing direction until the sensor is back inside the containment area. By default the drift is tracked only for `PointerSensor`.

<div class="example"><iframe src="/dragdoll/examples/006-draggable-containment/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/006-draggable-containment/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { createContainmentModifier } from 'dragdoll/draggable/modifiers/containment';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
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
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Containment</title>
    <meta
      name="description"
      content="A simple demo on how to use the built-in containment modifier. The first argument of `createContainmentModifier` should be a function that returns the client rect of the containment area. That function is called on every drag 'move' event and also on 'start' and 'end' events. The second argument is a boolean which's value is cached on start event to define if the modifier should track drifting of the sensor when the dragged element hits an edge of the containment area and the sensor keeps on moving away. If the drift is being tracked the draggable element will not be moved to the opposing direction until the sensor is back inside the containment area. By default the drift is tracked only for `PointerSensor`."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
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

<div class="example"><iframe src="/dragdoll/examples/007-draggable-center-to-pointer/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/007-draggable-center-to-pointer/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
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
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: () => {
    element.classList.remove('dragging');
  },
});
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
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
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

A simple example on how to create a drag handle. There is no built-in 'handle' option, because it would be too limiting. In this example the `PointerSensor` is used for the handle element while the `KeyboardMotionSensor` is used normally for the draggable element. You could also create the `KeyboardMotionSensor` for the handle element if you wished, it's really up to your preferences. Hopefully this showcases how flexible and customizable DragDoll really is with it's sensor system.

<div class="example"><iframe src="/dragdoll/examples/008-draggable-drag-handle/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/008-draggable-drag-handle/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const handle = element.querySelector('.handle') as HTMLElement;
const pointerSensor = new PointerSensor(handle);
const keyboardSensor = new KeyboardMotionSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  onStart: () => {
    element.classList.add('dragging');
    if (draggable.drag!.sensor instanceof PointerSensor) {
      element.classList.add('pointer-dragging');
    } else {
      element.classList.add('keyboard-dragging');
    }
  },
  onEnd: () => {
    element.classList.remove('dragging', 'pointer-dragging', 'keyboard-dragging');
  },
});
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Drag Handle</title>
    <meta
      name="description"
      content="A simple example on how to create a drag handle. There is no built-in 'handle' option, because it would be too limiting. In this example the `PointerSensor` is used for the handle element while the `KeyboardMotionSensor` is used normally for the draggable element. You could also create the `KeyboardMotionSensor` for the handle element if you wished, it's really up to your preferences. Hopefully this showcases how flexible and customizable DragDoll really is with it's sensor system."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="card draggable" tabindex="0">
      <div class="handle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
          />
        </svg>
      </div>
    </div>
    <script type="module" src="index.ts"></script>
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

<div class="example"><iframe src="/dragdoll/examples/009-draggable-ghost-element/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/009-draggable-ghost-element/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
new Draggable([pointerSensor, keyboardSensor], {
  elements: () => {
    // Clone the element and align the clone with the original element.
    const elemRect = element.getBoundingClientRect();
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.width = `${elemRect.width}px`;
    clone.style.height = `${elemRect.height}px`;
    clone.style.left = `${elemRect.left}px`;
    clone.style.top = `${elemRect.top}px`;

    // Add the ghost and dragging class to the clone. The ghost element will be
    // in dragging state for the duration of it's existence.
    clone.classList.add('ghost', 'dragging');

    // We need to reset the transform to avoid the ghost element being offset
    // unintentionally. In this specific case, if we don't reset the transform,
    // the ghost element will be offset by the original element's transform.
    clone.style.transform = '';

    // Append the ghost element to the body.
    document.body.appendChild(clone);

    return [clone];
  },
  onStart: () => {
    element.classList.add('dragging');
  },
  onEnd: (drag) => {
    const dragItem = drag.items[0];

    // Move the original element to the ghost element's position. We use DOMMatrix
    // to first combine the original element's transform with the ghost element's
    // transform and then apply the combined transform to the original element.
    const matrix = new DOMMatrix().setMatrixValue(
      `translate(${dragItem.position.x}px, ${dragItem.position.y}px) ${element.style.transform}`,
    );
    element.style.transform = `${matrix}`;

    // Remove the ghost element.
    dragItem.element.remove();

    element.classList.remove('dragging');
  },
});
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
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
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

<div class="example"><iframe src="/dragdoll/examples/010-draggable-multiple-elements/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/010-draggable-multiple-elements/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { Draggable } from 'dragdoll/draggable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];

draggableElements.forEach((element) => {
  const otherElements = draggableElements.filter((el) => el !== element);
  const pointerSensor = new PointerSensor(element);
  const keyboardSensor = new KeyboardMotionSensor(element);
  new Draggable([pointerSensor, keyboardSensor], {
    elements: () => {
      return [element, ...otherElements];
    },
    startPredicate: () => {
      return !element.classList.contains('dragging');
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
  });
});
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
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <div class="card draggable" tabindex="0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
        <path
          d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
        />
      </svg>
    </div>
    <script type="module" src="index.ts"></script>
  </body>
</html>
```

```css [index.css]
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

## DndContext - Basic

A basic example of using DndContext with Draggable and Droppable elements. Here we highlight the dropzone element that overlaps most with the dragged element.

<div class="example"><iframe src="/dragdoll/examples/011-dnd-basic/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/011-dnd-basic/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { DndContext, DndContextEventType } from 'dragdoll/dnd-context';
import { Draggable } from 'dragdoll/draggable';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';

let zIndex = 0;

// Initialize context and get elements
const dndContext = new DndContext();
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Create droppables
droppableElements.forEach((element) => {
  const droppable = new Droppable(element);
  droppable.data.overIds = new Set<number>();
  droppable.data.droppedIds = new Set<number>();
  dndContext.addDroppables([droppable]);
});

// Create draggables
draggableElements.forEach((element) => {
  const draggable = new Draggable([new PointerSensor(element), new KeyboardMotionSensor(element)], {
    elements: () => [element],
    startPredicate: () => !element.classList.contains('dragging'),
    onStart: () => {
      element.classList.add('dragging');
      element.style.zIndex = `${++zIndex}`;
    },
    onEnd: () => {
      element.classList.remove('dragging');
    },
  });
  dndContext.addDraggables([draggable]);
});

// DnD logic

// On drag start loop through all target droppables and remove the draggable id
// from the dropped ids set. If the dropped ids set is empty, remove the
// "draggable-dropped" class from the droppable element.
dndContext.on(DndContextEventType.Start, (data) => {
  const { draggable, targets } = data;
  targets.forEach((droppable) => {
    droppable.data.droppedIds.delete(draggable.id);
    if (droppable.data.droppedIds.size === 0) {
      droppable.element.classList.remove('draggable-dropped');
    }
  });
});

// On each collision change, keep track of the overIds set for each droppable
// and update the "draggable-over" class based on the over ids set.
dndContext.on(DndContextEventType.Collide, (data) => {
  const { draggable, contacts, removedContacts } = data;

  // Remove the draggable id from the droppables that stopped colliding and
  // remove the "draggable-over" class from the droppable element if there are
  // no more draggable ids in the over ids set.
  removedContacts.forEach((target) => {
    target.data.overIds.delete(draggable.id);
    if (target.data.overIds.size === 0) {
      target.element.classList.remove('draggable-over');
    }
  });

  // Add the draggable to the first colliding droppable (best match), and remove
  // the draggable from the other colliding droppables. Update the
  // "draggable-over" class based on the over ids set.
  let i = 0;
  for (const droppable of contacts) {
    if (i === 0) {
      droppable.data.overIds.add(draggable.id);
      droppable.element.classList.add('draggable-over');
    } else {
      droppable.data.overIds.delete(draggable.id);
      if (droppable.data.overIds.size === 0) {
        droppable.element.classList.remove('draggable-over');
      }
    }
    ++i;
  }
});

dndContext.on(DndContextEventType.End, (data) => {
  const { draggable, contacts } = data;

  // For the first colliding droppable (best match), add the draggable id to the
  // dropped ids set, add the "draggable-dropped" class to the droppable
  // element, and remove the draggable id from the over ids set. If the over ids
  // set is empty, remove the "draggable-over" class from the droppable element.
  for (const droppable of contacts) {
    droppable.data.droppedIds.add(draggable.id);
    droppable.element.classList.add('draggable-dropped');
    droppable.data.overIds.delete(draggable.id);
    if (droppable.data.overIds.size === 0) {
      droppable.element.classList.remove('draggable-over');
    }
    return;
  }
});
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DndContext - Basic</title>
    <meta
      name="description"
      content="A basic example of using DndContext with Draggable and Droppable elements. Here we highlight the dropzone element that overlaps most with the dragged element."
    />
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="draggables">
      <div class="card draggable" tabindex="0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
          />
        </svg>
      </div>
      <div class="card draggable" tabindex="0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
          />
        </svg>
      </div>
      <div class="card draggable" tabindex="0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
          />
        </svg>
      </div>
      <div class="card draggable" tabindex="0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
          <path
            d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
          />
        </svg>
      </div>
    </div>
    <div class="droppables">
      <div class="droppable"></div>
      <div class="droppable"></div>
      <div class="droppable"></div>
      <div class="droppable"></div>
    </div>
    <script type="module" src="index.ts"></script>
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

## DndContext - Advanced Collision Detector

Advanced collision detection with scrollable droppable lists. Here we can see how the advanced collision detector respects the visibility of the droppables. Only the visible parts of the droppables (as seen from the perspective of the draggable) are considered for collisions.

<div class="example"><iframe src="/dragdoll/examples/012-dnd-advanced-collision-detector/index.html"></iframe><a class="example-link" target="_blank" href="/dragdoll/examples/012-dnd-advanced-collision-detector/index.html" title="Open in a new tab"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"></path></svg></a></div>

::: code-group

```ts [index.ts]
import { DndContext, DndContextEventType } from 'dragdoll/dnd-context';
import {
  AdvancedCollisionData,
  AdvancedCollisionDetector,
} from 'dragdoll/dnd-context/advanced-collision-detector';
import { Draggable } from 'dragdoll/draggable';
import { autoScrollPlugin } from 'dragdoll/draggable/plugins/auto-scroll';
import { Droppable } from 'dragdoll/droppable';
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { getOffset } from 'mezr';

// Keep track of the best match droppable.
const bestMatchMap: Map<Draggable<any>, Droppable> = new Map();

// Get elements.
const scrollContainers = [...document.querySelectorAll('.scroll-list')] as HTMLElement[];
const draggableElements = [...document.querySelectorAll('.draggable')] as HTMLElement[];
const droppableElements = [...document.querySelectorAll('.droppable')] as HTMLElement[];

// Initialize DndContext.
const dndContext = new DndContext<AdvancedCollisionData>({
  collisionDetector: (ctx) => new AdvancedCollisionDetector(ctx),
});

// Create droppables.
const droppables: Droppable[] = [];
for (const droppableElement of droppableElements) {
  const droppable = new Droppable(droppableElement);
  droppables.push(droppable);
}

// Create draggables.
const draggables: Draggable<any>[] = [];
for (const draggableElement of draggableElements) {
  const draggable = new Draggable(
    [new PointerSensor(draggableElement), new KeyboardMotionSensor(draggableElement)],
    {
      // Only move the draggable element.
      elements: () => [draggableElement],
      // Use the body as the drag container.
      container: document.body,
      // Freeze the width and height of the dragged element since we are using
      // a custom container and the element has percentage based values for
      // some of it's properties.
      frozenStyles: () => ['width', 'height'],
      // Allow the drag to start only if the element is not animating.
      startPredicate: () => !draggableElement.classList.contains('animate'),
      // Toggle the dragging class on the draggable element when the drag starts
      // and ends.
      onStart: () => {
        draggableElement.classList.add('dragging');
      },
      onEnd: () => {
        draggableElement.classList.remove('dragging');
      },
    },
  ).use(
    // Allow the draggable to scroll the scroll containers when the dragged
    // element is close to it's edges.
    autoScrollPlugin({
      targets: scrollContainers.map((scrollContainer) => ({
        element: scrollContainer,
        axis: 'y',
        padding: { top: 0, bottom: 0 },
      })),
    }),
  );
  draggables.push(draggable);
}

// Add droppables and draggables to the context.
dndContext.addDroppables(droppables);
dndContext.addDraggables(draggables);

// On draggable collision with droppables.
dndContext.on(DndContextEventType.Collide, ({ draggable, contacts }) => {
  // Get the draggable element.
  const draggableElement = draggable.drag?.items[0].element as HTMLElement | null;
  if (!draggableElement) return;

  // Get the draggable id.
  const draggableId = draggableElement.getAttribute('data-id') || '';
  if (draggableId === '') return;

  // Get the next best match droppable.
  let nextBestMatch: Droppable | null = null;
  for (const droppable of contacts) {
    // Skip if the droppable contains a different draggable.
    const containedDraggableId = droppable.element.getAttribute('data-draggable-contained') || '';
    if (containedDraggableId && containedDraggableId !== draggableId) {
      continue;
    }

    // Skip if a different draggable is over the droppable.
    const overDraggableId = droppable.element.getAttribute('data-draggable-over') || '';
    if (overDraggableId && overDraggableId !== draggableId) {
      continue;
    }

    // We found the next best match.
    nextBestMatch = droppable;
    break;
  }

  // Update the best match droppable if it's changed.
  const bestMatch = bestMatchMap.get(draggable);
  if (nextBestMatch !== null && nextBestMatch !== bestMatch) {
    bestMatch?.element.removeAttribute('data-draggable-over');
    nextBestMatch.element.setAttribute('data-draggable-over', draggableId);
    bestMatchMap.set(draggable, nextBestMatch);
  }
});

// On drag end.
dndContext.on(DndContextEventType.End, ({ draggable, canceled }) => {
  const draggableElement = draggable.drag?.items[0].element as HTMLElement | null;
  if (!draggableElement) return;

  // Find out the original container and the target container based on the best
  // match droppable.
  const bestMatch = bestMatchMap.get(draggable);
  const originalContainer = draggableElement.parentElement!;
  const targetContainer =
    !canceled && bestMatch ? (bestMatch.element as HTMLElement) : originalContainer;

  // If draggable moved into a different container.
  if (originalContainer !== targetContainer) {
    // Move the draggable to the target container. While doing that, let's add
    // the offset between the original container and the target container to the
    // draggable's transform so it's visual position does not change.
    const offsetData = getOffset(originalContainer, targetContainer);
    const transformString = `translate(${offsetData.left}px, ${offsetData.top}px) ${draggableElement.style.transform}`;
    draggableElement.style.transform = transformString;
    targetContainer.appendChild(draggableElement);

    // Move the data-draggable-contained attribute to the target container.
    originalContainer.removeAttribute('data-draggable-contained');
    targetContainer.setAttribute(
      'data-draggable-contained',
      draggableElement.getAttribute('data-id')!,
    );
  }

  // Animate the draggable's transform back to "zero" (no transform).
  const transformMatrix = new DOMMatrix().setMatrixValue(draggableElement.style.transform);
  if (!transformMatrix.isIdentity) {
    draggableElement.classList.add('animate');
    const onTransitionEnd = (e: TransitionEvent) => {
      if (e.target === draggableElement && e.propertyName === 'transform') {
        draggableElement.classList.remove('animate');
        document.body.removeEventListener('transitionend', onTransitionEnd);
      }
    };
    document.body.addEventListener('transitionend', onTransitionEnd);
    draggableElement.clientHeight; // Force a reflow.
    draggableElement.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
  }

  // Reset the best match droppable.
  bestMatch?.element.removeAttribute('data-draggable-over');
  bestMatchMap.delete(draggable);
});
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>DndContext - Advanced Collision Detector</title>
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
    <div class="container">
      <div class="scroll-list">
        <div class="droppable" data-draggable-contained="1">
          <div class="card draggable" tabindex="0" data-id="1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
              />
            </svg>
          </div>
        </div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
      </div>
      <div class="scroll-list">
        <div class="droppable" data-draggable-contained="2">
          <div class="card draggable" tabindex="0" data-id="2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
              <path
                d="M278.6 9.4c-12.5-12.5-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l9.4-9.4L224 224l-114.7 0 9.4-9.4c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-64 64c-12.5 12.5-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-9.4-9.4L224 288l0 114.7-9.4-9.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l64 64c12.5 12.5 32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-9.4 9.4L288 288l114.7 0-9.4 9.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l64-64c12.5-12.5 12.5-32.8 0-45.3l-64-64c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l9.4 9.4L288 224l0-114.7 9.4 9.4c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-64-64z"
              />
            </svg>
          </div>
        </div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
        <div class="droppable"></div>
      </div>
    </div>

    <script type="module" src="index.ts"></script>
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
