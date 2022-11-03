# Sensor

A sensor, in the context of DragDoll, is conceptually a constrained event emitter, which implements the [`Sensor`](https://github.com/niklasramo/dragdoll/tree/main/src/Sensors/Sensor.ts) interface. The point of sensors is to normalize any kind of signals/events (e.g. DOM events) into unified drag events, which can then be used as input for other systems that need to implement drag behavior.

DragDoll provides a TypeScript interface for validating base functionality of a sensor.

```typescript
import { Sensor } from 'dragdoll';

class CustomSensor implements Sensor {
  // ...
}
```

## Abstract Methods

### on

`sensor.on( eventName, listener )`

Adds a listener to a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener, which receives [`EventData`](#event-data) object as its argument.

### off

`sensor.off( eventName, listener )`

Removes a listener from a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `Function`
  - The event listener to remove.

### cancel

`sensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

`sensor.destroy()`

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
