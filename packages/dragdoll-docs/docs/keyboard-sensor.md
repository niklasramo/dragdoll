[BaseSensor](/base-sensor) →

# KeyboardSensor

KeyboardSensor listens to keyboard events and normalizes them into unified drag events. This sensor is designed to be as simple and as customizable as possible with minimal API interface.

## Example

```ts
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { Draggable } from 'dragdoll/draggable';

// Create a keyboard sensor instance that listens to keydown events and starts
// emitting drag events when the provided element is focused and a start key
// (enter or space) is pressed.
const element = document.querySelector('.draggable') as HTMLElement;
const keyboardSensor = new KeyboardSensor(element);

// Listen to drag events.
keyboardSensor.on('start', (e) => console.log('drag started', e));
keyboardSensor.on('move', (e) => console.log('drag move', e));
keyboardSensor.on('end', (e) => console.log('drag ended', e));
keyboardSensor.on('cancel', (e) => console.log('drag canceled', e));

// Use the sensor to move an element.
const draggable = new Draggable([keyboardSensor], {
  elements: () => [element],
});
```

## Class

```ts
export class KeyboardSensor<E extends KeyboardSensorEvents = KeyboardSensorEvents>
  extends BaseSensor<E>
  implements Sensor<E>
{
  constructor(element: Element | null, options: Partial<KeyboardSensorSettings<E>> = {}) {}
}
```

The KeyboardSensor class is a generic that extends the [`BaseSensor`](/base-sensor) class and implements the [`Sensor`](/sensor) interface.

### Type Variables

