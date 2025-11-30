[BaseMotionSensor](/base-motion-sensor) →

# KeyboardMotionSensor

KeyboardMotionSensor uses keyboard as the input for controlling drag movement smoothly. The keyboard keys, start condition and speed are configurable.

## Example

```ts
import { KeyboardMotionSensor } from 'dragdoll/sensors/keyboard-motion';
import { Draggable } from 'dragdoll/draggable';

// Create a keyboard motion sensor instance that listens to keydown events and
// starts emitting drag events when the provided element is focused and a start
// key is pressed.
const element = document.querySelector('.draggable') as HTMLElement;
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

## Class

```ts
class KeyboardMotionSensor<E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents>
  extends BaseMotionSensor<E>
  implements Sensor<E>
{
  constructor(element: Element | null, options: Partial<KeyboardMotionSensorSettings<E>> = {}) {}
}
```

The KeyboardMotionSensor class is a generic that extends the [`BaseMotionSensor`](/base-motion-sensor) class and implements the [`Sensor`](/sensor) interface.

### Type Variables

1. **E**
   - The type of the events that the sensor will emit.
   - Default: [`KeyboardMotionSensorEvents`](#keyboardsensormotionevents).

### Constructor Parameters

1. **element**
   - The element which should be focused to start the drag.
2. **options**
   - An optional [`KeyboardMotionSensorSettings`](#keyboardsensorsettings) object, which you can also change later via [`updateSettings`](#updatesettings) method.
   - You only need to provide the options you want to change, the rest will be left as default.
   - Default: `{}`.

## Settings

### startPredicate

```ts
type startPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardMotionSensor<E>,
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
type computeSpeed = (sensor: KeyboardMotionSensor<E>) => number;
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

Default is `true`.

### cancelOnVisibilityChange

```ts
type cancelOnVisibilityChange = boolean;
```

If `true`, the drag will be canceled on document's visibility change (e.g. when the tab is hidden).

Default is `true`.

## Properties

### element

```ts
type element = Element | null;
```

The element, which must be focused when a default start key is pressed, to start the drag. By default this is only used in the default [`startPredicate`](#startpredicate) function, which you can override if you need to. The reason for requiring the element to be defined is simply ergonomics, because most of the time you probably want to track keyboard events in relation to a specific element and not the whole document.

You _can_ also set this explicitly to `null` in which case the sensor will not start the drag automatically. You have to provide your own [`startPredicate`](#startpredicate) function in that case. Naturally you can't also use the [`cancelOnBlur`](#cancelonblur) setting in this case, because the sensor doesn't know which element to blur.

Read-only.

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
keyboardMotionSensor.on('start', (e) => {
  console.log('start', e);
});
```

### off

```ts
type off<T extends keyof E> = (type: T, listenerId: SensorEventListenerId) => void;
```

Removes a listener (based on [listener id](/sensor#sensoreventlistenerid)) from a sensor event.

**Example**

```ts
const id = keyboardMotionSensor.on('start', (e) => console.log('start', e));
keyboardMotionSensor.off('start', id);
```

### updateSettings

```ts
type updateSettings = (options: Partial<KeyboardMotionSensorSettings<E>>) => void;
```

Updates the sensor's settings. Accepts a partial [`KeyboardMotionSensorSettings`](#keyboardsensorsettings) object as the first argument, only the options you provide will be updated. Check the [Settings](#settings) section for more information about the settings.

**Example**

```ts
keyboardMotionSensor.updateSettings({
  startPredicate: () => {
    if (Math.random() > 0.5) {
      return { x: 0, y: 0 };
    }
  },
});
```

## Events

KeyboardMotionSensor emits the default base motion sensor events as described in the [BaseMotionSensor](/base-motion-sensor#events) documentation.

## Exports

Here's a list of additional exports that are available in the `dragdoll/sensors/keyboard-motion` package.

### KeyboardMotionSensorDefaultSettings

```ts
// Import
import { KeyboardMotionSensorDefaultSettings } from 'dragdoll/sensors/keyboard-motion';

// Constant
const KeyboardMotionSensorDefaultSettings: KeyboardMotionSensorSettings<any>;
```

## Types

### KeyboardMotionSensorEvents

```ts
// Import
import type { KeyboardMotionSensorEvents } from 'dragdoll/sensors/keyboard-motion';

// Interface
interface KeyboardMotionSensorEvents extends BaseMotionSensorEvents {}
```

### KeyboardMotionSensorSettings

```ts
// Import
import type { KeyboardMotionSensorSettings } from 'dragdoll/sensors/keyboard-motion';

// Interface
interface KeyboardMotionSensorSettings<
  E extends KeyboardMotionSensorEvents = KeyboardMotionSensorEvents,
> {
  startKeys: string[];
  moveLeftKeys: string[];
  moveRightKeys: string[];
  moveUpKeys: string[];
  moveDownKeys: string[];
  cancelKeys: string[];
  endKeys: string[];
  cancelOnBlur: boolean;
  cancelOnVisibilityChange: boolean;
  computeSpeed: (sensor: KeyboardMotionSensor<E>) => number;
  startPredicate: (
    e: KeyboardEvent,
    sensor: KeyboardMotionSensor<E>,
  ) => { x: number; y: number } | null | undefined;
}
```
