# Examples

## Draggable - Basic

<iframe src="/dragdoll/examples/001-draggable-basic/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

::: code-group

```ts [index.ts]
import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
} from 'dragdoll';

let zIndex = 0;

const draggableElements = document.querySelectorAll('.draggable');

[...draggableElements].forEach((draggableElement) => {
  const pointerSensor = new PointerSensor(draggableElement);
  const keyboardSensor = new KeyboardMotionSensor(draggableElement);
  const draggable = new Draggable([pointerSensor, keyboardSensor], {
    getElements: () => [draggableElement as HTMLElement],
    startPredicate: createPointerSensorStartPredicate(),
    getFrozenProps: () => ['transform'],
  });

  draggable.on('start', () => {
    draggableElement.classList.add('dragging');
    (draggableElement as HTMLElement).style.zIndex = `${++zIndex}`;
  });

  draggable.on('end', () => {
    draggableElement.classList.remove('dragging');
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
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="card draggable" tabindex="0"></div>
    <div class="card draggable" tabindex="0"></div>
    <div class="card draggable" tabindex="0"></div>
    <div class="card draggable" tabindex="0"></div>
    <script type="module" src="index.ts"></script>
  </body>
</html>
```

```css [index.css]
.draggable {
  position: absolute;
  left: 50%;
  top: 50%;
}
.draggable:nth-child(1) {
  transform: translateX(-50%) translateY(-50%) translateY(-55%) translateX(-55%);
}
.draggable:nth-child(2) {
  transform: translateX(-50%) translateY(-50%) translateY(-55%) translateX(55%);
}
.draggable:nth-child(3) {
  transform: translateX(-50%) translateY(-50%) translateY(55%) translateX(-55%);
}
.draggable:nth-child(4) {
  transform: translateX(-50%) translateY(-50%) translateY(55%) translateX(55%);
}
```

```css [base.css]
:root {
  --bg-color: #161618;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: #fff;
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
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
}

.card {
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 8px;
  border: 1.5px solid var(--bg-color);
}
@media (hover: hover) and (pointer: fine) {
  .card:hover,
  .card:focus-visible {
    background-color: var(--card-bgColor--focus);
    color: var(--card-bgColor--focus);
  }
  .card:focus-visible {
    outline-offset: 4px;
    outline: 1px solid var(--card-bgColor--focus);
  }
}
.card.draggable {
  cursor: grab;
}
.card.dragging {
  cursor: grabbing;
  background-color: var(--card-bgColor--drag);
  color: var(--card-bgColor--drag);
}
@media (hover: hover) and (pointer: fine) {
  .card.dragging:focus-visible {
    outline: 1px solid var(--card-bgColor--drag);
  }
}
```

:::

## Draggable - Autoscroll

<iframe src="/dragdoll/examples/002-draggable-autoscroll/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

::: code-group

```ts [index.ts]
import {
  Draggable,
  PointerSensor,
  KeyboardMotionSensor,
  createPointerSensorStartPredicate,
  autoScrollPlugin,
} from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const container = document.querySelector('.drag-container') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardMotionSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  container,
  getElements: () => [element],
  getFrozenProps: () => ['left', 'top'],
  startPredicate: createPointerSensorStartPredicate(),
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

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Autoscroll</title>
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="drag-container"></div>
    <div class="card draggable" tabindex="0"></div>
    <script type="module" src="index.ts"></script>
  </body>
</html>
```

```css [index.css]
body {
  height: 300%;
}
.drag-container {
  position: fixed;
  left: 10px;
  top: 10px;
}
.draggable {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
}
```

```css [base.css]
:root {
  --bg-color: #161618;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: #fff;
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
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
}

.card {
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 8px;
  border: 1.5px solid var(--bg-color);
}
@media (hover: hover) and (pointer: fine) {
  .card:hover,
  .card:focus-visible {
    background-color: var(--card-bgColor--focus);
    color: var(--card-bgColor--focus);
  }
  .card:focus-visible {
    outline-offset: 4px;
    outline: 1px solid var(--card-bgColor--focus);
  }
}
.card.draggable {
  cursor: grab;
}
.card.dragging {
  cursor: grabbing;
  background-color: var(--card-bgColor--drag);
  color: var(--card-bgColor--drag);
}
@media (hover: hover) and (pointer: fine) {
  .card.dragging:focus-visible {
    outline: 1px solid var(--card-bgColor--drag);
  }
}
```

:::

## Draggable - Snap To Grid

<iframe src="/dragdoll/examples/003-draggable-snap-to-grid/index.html" style="width:100%;height: 300px; border: 1px solid #ff5555; border-radius: 8px;"></iframe>

::: code-group

```ts [index.ts]
import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
  createSnapModifier,
} from 'dragdoll';

const GRID_WIDTH = 40;
const GRID_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element, {
  moveDistance: { x: GRID_WIDTH, y: GRID_HEIGHT },
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
  getPositionChange: createSnapModifier(GRID_WIDTH, GRID_HEIGHT),
});

draggable.on('start', () => {
  element.classList.add('dragging');
});

draggable.on('end', () => {
  element.classList.remove('dragging');
});
```

```html [index.html]
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Draggable - Snap To Grid</title>
    <meta
      name="viewport"
      content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1"
    />
    <link rel="stylesheet" href="base.css" />
    <link rel="stylesheet" href="index.css" />
  </head>
  <body>
    <div class="card draggable" tabindex="0"></div>
    <script type="module" src="index.ts"></script>
  </body>
</html>
```

```css [index.css]
.draggable {
  position: absolute;
  left: 0;
  top: 0;
  width: 80px;
  height: 80px;
}
```

```css [base.css]
:root {
  --bg-color: #161618;
  --color: rgba(255, 255, 245, 0.86);
  --theme-color: #ff5555;
  --card-color: #fff;
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
  background-image: linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
}

body {
  margin: 0;
}

.card {
  width: 100px;
  height: 100px;
  background-color: var(--card-bgColor);
  color: var(--card-color);
  border-radius: 8px;
  border: 1.5px solid var(--bg-color);
}
@media (hover: hover) and (pointer: fine) {
  .card:hover,
  .card:focus-visible {
    background-color: var(--card-bgColor--focus);
    color: var(--card-bgColor--focus);
  }
  .card:focus-visible {
    outline-offset: 4px;
    outline: 1px solid var(--card-bgColor--focus);
  }
}
.card.draggable {
  cursor: grab;
}
.card.dragging {
  cursor: grabbing;
  background-color: var(--card-bgColor--drag);
  color: var(--card-bgColor--drag);
}
@media (hover: hover) and (pointer: fine) {
  .card.dragging:focus-visible {
    outline: 1px solid var(--card-bgColor--drag);
  }
}
```

:::