1. **E**
   - The type of the events that the sensor will emit.
   - Default: [`KeyboardSensorEvents`](#keyboardsensorevents).

### Constructor Parameters

1. **element**
   - The element which should be focused to start the drag.
2. **options**
   - An optional [`KeyboardSensorSettings`](#keyboardsensorsettings) object, which you can also change later via [`updateSettings`](#updatesettings) method.
   - You only need to provide the options you want to change, the rest will be left as default.
   - Default: `{}`.

## Settings

### moveDistance

```ts
type moveDistance = number | { x: number; y: number };
```

The number of pixels the `x` and/or `y` values are shifted per `"move"` event. You can define a single number to shift both `x` and `y` values by the same amount or an object to shift them by different amounts.

Default is `25`.

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

### startPredicate

```ts
type startPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor,
) => { x: number; y: number } | null | undefined;
```

Start predicate function which should return drag start coordinates (client `x` and `y`) if drag should start and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is not active.

### movePredicate

```ts
type movePredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor,
) => { x: number; y: number } | null | undefined;
```

Move predicate function which should return drag's next coordinates (client `x` and `y`) if drag movement is needed and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is active.

### endPredicate

```ts
type endPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor,
) => { x: number; y: number } | null | undefined;
```

End predicate function which should return drag's end coordinates (client `x` and `y`) if drag needs to end and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is active.

### cancelPredicate

```ts
type cancelPredicate = (
  e: KeyboardEvent,
  sensor: KeyboardSensor,
) => { x: number; y: number } | null | undefined;
```

Cancel predicate function which should return drag's end coordinates (client `x` and `y`) if drag needs to be canceled and otherwise return `null` or `undefined` to indicate no action. Called on `keydown` event in `document` when drag is active.

## Properties

### element

```ts
type element = Element | null;
```

The element, which must be focused when a default start key (enter or space) is pressed, to start the drag. By default this is only used in the default [`startPredicate`](#startpredicate) function, which you can override if you need to. The reason for requiring the element to be defined is simply ergonomics, because most of the time you probably want to track keyboard events in relation to a specific element and not the whole document.

You _can_ also set this explicitly to `null` in which case the sensor will not start the drag automatically. You have to provide your own [`startPredicate`](#startpredicate) function in that case. Naturally you can't also use the [`cancelOnBlur`](#cancelonblur) setting in this case, because the sensor doesn't know which element to blur.

Read-only.

### moveDistance

```ts
type moveDistance = { x: number; y: number };
```

The number of pixels the `x` and `y` values are shifted per `"move"` event by default. Read-only.

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

**Example**

```ts
keyboardSensor.on('start', (e) => {
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
const id = keyboardSensor.on('start', (e) => console.log('start', e));
keyboardSensor.off('start', id);
```

### updateSettings

```ts
type updateSettings = (options: Partial<KeyboardSensorSettings<E>>) => void;
```

Updates the sensor's settings. Accepts a partial [`KeyboardSensorSettings`](#keyboardsensorsettings) object as the first argument, only the options you provide will be updated. Check the [Settings](#settings) section for more information about the settings.

**Example**

```ts
keyboardSensor.updateSettings({
  startPredicate: () => {
    if (Math.random() > 0.5) {
      return { x: 0, y: 0 };
    }
  },
});
```

## Events

### start

Emitted when the sensor starts dragging.

Payload follows the [`KeyboardSensorStartEvent`](#keyboardsensorstartevent) interface.

### move

Emitted when the sensor is moved during the drag.

Payload follows the [`KeyboardSensorMoveEvent`](#keyboardsensormoveevent) interface.

### cancel

Emitted when the drag is canceled.

Payload follows the [`KeyboardSensorCancelEvent`](#keyboardsensorcancelevent) interface.

### end

Emitted when the drag ends without being canceled.

Payload follows the [`KeyboardSensorEndEvent`](#keyboardsensorendevent) interface.

### destroy

Emitted when the sensor is destroyed.

Payload follows the [`KeyboardSensorDestroyEvent`](#keyboardsensordestroyevent) interface.

## Exports

Here's a list of additional exports that are available in the `dragdoll/sensors/keyboard` package.

### KeyboardSensorDefaultSettings

```ts
// Import
import { KeyboardSensorDefaultSettings } from 'dragdoll/sensors/keyboard';

// Constant
const KeyboardSensorDefaultSettings: KeyboardSensorSettings<any>;
```

## Types

### KeyboardSensorPredicate

```ts
// Import
import type { KeyboardSensorPredicate } from 'dragdoll/sensors/keyboard';

// Type
type KeyboardSensorPredicate<E extends KeyboardSensorEvents = KeyboardSensorEvents> = (
  e: KeyboardEvent,
  sensor: KeyboardSensor<E>,
) => { x: number; y: number } | null | undefined;
```

### KeyboardSensorSettings

```ts
// Import
import type { KeyboardSensorSettings } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorSettings<E extends KeyboardSensorEvents = KeyboardSensorEvents> {
  moveDistance: number | { x: number; y: number };
  cancelOnBlur: boolean;
  cancelOnVisibilityChange: boolean;
  startPredicate: KeyboardSensorPredicate<E>;
  movePredicate: KeyboardSensorPredicate<E>;
  cancelPredicate: KeyboardSensorPredicate<E>;
  endPredicate: KeyboardSensorPredicate<E>;
}
```

### KeyboardSensorStartEvent

```ts
// Import
import type { KeyboardSensorStartEvent } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorStartEvent {
  type: 'start';
  x: number;
  y: number;
  srcEvent: KeyboardEvent;
}
```

### KeyboardSensorMoveEvent

```ts
// Import
import type { KeyboardSensorMoveEvent } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorMoveEvent {
  type: 'move';
  x: number;
  y: number;
  srcEvent: KeyboardEvent;
}
```

### KeyboardSensorCancelEvent

```ts
// Import
import type { KeyboardSensorCancelEvent } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorCancelEvent {
  type: 'cancel';
  x: number;
  y: number;
  srcEvent?: KeyboardEvent;
}
```

### KeyboardSensorEndEvent

```ts
// Import
import type { KeyboardSensorEndEvent } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorEndEvent {
  type: 'end';
  x: number;
  y: number;
  srcEvent: KeyboardEvent;
}
```

### KeyboardSensorDestroyEvent

```ts
// Import
import type { KeyboardSensorDestroyEvent } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorDestroyEvent {
  type: 'destroy';
}
```

### KeyboardSensorEvents

```ts
// Import
import type { KeyboardSensorEvents } from 'dragdoll/sensors/keyboard';

// Interface
interface KeyboardSensorEvents {
  start: KeyboardSensorStartEvent;
  move: KeyboardSensorMoveEvent;
  cancel: KeyboardSensorCancelEvent;
  end: KeyboardSensorEndEvent;
  destroy: KeyboardSensorDestroyEvent;
}
```

```

```
