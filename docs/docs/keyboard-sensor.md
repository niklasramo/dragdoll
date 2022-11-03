# KeyboardSensor

KeyboardSensor listens to `document`'s `keydown` events and normalizes them into unified drag events. You can configure start/end/move/cancel predicate functions, which determine the drag's movement and the keys that control the drag. Note that this sensor is designed to be as simple and as customizable as possible with minimal API interface.

## Example

```typescript
import { KeyboardSensor, Draggable } from 'dragdoll';

// Create a keyboard sensor instance. Note that you should not need more than
// one keyboard sensor instance so treat it as a singleton.
const keyboardSensor = new KeyboardSensor();

// Listen to events.
keyboardSensor.on('start', (e) => console.log('drag started', e));
keyboardSensor.on('move', (e) => console.log('drag move', e));
keyboardSensor.on('end', (e) => console.log('drag ended', e));
keyboardSensor.on('cancel', (e) => console.log('drag canceled', e));

// Use the sensor to move an element.
const dragElement = document.querySelector('.dragElement');
const draggable = new Draggable([keyboardSensor], {
  getElements: () => [dragElement],
});
```

## Constructor

- **options** &nbsp;&mdash;&nbsp; `object`
  - Optional.
  - **moveDistance** &nbsp;&mdash;&nbsp; `number`
    - The number of pixels the `clientX` and/or `clientY` values are shifted per `"move"` event.
    - Default: `25`.
  - **startPredicate** &nbsp;&mdash;&nbsp; [`KeyboardSensorPredicate`](#keyboardsensorpredicate)
    - Start predicate function which determines if drag should start as well as the initial horizontal and vertical coordinates within the application's viewport.
  - **movePredicate** &nbsp;&mdash;&nbsp; [`KeyboardSensorPredicate`](#keyboardsensorpredicate)
    - Move predicate function which triggers move event and determines the next horizontal and vertical coordinates within the application's viewport.
  - **endPredicate** &nbsp;&mdash;&nbsp; [`KeyboardSensorPredicate`](#keyboardsensorpredicate)
    - End predicate function which ends active drag and determines the final horizontal and vertical coordinates within the application's viewport.
  - **cancelPredicate** &nbsp;&mdash;&nbsp; [`KeyboardSensorPredicate`](#keyboardsensorpredicate)
    - Cancel predicate function which cancels active drag and determines the final horizontal and vertical coordinates within the application's viewport.

## Properties

### clientX

- Current horizontal coordinate of the drag within the application's viewport, `null` when drag is inactive.
- Type: `number | null`.
- Read-only.

### clientY

- Current vertical coordinate of the drag within the application's viewport, `null` when drag is inactive.
- Type: `number | null`.
- Read-only.

### isActive

- Is dragging active or not?
- Type: `boolean`.
- Read-only.

### isDestroyed

- Is sensor destroyed or not?
- Type: `boolean`.
- Read-only.

## Methods

### on

`keyboardSensor.on( eventName, listener, [listenerId] )`

Adds a listener to a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener, which receives [`EventData`](#event-data) object as its argument.
- **listenerId** &nbsp;&mdash;&nbsp; _string | number | symbol_
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; `string | number | symbol`

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

`keyboardSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

### cancel

`keyboardSensor.cancel()`

Forcefully cancel the sensor's current drag process.

### destroy

`keyboardSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

## Event Data

The event data is a plain object which contains `type`, `clientX` and `clientY` properties. For `"destroy"` event the event data contains _only_ the `type` property.

### type

- Type of the event.
- Type: `"start" | "move" | "end" | "cancel" | "destroy"`.

### clientX

- Current horizontal coordinate within the application's viewport at which the event occurred.
- Type: `number`.

### clientY

- Current vertical coordinate within the application's viewport at which the event occurred.
- Type: `number`.

## Types

### KeyboardSensorPredicate

`(e: KeyboardEvent, sensor: KeyboardSensor) => { x: number; y: number } | null | void`

- A predicate function that is called on `keydown` event in `document` while drag is not active.
- Should return coordinates (e.g. `{x: 10, y: 10}`) to trigger start/move/cancel/end actions, otherwise should return `null` or `undefined` to indicate no action.
