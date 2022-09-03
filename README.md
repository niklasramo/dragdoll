# DragDoll

DragDoll is a modular and highly extensible drag & drop system written in TypeScript. It's based on [Muuri's](https://github.com/haltu/muuri) internal drag system, but redesigned to be used as a general purpose drag & drop system.

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

// Now you should be able to drag the element around using mouse or touch.

// We can also.
pointerSensor.on('start', (e) => console.log('start', e));
pointerSensor.on('move', (e) => console.log('move', e));
pointerSensor.on('end', (e) => console.log('end', e));
pointerSensor.on('cancel', (e) => console.log('cancel', e));

// When you're done with your dragging needs you can destroy the sensor and
// draggable.
draggable.destroy();
pointerSensor.destroy();
```

## Copyright

Copyright © 2022, Niklas Rämö (inramo@gmail.com). Licensed under the MIT license.
