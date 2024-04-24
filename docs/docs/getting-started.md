# Getting Started

## Install

DragDoll has three dependencies, [Eventti](https://github.com/niklasramo/eventti), [Tikki](https://github.com/niklasramo/tikki) and [Mezr](https://github.com/niklasramo/mezr), all of which are lightweight and performant libraries. Eventti is used for emitting all the events, Tikki is used for managing the animation loop when necessary and Mezr is used for calculating tricky DOM bits.

### Node

```bash
$ npm install dragdoll eventti tikki mezr
```

### Browser

```html
<script type="importmap">
  {
    "imports": {
      "eventti": "https://cdn.jsdelivr.net/npm/eventti@4.0.0/dist/eventti.js",
      "tikki": "https://cdn.jsdelivr.net/npm/tikki@3.0.1/dist/tikki.js",
      "mezr": "https://cdn.jsdelivr.net/npm/mezr@1.1.0/dist/esm/index.js",
      "dragdoll": "https://cdn.jsdelivr.net/npm/dragdoll@0.4.0/dist/dragdoll.js"
    }
  }
</script>
<script type="module">
  import { Draggable, PointerSensor } from 'dragdoll';
  // etc...
</script>
```

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

// Let's also create a keyboard sensor, which listens to keyboard events and
// emits drag events for us to listen to.
const keyboardSensor = new KeyboardSensor(element);

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

// When you're done with your dragging needs you can destroy the sensors and
// draggable.
draggable.destroy();
pointerSensor.destroy();
keyboardSensor.destroy();
```
