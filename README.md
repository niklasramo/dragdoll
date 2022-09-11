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

// Now you should be able to drag the element around using mouse, touch or
// keyboard.

// When you're done with your dragging needs you can destroy the sensor and
// draggable.
draggable.destroy();
pointerSensor.destroy();
```

## API

- [Sensors](#sensors)
  - [Sensor Interface](#sensor-interface)
  - [BaseSensor](#basesensor)
  - [PointerSensor](#pointersensor)
  - [KeyboardSensor](#keyboardsensor)
  - [KeyboardMotionSensor](#keyboardmotionsensor)
- [Draggable](#draggable)
- [DraggableAutoScroll](#draggableautoscroll)
- [AutoScroll](#autoscroll)
- [Ticker configuration](#ticker-configuration)

### Sensors

A sensor is basically a constrained event emitter, which implements the [`Sensor`](src/Sensors/Sensor.ts) interface. The point of sensors is to normalize any kind of signals/events (e.g. DOM events) into unified drag events, which can then be used as input for other systems that need to implement drag behavior.

### Sensor Interface

DragDoll provides a TypeScript interface for validating base functionality of a sensor.

```typescript
import { Sensor } from 'dragdoll';

class CustomSensor implements Sensor {
  // ...
}
```

#### `sensor.on( eventName, listener )`

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener.
  - The `eventData` containts the following properties for all types except `"destroy"`:
    - **type** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel"`
      - Type of the event.
    - **clientX** &nbsp;&mdash;&nbsp; `number`
      - Current horizontal coordinate within the application's viewport at which the event occurred.
    - **clientY** &nbsp;&mdash;&nbsp; `number`
      - Current vertical coordinate within the application's viewport at which the event occurred.
  - For `"destroy"` event the `eventData` contains _only_ the `type` property.

#### `sensor.off( eventName, listener )`

Removes a listener from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `Function`
  - The event listener to remove.

#### `sensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

#### `sensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

### BaseSensor

BaseSensor is an extendable base class to ease the process of creating custom sensors. It does not do anything by itself, but it does implement the Sensor API and provides you some _protected_ helper methods for triggering drag events. It's used by `KeyboardSensor` and `KeyboardMotionSensor` so you can check out implementation tips from those sensors.

#### `baseSensor.clientX`

- Current horizontal coordinate of the drag within the application's viewport.
- `number` when drag is active, `null` when drag is inactive.
- Read-only instance property.

#### `baseSensor.clientY`

- Current vertical coordinate of the drag within the application's viewport.
- `number` when drag is active, `null` when drag is inactive.
- Read-only instance property.

#### `baseSensor.on( eventName, listener, [listenerId] )`

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener.
  - The `eventData` containts the following properties for all types except `"destroy"`:
    - **type** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel"`
      - Type of the event.
    - **clientX** &nbsp;&mdash;&nbsp; `number`
      - Current horizontal coordinate within the application's viewport at which the event occurred.
    - **clientY** &nbsp;&mdash;&nbsp; `number`
      - Current vertical coordinate within the application's viewport at which the event occurred.
  - For `"destroy"` event the `eventData` contains _only_ the `type` property.
- **listenerId** &nbsp;&mdash;&nbsp; _string | number | symbol_
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; `string | number | symbol`

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

#### `baseSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

#### `baseSensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

#### `baseSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

#### `baseSensor._start( startEventData )`

Protected method, which emits drag start event with the provided data.

**Arguments**

- **startEventData** &nbsp;&mdash;&nbsp; `{clientX: number, clientY: number}`
  - The start event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

#### `baseSensor._move( moveEventData )`

Protected method, which emits drag move event with the provided data.

**Arguments**

- **moveEventData** &nbsp;&mdash;&nbsp; `{clientX: number, clientY: number}`
  - The move event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

#### `baseSensor._end( endEventData )`

Protected method, which emits drag end event with the provided data.

**Arguments**

