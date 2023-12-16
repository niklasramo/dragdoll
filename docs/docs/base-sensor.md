# BaseSensor

BaseSensor is an extendable base class to ease the process of creating custom sensors. It does not do anything by itself, but it does implement the [Sensor](/docs/sensor) API and provides you some protected helper methods for controlling the state of the drag process. It's used by [`KeyboardSensor`](/docs/keyboard-sensor) so you can check out implementation tips there.

## Constructor

```ts
class BaseSensor {
  constructor() {}
}
```

The constuctor accepts no arguments.

## Properties

### drag

```ts
type drag = {
  // Coordinates of the drag within the viewport.
  readonly x: number;
  readonly y: number;
} | null;
```

Current drag data or `null` when drag is inactive. Read-only.

### isDestroyed

```ts
type isDestroyed = boolean;
```

Is sensor destroyed or not? Read-only.

## Protected Properties

### \_emitter

An event emitter, instance of [Eventti Emitter](https://github.com/niklasramo/eventti#api).

## Methods

### on

```ts
// Type
type on = (
  eventName: 'start' | 'move' | 'cancel' | 'end' | 'destroy',
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
  listenerId?: string | number | symbol,
) => string | number | symbol;

// Usage
baseSensor.on('start', (e) => {
  console.log('start', e);
});
```

Adds a listener to a sensor event. Returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

```ts
// Type
type off = (
  eventName: 'start' | 'move' | 'cancel' | 'end' | 'destroy',
  target: Function | string | number | symbol,
) => void;

// Usage
const id = baseSensor.on('start', (e) => console.log('start', e));
baseSensor.off('start', id);
```

Removes a listener (based on listener or listener id) from a sensor event.

### cancel

```ts
// Type
type cancel = () => void;

// Usage
baseSensor.cancel();
```

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
baseSensor.destroy();
```

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

## Protected Methods

These protected methods are inherited by any class that extends this class and should be used to control the drag process.

### \_start

```ts
// Type
type _start = (data: { type: 'start'; x: number; y: number }) => void;

// Usage
baseSensor._start({ type: 'start', x: 100, y: 200 });
```

Protected method, which starts the drag process and emits drag start event with the provided data.

### \_move

```ts
// Type
type _move = (data: { type: 'move'; x: number; y: number }) => void;

// Usage
baseSensor._move({ type: 'move', x: 100, y: 200 });
```

Protected method, which emits drag move event with the provided data.

### \_end

```ts
// Type
type _end = (data: { type: 'end'; x: number; y: number }) => void;

// Usage
baseSensor._end({ type: 'end', x: 100, y: 200 });
```

Protected method, which ends the drag process and emits drag end event with the provided data.

### \_cancel

```ts
// Type
type _cancel = (data: { type: 'cancel'; x: number; y: number }) => void;

// Usage
baseSensor._cancel({ type: 'cancel', x: 100, y: 200 });
```

Protected method, which cancels the drag process and emits drag cancel event with the provided data.
