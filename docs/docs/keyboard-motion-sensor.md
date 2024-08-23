[BaseMotionSensor](/docs/base-motion-sensor) →

# KeyboardMotionSensor

KeyboardMotionSensor uses keyboard as the input for controlling drag movement smoothly. The keyboard keys, start condition and speed are configurable.

## Example

```ts
import { KeyboardMotionSensor, Draggable } from 'dragdoll';

// Create a keyboard motion sensor instance that listens to keydown events and
// starts emitting drag events when the provided element is focused and a start
// key is pressed.
const element = document.querySelector('.draggable');
const sensor = new KeyboardMotionSensor(element);

// Listen to drag events.
sensor.on('start', (e) => console.log('drag started', e));
sensor.on('move', (e) => console.log('drag move', e));
sensor.on('end', (e) => console.log('drag ended', e));
sensor.on('cancel', (e) => console.log('drag canceled', e));
sensor.on('tick', () => console.log('tick'));

// Use the sensor to move an element.
const draggable = new Draggable([sensor], {
  elements: () => [element],
});
```

## Constructor

```ts
class KeyboardMotionSensor {
  constructor(element: Element | null, options?: Partial<KeyboardMotionSensorSettings>) {}
}
```

The constuctor accepts two arguments: the element which should be focused to start the drag and an optional [`settings`](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

### startPredicate

```ts
type startPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardMotionSensor,
) => { x: number; y: number } | null | undefined;
```

Start predicate function that determines if drag should start. Return `null` or `undefined` if you don't want drag to start. If you want drag to start return an object with `x` and `y` properties that define the drag's initial viewport coordinates.

Default:

```ts
(_e, sensor) => {
  if (sensor.element && document.activeElement === sensor.element) {
    const { left, top } = sensor.element.getBoundingClientRect();
    return { x: left, y: top };
  }
  return null;
};
```

### computeSpeed

```ts
type computeSpeed = (sensor: KeyboardMotionSensor) => number;
```

This function is called on every frame when drag is active. It should return the current speed of the drag movement.

Default: `() => 500`.

### startKeys

```ts
type startKeys = string[];
```

Default: `[' ', 'Enter']`.

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

Default: `[' ', 'Enter']`.

### cancelOnBlur

```ts
type cancelOnBlur = boolean;
```

If `true`, the drag will be canceled when the `element` is blurred.

Defaults to `true`.

### cancelOnVisibilityChange

```ts
type cancelOnVisibilityChange = boolean;
```

If `true`, the drag will be canceled on document's visibility change (e.g. when the tab is hidden).

Defaults to `true`.

## Properties

### element

```ts
type element = Element | null;
```

The element, which must be focused when a default start key is pressed, to start the drag. By default this is only used in the default [`startPredicate`](#startpredicate) function, which you can override if you need to. The reason for requiring the element to be defined is simply ergonomics, because most of the time you probably want to track keyboard events in relation to a specific element and not the whole document.

You _can_ also set this explicitly to `null` in which case the sensor will not start the drag automatically. You have to provide your own [`startPredicate`](#startpredicate) function in that case. Naturally you can't also use the [`cancelOnBlur`](#cancelonblur) setting in this case, because the sensor doesn't know which element to blur.

Read-only.

## Methods

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<KeyboardMotionSensorSettings>) => void;

// Usage
keyboardMotionSensor.updateSettings({
  startPredicate: () => {
    if (Math.random() > 0.5) {
      return { x: 0, y: 0 };
    }
  },
});
```

Updates the the sensor's settings. Accepts [`settings`](#settings) object as the first argument, only the options you provide will be updated.
