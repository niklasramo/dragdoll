# Sensor

A sensor, in the context of DragDoll, is conceptually a constrained event emitter, which implements the [`Sensor`](https://github.com/niklasramo/dragdoll/blob/main/src/sensors/sensor.ts) interface. The point of sensors is to normalize any kind of signals/events (e.g. DOM events) into unified drag events, which can then be used as input for other systems that need to implement drag behavior.

DragDoll provides a TypeScript interface for validating base functionality of a sensor. Your custom sensor can extend the Sensor API as much as it needs as long as it doesn't break it.

Internally DragDoll uses [`Eventti`](https://github.com/niklasramo/eventti) to implement all of the event emitting, which is why the [`on`](#on) and [`off`](#off) method semantics are modeled after Eventti's [`Emitter API`](https://github.com/niklasramo/eventti?tab=readme-ov-file#emitter-api).

```ts
import { Sensor, SensorEvents } from 'dragdoll/sensors';

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

## Abstract Class

```ts
abstract class Sensor<E extends SensorEvents = SensorEvents> {
  declare _events_type: E;
  abstract on<T extends keyof E>(
    type: T,
    listener: (eventData: E[T]) => void,
    listenerId?: SensorEventListenerId,
  ): SensorEventListenerId;
  abstract off<T extends keyof E>(type: T, listenerId: SensorEventListenerId): void;
  abstract cancel(): void;
  abstract destroy(): void;
}
```

### Type Variables

1. **E**
   - The type of the events that the sensor will emit.
   - Default: [`SensorEvents`](#sensorevents).

## Abstract Methods

### on

```ts
type on = <T extends keyof E>(
  type: T,
  listener: (e: E[T]) => void,
  listenerId?: SensorEventListenerId,
) => SensorEventListenerId;
```

Adds a listener to a sensor event. Returns a [listener id](#sensoreventlistenerid), which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

Please check the [Events](#events) section for more information about the events and their payloads.

### off

```ts
type off = <T extends keyof E>(type: T, listenerId: SensorEventListenerId) => void;
```

Removes a listener (based on [listener id](#sensoreventlistenerid)) from a sensor event.

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

To make TypeScript happy, you need to declare `_events_type` field in your sensor class as a [type-only field declaration](https://www.typescriptlang.org/handbook/2/classes.html#type-only-field-declarations). This allows, for example, the [`Draggable`](/draggable) class to infer the correct event types for your sensor.

The field is not actually outputted to the JavaScript code, so it doesn't affect the runtime behavior of your sensor. However, when used within a TypeScript project, it will _look_ like a normal field when your sensor instance is accessed, so keep in mind that it's only a type declaration.

If you don't use TypeScript, you can ignore this field completely.

```ts
import { Sensor, SensorEvents } from 'dragdoll/sensors';

class CustomSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  declare _events_type: E;
  // ...
}
```

## Events

### start

Emitted when the sensor starts dragging.

Payload follows the [`SensorStartEvent`](#sensorstartevent) interface.

### move

Emitted when the sensor is moved during the drag.

Payload follows the [`SensorMoveEvent`](#sensormoveevent) interface.

### cancel

Emitted when the drag is canceled.

Payload follows the [`SensorCancelEvent`](#sensorcancelevent) interface.

### end

Emitted when the drag ends without being canceled.

Payload follows the [`SensorEndEvent`](#sensorendevent) interface.

### destroy

Emitted when the sensor is destroyed.

Payload follows the [`SensorDestroyEvent`](#sensordestroyevent) interface.

## Exports

Here's a list of additional exports that are available in the `dragdoll/sensors` package.

### SensorEventType

```ts
// Import
import { SensorEventType } from 'dragdoll/sensors';

// Enum (object literal)
const SensorEventType = {
  Start: 'start',
  Move: 'move',
  Cancel: 'cancel',
  End: 'end',
  Destroy: 'destroy',
} as const;
```

## Types

### SensorStartEvent

```ts
// Import
import type { SensorStartEvent } from 'dragdoll/sensors';

// Interface
interface SensorStartEvent {
  type: 'start';
  x: number;
  y: number;
}
```

### SensorMoveEvent

```ts
// Import
import type { SensorMoveEvent } from 'dragdoll/sensors';

// Interface
interface SensorMoveEvent {
  type: 'move';
  x: number;
  y: number;
}
```

### SensorCancelEvent

```ts
// Import
import type { SensorCancelEvent } from 'dragdoll/sensors';

// Interface
interface SensorCancelEvent {
  type: 'cancel';
  x: number;
  y: number;
}
```

### SensorEndEvent

```ts
// Import
import type { SensorEndEvent } from 'dragdoll/sensors';

// Interface
interface SensorEndEvent {
  type: 'end';
  x: number;
  y: number;
}
```

### SensorDestroyEvent

```ts
// Import
import type { SensorDestroyEvent } from 'dragdoll/sensors';

// Interface
interface SensorDestroyEvent {
  type: 'destroy';
}
```

### SensorEvents

```ts
// Import
import type { SensorEvents } from 'dragdoll/sensors';

// Interface
interface SensorEvents {
  start: SensorStartEvent;
  move: SensorMoveEvent;
  cancel: SensorCancelEvent;
  end: SensorEndEvent;
  destroy: SensorDestroyEvent;
}
```

### SensorEventType

```ts
// Import
import type { SensorEventType } from 'dragdoll/sensors';

// Type
type SensorEventType = 'start' | 'move' | 'cancel' | 'end' | 'destroy';
```

### SensorEventListenerId

```ts
// Import
import type { SensorEventListenerId } from 'dragdoll/sensors';

// Type
type SensorEventListenerId = null | string | number | symbol | bigint | Function | Object;
```

This is a type alias for [`EventListenerId`](https://github.com/niklasramo/eventti#eventlistenerid) from Eventti.

### SensorsEventsType

```ts
// Import
import type { SensorsEventsType } from 'dragdoll/sensors';

// Type
type SensorsEventsType<S extends Sensor[]> = S[number]['_events_type'];
```
