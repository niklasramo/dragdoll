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

### Sensors

A sensor is basically a constrained event emitter, which implements the [`Sensor`](src/Sensors/Sensor.ts) interface. The point of sensors is to normalize any kind of signals/events (e.g. DOM events) into unified drag events, which can then be used as input for other systems that need to implement drag behavior.

#### Sensor Interface

DragDoll provides a TypeScript interface for validating base functionality of a sensor.

##### sensor.on( eventName, listener )

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel" | "destroy"_
  - The event name, which can be one of `"start"`, `"move"`, `"end"`, `"cancel"` or `"destroy"`.
- **listener** &nbsp;&mdash;&nbsp; _(e: {type: eventName, clientX?: number, clientY?: number }) => void_
  - The event listener, which's only argument is an event data object which must contain `clientX` and `clientY` values for all event types except for `"destroy"` (which must only contain the `type` property).

##### sensor.off( eventName, listener )

Removes a listener from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel" | "destroy"_
  - The event name, which can be one of `"start"`, `"move"`, `"end"`, `"cancel"` or `"destroy"`.
- **listener** &nbsp;&mdash;&nbsp; _(e: {type: eventName, clientX?: number, clientY?: number }) => void_
  - The event listener to remove.

##### sensor.cancel()

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

##### sensor.destroy()

Destroy's the sensor. Disposes all allocated memory and removes all bound event listeners.

#### BaseSensor

BaseSensor is an extendable base class to ease the process of creating custom sensors. It does not do anything by itself, but it does implement the Sensor API and provides you some _protected_ helper methods for triggering drag events. It's used by `KeyboardSensor` and `KeyboardMotionSensor` so you can check out implementation tips from those sensors.

**Instantiation syntax**

`new BaseSensor()`

##### baseSensor.clientX

- Current client x-position of the drag input, `null` when drag is not active.
- Read-only instance property.

##### baseSensor.clientY

- Current client y-position of the drag input, `null` when drag is not active.
- Read-only instance property.

##### baseSensor.on( eventName, listener, [listenerId] )

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel" | "destroy"_
  - The event name, which can be one of `"start"`, `"move"`, `"end"`, `"cancel"` or `"destroy"`.
- **listener** &nbsp;&mdash;&nbsp; _(eventData) => void_
  - The event listener, which's only argument is an event data object.
  - The event data containts the following properties for all types except `"destroy"`:
    - **type** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel"_
    - **clientX** &nbsp;&mdash;&nbsp; _number_
    - **clientY** &nbsp;&mdash;&nbsp; _number_
  - For `"destroy"` event the event data contains _only_ the `type` property.
- **listenerId** &nbsp;&mdash;&nbsp; _string | number | symbol_
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; _string | number | symbol_

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

##### baseSensor.off( eventName, target )

Removes a listener (based on listener or listener id) from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel" | "destroy"_
  - The event name, which can be one of `"start"`, `"move"`, `"end"`, `"cancel"` or `"destroy"`.
- **target** &nbsp;&mdash;&nbsp; _Function | string | number | symbol_
  - The event listener or listener id to remove.

##### baseSensor.cancel()

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

##### baseSensor.destroy()

Destroy's the sensor. Disposes all allocated memory and removes all bound event listeners.

##### baseSensor.\_start( startEventData )

Emits drag start event with the provided data.

**Arguments**

- **startEventData** &nbsp;&mdash;&nbsp; _"{clientX: number, clientY: number}"_
  - The start event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

##### baseSensor.\_move( moveEventData )

Emits drag move event with the provided data.

**Arguments**

- **moveEventData** &nbsp;&mdash;&nbsp; _"{clientX: number, clientY: number}"_
  - The move event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

##### baseSensor.\_end( endEventData )

Emits drag end event with the provided data.

**Arguments**

- **endEventData** &nbsp;&mdash;&nbsp; _"{clientX: number, clientY: number}"_
  - The end event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

##### baseSensor.\_cancel( cancelEventData )

Emits drag cancel event with the provided data.

**Arguments**

- **cancelEventData** &nbsp;&mdash;&nbsp; _"{clientX: number, clientY: number}"_
  - The cancel event data.
  - Note that you don't need to provide the `type` property here as it's automatically added to the final event data by the method.
  - You can provide other properties in addition to `clientX` and `clientY`.

#### PointerSensor

PointerSensor listens to pointer events, touch events and mouse events and normalizes them into unified drag events.

**Instantiation syntax**

`new PointerSensor( element, [options] )`

