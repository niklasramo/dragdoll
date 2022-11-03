# BaseSensor

BaseSensor is an extendable base class to ease the process of creating custom sensors. It does not do anything by itself, but it does implement the Sensor API and provides you some _protected_ helper methods for controlling the state of the drag process. It's used by [`KeyboardSensor`](/docs/keyboard-sensor) so you can check out implementation tips there.

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

`baseSensor.on( eventName, listener, [listenerId] )`

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

`baseSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

### cancel

`baseSensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

`baseSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

## Protected Methods

These protected methods are inherited by any class that extends this class and can be used to control the drag process.

### \_start

`baseSensor._start( startEventData )`

Protected method, which emits drag start event with the provided data.

**Parameters**

- **startEventData** &nbsp;&mdash;&nbsp; `object`
  - Start event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"start"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

### \_move

`baseSensor._move( moveEventData )`

Protected method, which emits drag move event with the provided data.

**Parameters**

- **moveEventData** &nbsp;&mdash;&nbsp; `object`
  - Move event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"move"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

### \_end

`baseSensor._end( endEventData )`

Protected method, which emits drag end event with the provided data.

**Parameters**

- **endEventData** &nbsp;&mdash;&nbsp; `object`
  - End event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"end"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

### \_cancel

`baseSensor._cancel( cancelEventData )`

Protected method, which emits drag cancel event with the provided data.

**Parameters**

- **cancelEventData** &nbsp;&mdash;&nbsp; `object`
  - Cancel event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"cancel"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

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
