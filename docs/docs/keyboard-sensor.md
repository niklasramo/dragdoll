[BaseSensor](/docs/base-sensor) →

# KeyboardSensor

KeyboardSensor listens to `document`'s `keydown` events and normalizes them into unified drag events. You can configure start/end/move/cancel predicate functions, which determine the drag's movement and the keys that control the drag. Note that this sensor is designed to be as simple and as customizable as possible with minimal API interface.

## Example

```ts
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

```ts
class KeyboardSensor {
  constructor(options?: KeyboardSensorSettings) {}
}
```

The constuctor accepts one argument, an optional [Settings](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

### moveDistance

```ts
type moveDistance = number;
```

The number of pixels the `clientX` and/or `clientY` values are shifted per `"move"` event.

Defaults to `25`.

### startPredicate

```ts
type startPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor
) => { x: number; y: number } | null | undefined;
```

Start predicate function which should return drag start coordinates (client `x` and `y`) if drag should start and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is not active.

### movePredicate

```ts
type movePredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor
) => { x: number; y: number } | null | undefined;
```

Move predicate function which should return drag's next coordinates (client `x` and `y`) if drag movement is needed and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is active.

### endPredicate

```ts
type endPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor
) => { x: number; y: number } | null | undefined;
```

End predicate function which should return drag's end coordinates (client `x` and `y`) if drag needs to end and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is active.

### cancelPredicate

```ts
type cancelPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor
) => { x: number; y: number } | null | undefined;
```

Cancel predicate function which should return drag's end coordinates (client `x` and `y`) if drag needs to be canceled and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is active.


## Methods

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<KeyboardSensorSettings>) => void;

// Usage
keyboardSensor.updateSettings({
  startPredicate: () => {
    if (Math.random() > 0.5) {
      return { x: 0, y: 0 };
    }
  },
});
```

Updates the the sensor's settings. Accepts [Settings](#settings) object as the first argument, only the options you provide will be updated.
