# Sensor

A sensor, in the context of DragDoll, is conceptually a constrained event emitter, which implements the [`Sensor`](https://github.com/niklasramo/dragdoll/blob/main/src/sensors/sensor.ts) interface. The point of sensors is to normalize any kind of signals/events (e.g. DOM events) into unified drag events, which can then be used as input for other systems that need to implement drag behavior.

DragDoll provides a TypeScript interface for validating base functionality of a sensor. Your custom sensor can extend the Sensor API as much as it needs as long as it doesn't break it.

```ts
import { Sensor, SensorEvents } from 'dragdoll';

class CustomSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  declare _events_type: E;
  on(type, listener, listenerId) {
    // ...
  }
  off(type, listenerId) {
    // ...
  }
  cancel() {
    // ...
  }
  destroy() {
    // ...
  }
}
```

## Abstract Methods

### on

```ts
type on = (
  type: 'start' | 'move' | 'cancel' | 'end' | 'destroy',
  listener: (
    e:
      | {
          type: 'start' | 'move' | 'end' | 'cancel';
          x: number;
          y: number;
        }
      | {
          type: 'destroy';
        },
  ) => void,
  listenerId?: ListenerId,
) => ListenerId;

type ListenerId = null | string | number | symbol | Function | Object;
```

Adds a listener to a sensor event.

### off

```ts
type off = (
  type: 'start' | 'move' | 'cancel' | 'end' | 'destroy',
  listenerId: null | string | number | symbol | Function | Object,
) => void;
```

Removes a listener (based on listener id) from a sensor event.

### cancel

```ts
type cancel = () => void;
```

Forcibly cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

```ts
type destroy = () => void;
```

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

## Type-only field declarations

### \_events_type

To make TypeScript happy, you need to declare `_events_type` field in your sensor class as a [type-only field decalaration](https://www.typescriptlang.org/docs/handbook/2/classes.html#type-only-field-declarations). This allows, for example, the [`Draggable`](/docs/draggable) class to infer the correct event types for your sensor.

The field is not actually outputted to the JavaScript code, so it doesn't affect the runtime behavior of your sensor. However, when used within a TypeScript project, it will _look_ like a normal field when your sensor instance is accessed, so keep in mind that it's only a type declaration.

If you don't use TypeScript, you can ignore this field completely.

```ts
import { Sensor, SensorEvents } from 'dragdoll';

class CustomSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  declare _events_type: E;
  // ...
}
```
