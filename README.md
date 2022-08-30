# DragDoll

DragDoll is a modular and highly extensible drag & drop system written in TypeScript. It's based on [Muuri's](https://github.com/haltu/muuri) internal drag and drop system, but redesigned to be used as a general purpose drag & drop system.

- Carefully designed modular API with best possible DX in mind.
- Written in TypeScript with good type inference.
- Small footprint (weighs around 11kB gzipped with all features included).
- MIT licensed.

## Install

Node

```bash
$ npm install dragdoll eventti tikki
```

Browser

```html
<script src="https://cdn.jsdelivr.net/npm/eventti@3.0.0/dist/eventti.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/tikki@2.0.0/dist/tikki.umd.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dragdoll@0.0.1/dist/dragdoll.umd.js"></script>
```

Access the library via `window.DragDoll` in browser context.

## Usage

```typescript
import { PointerSensor, Draggable, createPointerSensorStartPredicate, autoScroll } from 'dragdoll';

// Let's assume that you have this element in DOM and you want to drag it
// around.
const element = document.querySelector('.draggable');

// First we need to instantiate a new PointerSensor for the element, which
// listens to DOM events and emits drag events for us to listen to. This does
// not yet make the element move.
const pointerSensor = new PointerSensor(element);

// Next, let's make the element move based on the events the PointerSensor
// is emitting. Note that you can feed the same sensor to as many Draggables
// as you wish.
const draggable = new Draggable([pointerSensor], {
  // Here we need to provide a function which returns an array of all the
  // elements that we want to move around based on the provided sensor's
  // events. In this case we just want to move the element which we are
  // monitoring.
  getElements: () => [element],
  // Start predicate is a function which determines when the dragging should
  // start. There's a really good ready-made start predicate available for
  // PointerSensor, which we are using here.
  startPredicate: createPointerSensorStartPredicate(),
  // Let's configure autoscrolling for window element when the drag is in
  // process. By default there's no autoscrolling as it's a quite lot of code.
  // We always need to provide the AutoScroll instance via options to avoid
  // loading the autoscroll code when not using it. Also, note that although
  // AutoScroll can be instantiated multiple times it's designed to be used as
  // a singleton, which is why you can import an instance of AutoScroll via
  // DragDoll.
  autoScroll: {
    instance: autoScroll,
    targets: [{ element: window, threshold: 100 }],
  },
});

// Now you should be able to drag the element around using mouse or touch.

// When you're done with your dragging needs you can destroy the sensor and
// draggable.
draggable.destroy();
pointerSensor.destroy();
```

## Copyright

Copyright © 2022, Niklas Rämö (inramo@gmail.com). Licensed under the MIT license.
