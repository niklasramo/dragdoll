[BaseControllerSensor](/docs/base-controller-sensor) →

# KeyboardControllerSensor

KeyboardControllerSensor uses keyboard as the input for controlling drag movement smoothly. The keyboard keys, start condition and speed are configurable.

## Example

```ts
import { KeyboardControllerSensor, Draggable } from 'dragdoll';

// Create a keyboard controller sensor instance.
const sensor = new KeyboardControllerSensor();

// Listen to events.
sensor.on('start', (e) => console.log('drag started', e));
sensor.on('move', (e) => console.log('drag move', e));
sensor.on('end', (e) => console.log('drag ended', e));
sensor.on('cancel', (e) => console.log('drag canceled', e));
sensor.on('tick', () => console.log('tick'));

// Use the sensor to move an element.
const dragElement = document.querySelector('.dragElement');
const draggable = new Draggable([sensor], {
  getElements: () => [dragElement],
});
```

## Constructor

```ts
class KeyboardControllerSensor {
  constructor(options?: Partial<KeyboardControllerSensorSettings>) {}
}
```

The constuctor accepts one argument, an optional [Settings](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

### startPredicate

```ts
type startPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardControllerSensor
) => { x: number; y: number } | null | undefined;
```

Start predicate function that determines if drag should start. Return `null` or `undefined` if you don't want drag to start. If you want drag to start return an object with `x` and `y` properties that define the drag's initial viewport coordinates.

Default:

```ts
() => {
  if (document.activeElement) {
    const { left, top } = document.activeElement.getBoundingClientRect();
    return { x: left, y: top };
  }
  return null;
};
```

### computeSpeed

```ts
type computeSpeed = (sensor: KeyboardControllerSensor) => number;
```

This function is called on every frame when drag is active. It should return the current speed of the drag movement.

Default: `() => 500`.

### startKeys

```ts
type startKeys = string[];
```

Default: `[' ', 'Space', 'Enter']`.

### moveLeftKeys

```ts
type moveLeftKeys = string[];
```

Default: `['ArrowLeft']`.

### moveRightKeys

```ts
type moveRightKeys = string[];
```

Default: `['ArrowRight']`.

### moveUpKeys

```ts
type moveUpKeys = string[];
```

Default: `['ArrowUp']`.

### moveDownKeys

```ts
type moveDownKeys = string[];
```

Default: `['ArrowDown']`.

### cancelKeys

```ts
type cancelKeys = string[];
```

Default: `['Escape']`.

### endKeys

```ts
type endKeys = string[];
```

Default: `[' ', 'Space', 'Enter']`.

## Methods

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<KeyboardControllerSensorSettings>) => void;

// Usage
keyboardControllerSensor.updateSettings({
  startPredicate: () => {
    if (Math.random() > 0.5) {
      return { x: 0, y: 0 };
    }
  },
});
```

Updates the the sensor's settings. Accepts [Settings](#settings) object as the first argument, only the options you provide will be updated.