**Constructor arguments**

- **element** — _HTMLElement | Window_
  - The element (or window) which's events will be tracked.
- **options** — _object_
  - Optional.
  - **listenerOptions** — `{ capture?: boolean, passive?: boolean }`
    - This object will be propagated to the source even listeners [listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). You can use it to define whether the source event listeners should be passive and/or use capture.
    - Optional. Default: `{ capture: true, passive: true }`.
  - **sourceEvents** — _"pointer" | "touch" | "mouse" | "auto"_;
    - Define which type of events will be listened and used as source events:
      - `"pointer"` -> [`PointerEvents`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
      - `"touch"` -> [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)
      - `"mouse"`-> [`MouseEvents`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
      - `"auto"` -> Detect the best choice automatically (pointer > touch > mouse) based on what browser supports.
    - Optional. Default: `"auto"`.
  - **startPredicate** - `(e: PointerEvent | TouchEvent | MouseEvent) => boolean`
    - This function is called when drag process is starting up with the initial event as the argument. You can use it to define whether the drag process should be allowed to start (return `true`) or not (return `false`).
    - Optional. Default: `(e) => ('button' in e && e.button > 0 ? false : true)`

##### pointerSensor.element

- The observed element or window.
- Read-only instance property.

##### pointerSensor.pointerId

- Pointer id of the current drag process, `null` when the element is not being dragged.
- Read-only instance property.

##### pointerSensor.pointerType

- Pointer type ("mouse" | "pen" | "touch") of the current drag process, `null` when the element is not being dragged.
- Read-only instance property.

##### pointerSensor.clientX

- Current client x-position of the drag input, `null` when the element is not being dragged.
- Read-only instance property.

##### pointerSensor.clientY

- Current client y-position of the drag input, `null` when the element is not being dragged.
- Read-only instance property.

##### pointerSensor.on( eventName, listener, [listenerId] )

Adds a listener to a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel" | "destroy"_
  - The event name, which can be one of `"start"`, `"move"`, `"end"`, `"cancel"` or `"destroy"`.
- **listener** &nbsp;&mdash;&nbsp; _(eventData) => void_
  - The event listener, which's only argument is an event data object.
  - The event data containts the following properties for all types except `"destroy"`:
    - **type** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel"_
    - **clientX** &nbsp;&mdash;&nbsp; _number_
    - **clientY** &nbsp;&mdash;&nbsp; _number_
    - **pointerId** &nbsp;&mdash;&nbsp; _number_
    - **pointerType** &nbsp;&mdash;&nbsp; _"mouse" | "pen" | "touch"_
    - **srcEvent** &nbsp;&mdash;&nbsp; _PointerEvent | TouchEvent | MouseEvent_
    - **target** &nbsp;&mdash;&nbsp; _EventTarget | null_
  - For `"destroy"` event the event data contains _only_ the `type` property.
- **listenerId** &nbsp;&mdash;&nbsp; _string | number | symbol_
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; _string | number | symbol_

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

##### pointerSensor.off( eventName, target )

Removes a listener (based on listener or listener id) from a sensor event.

**Arguments**

- **eventName** &nbsp;&mdash;&nbsp; _"start" | "move" | "end" | "cancel" | "destroy"_
  - The event name, which can be one of `"start"`, `"move"`, `"end"`, `"cancel"` or `"destroy"`.
- **target** &nbsp;&mdash;&nbsp; _Function | string | number | symbol_
  - The event listener or listener id to remove.

##### pointerSensor.updateSettings( options )

Updates the the instance's settings.

##### pointerSensor.cancel()

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

##### pointerSensor.destroy()

Destroy's the sensor. Disposes all allocated memory and removes all bound event listeners.

**Arguments**

- **options** &nbsp;&mdash;&nbsp; _object_
  - You can provide the same options here as in the constructor. Only the options you provide will be updated.

#### KeyboardSensor

KeyboardSensor listens to specific keystrokes, which you can define yourself, and normalizes them into unified drag events. The implementation is kept as simple as possible and you can't customize the smoothness of the movement much.

#### KeyboardMotionSensor

KeyboardMotionSensor works similarly to KeyboardSensor with the exception that you _can_ customize the smoothness of the movement. Think of this more as a 2D game character controller which's movement you can customize to a high degreee.

### Draggable

Draggable is a class which acts as an orchestrator for any amount of sensors and moves DOM elements based on events emitted by the sensors.

## Copyright

Copyright © 2022, Niklas Rämö (inramo@gmail.com). Licensed under the MIT license.
