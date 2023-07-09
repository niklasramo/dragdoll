# Getting Started

## Install

DragDoll has two dependencies, [Eventti](https://github.com/niklasramo/eventti) and [Tikki](https://github.com/niklasramo/tikki), both of which are lightweight and performant libraries. Eventti is used for emitting all the events and Tikki is used for managing the animation loop when necessary.

### Node

```bash
$ npm install dragdoll eventti tikki
```

### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/eventti@3.0.0/dist/eventti.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tikki@2.0.0/dist/tikki.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dragdoll@0.1.0/dist/dragdoll.umd.js"></script>
```

Access the library via `window.DragDoll` in browser context.

## Usage

```ts
import {
  PointerSensor,
  KeyboardSensor,
  Draggable,
  createPointerSensorStartPredicate,
} from 'dragdoll';

// Let's assume that you have this element in DOM and you want to drag it
// around.
const element = document.querySelector('.draggable');

// First we need to instantiate a new PointerSensor for the element, which
// listens to DOM events and emits drag events for us to listen to. This does
// not yet make the element move.
const pointerSensor = new PointerSensor(element);

// Let's also create a keyboard sensor.
const keyboardSensor = new KeyboardSensor();

// Next, let's make the element move based on the events the PointerSensor
// and KeyboardSensor are emitting. Note that you can feed multiple sensors to
// a single draggable instance.
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  // Here we need to provide a function which returns an array of all the
  // elements that we want to move around based on the provided sensor's
  // events. In this case we just want to move the element which we are
  // monitoring.
  getElements: () => [element],
  // Start predicate is a function which determines when the dragging should
  // start. There's a really good ready-made start predicate available for
  // PointerSensor, which we are using here.
  startPredicate: createPointerSensorStartPredicate(),
});

// Now you should be able to drag the element around using mouse, touch or
// keyboard.

// When you're done with your dragging needs you can destroy the sensor and
// draggable.
draggable.destroy();
pointerSensor.destroy();
```