- **endEventData** &nbsp;&mdash;&nbsp; `{clientX: number, clientY: number}`
  - The end event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

#### `baseSensor._cancel( cancelEventData )`

Protected method, which emits drag cancel event with the provided data.

**Arguments**

- **cancelEventData** &nbsp;&mdash;&nbsp; `{clientX: number, clientY: number}`
  - The cancel event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

### PointerSensor

PointerSensor listens to pointer events, touch events and mouse events and normalizes them into unified drag events.

**Constructor arguments**

- **element** &nbsp;&mdash;&nbsp; `HTMLElement | Window`
  - The element (or window) which's events will be tracked.
- **options** &nbsp;&mdash;&nbsp; `object`
  - Optional.
  - **listenerOptions** &nbsp;&mdash;&nbsp; `{capture?: boolean, passive?: boolean}`
    - This object will be propagated to the source even listeners [listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). You can use it to define whether the source event listeners should be passive and/or use capture.
    - Optional. Default: `{capture: true, passive: true}`.
  - **sourceEvents** &nbsp;&mdash;&nbsp; `"pointer" | "touch" | "mouse" | "auto"`
    - Define which type of events will be listened and used as source events:
      - `"pointer"` -> [`PointerEvents`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
      - `"touch"` -> [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)
      - `"mouse"`-> [`MouseEvents`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
      - `"auto"` -> Detect the best choice automatically (pointer > touch > mouse) based on what browser supports.
    - Optional. Default: `"auto"`.
  - **startPredicate** &nbsp;&mdash;&nbsp; `(e: PointerEvent | TouchEvent | MouseEvent) => boolean`
    - This function is called when drag process is starting up with the initial event as the argument. You can use it to define whether the drag process should be allowed to start (return `true`) or not (return `false`).
    - Optional. Default: `(e) => ('button' in e && e.button > 0 ? false : true)`

**Example**

```typescript
import { PointerSensor } from 'dragdoll';

// Track dragging on the window using pointer events.
// Note that we are providing the default options here
// to the constructor which you don't need to do. You can
// just provide the options which differ from the defaults.
const pointerSensor = new PointerSensor(window, {
  listenerOptions: {
    capture: true,
    passive: true,
  },
  sourceEvents: 'auto',
  startPredicate: (e) => ('button' in e && e.button > 0 ? false : true),
});

pointerSensor.on('start', (e) => {
  console.log('drag started', e);
});

pointerSensor.on('move', (e) => {
  console.log('drag moved', e);
});

pointerSensor.on('end', (e) => {
  console.log('drag ended', e);
});

pointerSensor.on('cancel', (e) => {
  console.log('drag canceled', e);
});
```

#### `pointerSensor.element`

- The observed element or window.
- Read-only instance property.

#### `pointerSensor.pointerId`

- Pointer id of the current drag process, `null` when the element is not being dragged.
- Read-only instance property.

#### `pointerSensor.pointerType`

- Pointer type ("mouse" | "pen" | "touch") of the current drag process, `null` when the element is not being dragged.
- Read-only instance property.

#### `pointerSensor.clientX`

- Current horizontal coordinate of the drag within the application's viewport.
- `number` when drag is active, `null` when drag is inactive.
- Read-only instance property.

#### `pointerSensor.clientY`

- Current vertical coordinate of the drag within the application's viewport.
- `number` when drag is active, `null` when drag is inactive.
- Read-only instance property.

#### `pointerSensor.on( eventName, listener, [listenerId] )`

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener, which's only argument is an event data object.
  - The `eventData` containts the following properties for all types except `"destroy"`:
    - **type** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel"`
      - Type of the event.
    - **clientX** &nbsp;&mdash;&nbsp; `number`
      - Current horizontal coordinate within the application's viewport at which the event occurred.
    - **clientY** &nbsp;&mdash;&nbsp; `number`
      - Current vertical coordinate within the application's viewport at which the event occurred.
    - **pointerId** &nbsp;&mdash;&nbsp; `number`
      - Pointer id.
    - **pointerType** &nbsp;&mdash;&nbsp; `"mouse" | "pen" | "touch"`
      - Pointer type.
    - **srcEvent** &nbsp;&mdash;&nbsp; `PointerEvent | TouchEvent | MouseEvent | null`
      - The source event which triggered the drag event.
      - In the special case when `pointerSensor.cancel()` is called `srcEvent` will be `null`.
    - **target** &nbsp;&mdash;&nbsp; `EventTarget | null`
      - Event target.
  - For `"destroy"` event the `eventData` contains _only_ the `type` property.
- **listenerId** &nbsp;&mdash;&nbsp; `string | number | symbol`
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; `string | number | symbol`

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

#### `pointerSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

#### `pointerSensor.updateSettings( options )`

Updates the the instance's settings.

#### `pointerSensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

#### `pointerSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

**Arguments**

- **options** &nbsp;&mdash;&nbsp; `object`
  - You can provide the same options here as in the constructor. Only the options you provide will be updated.

### KeyboardSensor

KeyboardSensor listens to `document`'s `keydown` events and normalizes them into unified drag events. You can configure start/end/move/cancel predicate functions, which determine the drag's movement and the keys that control the drag. Note that this sensor is designed to be as simple and as customizable as possible with minimal API interface, but it is very limited if you need to move elements _smoothly_ by keeping a key pressed down. For that kind of scenario you should use [`KeyboardMotionSensor`](#keyboardmotionsensor).

**Constructor arguments**

- **startPredicate** &nbsp;&mdash;&nbsp; `(e: KeyboardEvent, sensor: KeyboardSensor) => { x: number; y: number } | null | void`
  - Start predicate function which determines if drag should start as well as the initial horizontal and vertical coordinates within the application's viewport.
  - The predicate function is called on `keydown` event in `document` while drag is not active.
  - Should return coordinates (e.g. `{x: 10, y: 10}`) to trigger start, otherwise should return `null` or `undefined` to indicate no action.
  - If drag should start this function should return horizontal and vertical coordinates of active drag within the application's viewport (e.g. `{x: 10, y: 10}`), otherwise this should return `null` or `undefined` to indicate that drag should not start.
- **movePredicate** &nbsp;&mdash;&nbsp; `(e: KeyboardEvent, sensor: KeyboardSensor) => { x: number; y: number } | null | void`
  - Move predicate function which triggers move event and determines the next horizontal and vertical coordinates within the application's viewport.
  - The predicate function is called on `keydown` event in `document` while drag is active.
  - Should return coordinates (e.g. `{x: 10, y: 10}`) to trigger movement, otherwise should return `null` or `undefined` to indicate no action.
- **endPredicate** &nbsp;&mdash;&nbsp; `(e: KeyboardEvent, sensor: KeyboardSensor) => { x: number; y: number } | null | void`
  - End predicate function which ends active drag and determines the final horizontal and vertical coordinates within the application's viewport.
  - The predicate function is called on `keydown` event in `document` while drag is active.
  - Should return coordinates (e.g. `{x: 10, y: 10}`) to end active drag, otherwise should return `null` or `undefined` to indicate no action.
- **cancelPredicate** &nbsp;&mdash;&nbsp; `(e: KeyboardEvent, sensor: KeyboardSensor) => { x: number; y: number } | null | void`
  - Cancel predicate function which cancels active drag and determines the final horizontal and vertical coordinates within the application's viewport.
  - The predicate function is called on `keydown` event in `document` while drag is active.
  - Should return coordinates (e.g. `{x: 10, y: 10}`) to cancel active drag, otherwise should return `null` or `undefined` to indicate no action.

**Example**

```typescript
import { KeyboardSensor } from 'dragdoll';

const DEFAULT_MOVE_DISTANCE = 25;
const keyboardSensor = new KeyboardSensor(window, {
  // Default start predicate, which starts the drag for the currently focued
  // element (if any) when Enter or Space is pressed.
  startPredicate: (e) => {
    if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
      if (document.activeElement) {
        const { left, top } = document.activeElement.getBoundingClientRect();
        return { x: left, y: top };
      }
    }
    return null;
  },
  // Default move predicate, which triggers "move" events when arrow keys
  // are pressed.
  movePredicate: (e, sensor) => {
    switch (e.key) {
      case 'ArrowLeft': {
        return {
          x: sensor.clientX! - DEFAULT_MOVE_DISTANCE,
          y: sensor.clientY!,
        };
      }
      case 'ArrowRight': {
        return {
          x: sensor.clientX! + DEFAULT_MOVE_DISTANCE,
          y: sensor.clientY!,
        };
      }
      case 'ArrowUp': {
        return {
          x: sensor.clientX!,
          y: sensor.clientY! - DEFAULT_MOVE_DISTANCE,
        };
      }
      case 'ArrowDown': {
        return {
          x: sensor.clientX!,
          y: sensor.clientY! + DEFAULT_MOVE_DISTANCE,
        };
      }
      default: {
        return null;
      }
    }
  },
  // Default cancel predicate, which cancels the drag with Escape key.
  cancelPredicate: (e, sensor) => {
    if (e.key === 'Escape') {
      return { x: sensor.clientX!, y: sensor.clientY! };
    }
    return null;
  },
  // Default end predicate, which ends the drag with Enter and Space keys.
  endPredicate: (e, sensor) => {
    if (e.key === 'Enter' || e.key === 'Space' || e.key === ' ') {
      return { x: sensor.clientX!, y: sensor.clientY! };
    }
    return null;
  },
});

keyboardSensor.on('start', (e) => {
  console.log('drag started', e);
});

keyboardSensor.on('move', (e) => {
  console.log('drag moved', e);
});

keyboardSensor.on('end', (e) => {
  console.log('drag ended', e);
});

keyboardSensor.on('cancel', (e) => {
  console.log('drag canceled', e);
});
```

#### `keyboardSensor.clientX`

- Current horizontal coordinate of the drag within the application's viewport.
- `number` when drag is active, `null` when drag is inactive.
- Read-only instance property.

#### `keyboardSensor.clientY`

- Current vertical coordinate of the drag within the application's viewport.
- `number` when drag is active, `null` when drag is inactive.
- Read-only instance property.

#### `keyboardSensor.on( eventName, listener, [listenerId] )`

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener.
  - The `eventData` containts the following properties for all types except `"destroy"`:
    - **type** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel"`
      - Type of the event.
    - **clientX** &nbsp;&mdash;&nbsp; `number`
      - Current horizontal coordinate within the application's viewport at which the event occurred.
    - **clientY** &nbsp;&mdash;&nbsp; `number`
      - Current vertical coordinate within the application's viewport at which the event occurred.
  - For `"destroy"` event the `eventData` contains _only_ the `type` property.
- **listenerId** &nbsp;&mdash;&nbsp; _string | number | symbol_
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; `string | number | symbol`

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

#### `keyboardSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

#### `keyboardSensor.cancel()`

Forcefully cancel the sensor's current drag process.

#### `keyboardSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

### KeyboardMotionSensor

KeyboardMotionSensor works similarly to KeyboardSensor with the exception that you _can_ customize the smoothness of the movement. Think of this more as a 2D game character controller which's movement you can customize to a high degreee.

TODO...

### Draggable

Draggable is a class which acts as an orchestrator for any amount of sensors and moves DOM elements based on events emitted by the sensors.

TODO...

### DraggableAutoScroll

DraggableAutoScroll extends Draggable with auto-scrolling superpowers.

TODO...

### AutoScroll

TODO...

### Ticker configuration

TODO...

## Copyright

Copyright © 2022, Niklas Rämö (inramo@gmail.com). Licensed under the MIT license.
