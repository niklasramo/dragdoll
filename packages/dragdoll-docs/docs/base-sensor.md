# BaseSensor

BaseSensor is an extendable base class to ease the process of creating custom sensors. It does not do anything by itself, but it does implement the [`Sensor`](/sensor) API and provides you some protected helper methods for controlling the state of the drag process. It's used by [`KeyboardSensor`](/keyboard-sensor) so you can check out implementation tips there.

## Example

```ts
import { BaseSensor } from 'dragdoll/sensors/base';

// A sensor that moves (the amount of hopDistance) in a random direction when
// you double-click the provided target element.
class DoubleClickHopSensor extends BaseSensor {
  private hopDistance: number;
  private target: Document | HTMLElement;
  private timerId: number | null;
  private onDoubleClickBound: (e: MouseEvent) => void;

  constructor(hopDistance = 50, target: Document | HTMLElement = document) {
    super();
    this.hopDistance = hopDistance;
    this.target = target;
    this.timerId = null;
    this.onDoubleClickBound = this.onDoubleClick.bind(this);
    target.addEventListener('dblclick', this.onDoubleClickBound);
  }

  private onDoubleClick(e: MouseEvent) {
    // If we are already dragging, don't do anything.
    if (this.drag) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const angle = Math.random() * 2 * Math.PI;
    const dx = Math.round(this.hopDistance * Math.cos(angle));
    const dy = Math.round(this.hopDistance * Math.sin(angle));
    const endX = startX + dx;
    const endY = startY + dy;

    this._start({ type: 'start', x: startX, y: startY });
    this._move({ type: 'move', x: endX, y: endY });
    this._end({ type: 'end', x: endX, y: endY });
  }

  destroy() {
    if (this.isDestroyed) return;
    if (this.timerId !== null) window.clearTimeout(this.timerId);
    this.target.removeEventListener('dblclick', this.onDoubleClickBound);
    super.destroy();
  }
}

// Usage
const hopSensor = new DoubleClickHopSensor(80);
hopSensor.on('start', (e) => console.log('start', e.x, e.y));
hopSensor.on('move', (e) => console.log('move', e.x, e.y));
hopSensor.on('end', (e) => console.log('end', e.x, e.y));
```

## Class

```ts
class BaseSensor<E extends SensorEvents = SensorEvents> implements Sensor<E> {
  constructor() {}
}
```

The BaseSensor class is a generic that implements the [`Sensor`](/sensor) interface.

### Type Variables

1. **E**
   - The type of the events that the sensor will emit.
   - Default: [`SensorEvents`](/sensor#sensorevents).

## Properties

### drag

```ts
type drag = BaseSensorDragData | null;
```

Current drag data or `null` when drag is inactive. The drag data follows the [`BaseSensorDragData`](#basesensordragdata) interface. Read-only.

### isDestroyed

```ts
type isDestroyed = boolean;
```

Is sensor destroyed or not? Read-only.

## Protected Properties

These properties are not meant to be exposed publicly, but they are available for any class that extends this class.

### \_emitter

An event emitter, instance of [Eventti Emitter](https://github.com/niklasramo/eventti#api).

## Methods

### on

```ts
type on<T extends keyof E> = (
  type: T,
  listener: (e: E[T]) => void,
  listenerId?: SensorEventListenerId,
) => SensorEventListenerId;
```

Adds a listener to a sensor event. Returns a [listener id](/sensor#sensoreventlistenerid), which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

Please check the [Events](#events) section for more information about the events and their payloads.

**Example**

```ts
baseSensor.on('start', (e) => console.log('start', e));
```

### off

```ts
type off<T extends keyof E> = (type: T, listenerId: SensorEventListenerId) => void;
```

Removes a listener (based on [listener id](/sensor#sensoreventlistenerid)) from a sensor event.

**Example**

```ts
const id = baseSensor.on('start', (e) => console.log('start', e));
baseSensor.off('start', id);
```

### cancel

```ts
type cancel = () => void;
```

Forcibly cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

**Example**

```ts
baseSensor.cancel();
```

### destroy

```ts
type destroy = () => void;
```

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

**Example**

```ts
baseSensor.destroy();
```

## Protected Methods

These methods are not meant to be exposed publicly, but they are available for any class that extends this class. You can use them to control the drag process.

### \_start

```ts
type _start = (data: SensorStartEvent) => void;
```

Protected method, which starts the drag process and emits drag [start event](/sensor#sensorstartevent) with the provided data.

**Example**

```ts
baseSensor._start({ type: 'start', x: 100, y: 200 });
```

### \_move

```ts
type _move = (data: SensorMoveEvent) => void;
```

Protected method, which emits drag [move event](/sensor#sensormoveevent) with the provided data.

**Example**

```ts
baseSensor._move({ type: 'move', x: 100, y: 200 });
```

### \_end

```ts
type _end = (data: SensorEndEvent) => void;
```

Protected method, which ends the drag process and emits drag [end event](/sensor#sensorendevent) with the provided data.

**Example**

```ts
baseSensor._end({ type: 'end', x: 100, y: 200 });
```

### \_cancel

```ts
type _cancel = (data: SensorCancelEvent) => void;
```

Protected method, which cancels the drag process and emits drag [cancel event](/sensor#sensorcancelevent) with the provided data.

**Example**

```ts
baseSensor._cancel({ type: 'cancel', x: 100, y: 200 });
```

## Events

BaseSensor emits the default sensor events as described in the [Sensor Events](/sensor#events) documentation.

## Types

### BaseSensorDragData

```ts
// Import
import type { BaseSensorDragData } from 'dragdoll/sensors/base';

// Interface
interface BaseSensorDragData {
  readonly x: number;
  readonly y: number;
}
```
