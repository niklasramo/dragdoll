# Sensor

A sensor, in the context of DragDoll, is conceptually a constrained event emitter, which implements the [`Sensor`](https://github.com/niklasramo/dragdoll/blob/main/src/sensors/sensor.ts) interface. The point of sensors is to normalize any kind of signals/events (e.g. DOM events) into unified drag events, which can then be used as input for other systems that need to implement drag behavior.

DragDoll provides a TypeScript interface for validating base functionality of a sensor. Your custom sensor can extend the Sensor API as much as it needs as long as it doesn't break it.

```ts
import { Sensor } from 'dragdoll';

class CustomSensor implements Sensor {
  // ...
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

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

```ts
type destroy = () => void;
```

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.
