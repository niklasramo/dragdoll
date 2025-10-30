# PointerSensor

PointerSensor listens to pointer events, touch events and mouse events and normalizes them into unified drag events.

## Example

```ts
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { Draggable } from 'dragdoll/draggable';

// Create a pointer sensor instance which tracks pointer/touch/mouse events in
// window and emits drag events.
const pointerSensor = new PointerSensor(window);

// Listen to events.
pointerSensor.on('start', (e) => console.log('drag started', e));
pointerSensor.on('move', (e) => console.log('drag move', e));
pointerSensor.on('end', (e) => console.log('drag ended', e));
pointerSensor.on('cancel', (e) => console.log('drag canceled', e));

// Use the sensor to move an element.
const dragElement = document.querySelector('.dragElement');
const draggable = new Draggable([pointerSensor], {
  elements: () => [dragElement],
});
```

## Class

```ts
class PointerSensor<E extends PointerSensorEvents = PointerSensorEvents> implements Sensor<E> {
  constructor(element: Element | Window, options: Partial<PointerSensorSettings> = {}) {}
}
```

The PointerSensor class is a generic that implements the [`Sensor`](/sensor) interface.

### Type Variables

1. **E**
   - The type of the events that the sensor will emit.
   - Default: [`PointerSensorEvents`](#pointersensorevents).

### Constructor Parameters

1. **element**
   - The element (or window) whose events will be tracked.
2. **options**
   - An optional [`PointerSensorSettings`](#pointersensorsettings) object, which you can also change later via [`updateSettings`](#updatesettings) method.
   - You only need to provide the options you want to change, the rest will be left as default.
   - Default: `{}`.

## Settings

The settings object follows the [`PointerSensorSettings`](#pointersensorsettings) interface. You can pass the settings object to the constructor or update them later via [`updateSettings`](#updatesettings) method.

### listenerOptions

```ts
type listenerOptions = {
  capture?: boolean;
  passive?: boolean;
};
```

This object will be propagated to the source event listeners' [`options`](https://developer.mozilla.org/en-US/Web/API/EventTarget/addEventListener). You can use it to define whether the source event listeners should be passive and/or use capture.

Default: `{ capture: true, passive: true }`

### sourceEvents

```ts
type sourceEvents = 'pointer' | 'touch' | 'mouse' | 'auto';
```

Define which type of events will be listened to and used as source events:

- `"pointer"` -> [`PointerEvents`](https://developer.mozilla.org/en-US/Web/API/PointerEvent)
- `"touch"` -> [`TouchEvents`](https://developer.mozilla.org/en-US/Web/API/TouchEvent)
- `"mouse"` -> [`MouseEvents`](https://developer.mozilla.org/en-US/Web/API/MouseEvent)
- `"auto"` -> Detect the best choice automatically (pointer > touch > mouse) based on what browser supports.

Default: `"auto"`

### startPredicate

```ts
type startPredicate = (e: PointerEvent | TouchEvent | MouseEvent) => boolean;
```

This function is called when drag process is starting up with the initial event as the argument. You can use it to define whether the drag process should be allowed to start (return `true`) or not (return `false`).

Default: `(e) => ('button' in e && e.button > 0 ? false : true)`

## Properties

### element

```ts
type element = Element | Window;
```

The observed element or window. Read-only.

### drag

```ts
type drag = PointerSensorDragData | null;
```

Current drag data or `null` when drag is inactive. The drag data follows the [`PointerSensorDragData`](#pointersensordragdata) interface. Read-only.

### isDestroyed

```ts
type isDestroyed = boolean;
```

Is sensor destroyed or not? Read-only.

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
pointerSensor.on('start', (e) => {
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
const id = pointerSensor.on('start', (e) => console.log('start', e));
pointerSensor.off('start', id);
```

### updateSettings

```ts
type updateSettings = (options: Partial<PointerSensorSettings>) => void;
```

Updates the sensor's settings. Accepts a partial [`PointerSensorSettings`](#pointersensorsettings) object as the first argument, only the options you provide will be updated. Read more about the settings in the [Settings](#settings) section.

**Example**

```ts
pointerSensor.updateSettings({
  startPredicate: () => Math.random() > 0.5,
});
```

### cancel

```ts
type cancel = () => void;
```

Forcibly cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

**Example**

```ts
pointerSensor.cancel();
```

### destroy

```ts
type destroy = () => void;
```

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

**Example**

```ts
pointerSensor.destroy();
```

## Events

### start

Emitted when the sensor starts dragging.

Payload follows the [`PointerSensorStartEvent`](#pointersensorstartevent) interface.

### move

Emitted when the sensor is moved during the drag.

Payload follows the [`PointerSensorMoveEvent`](#pointersensormoveevent) interface.

### cancel

Emitted when the drag is canceled.

Payload follows the [`PointerSensorCancelEvent`](#pointersensorcancelevent) interface.

### end

Emitted when the drag ends without being canceled.

Payload follows the [`PointerSensorEndEvent`](#pointersensorendevent) interface.

### destroy

Emitted when the sensor is destroyed.

Payload follows the [`PointerSensorDestroyEvent`](#pointersensordestroyevent) interface.

## Types

### PointerSensorDragData

```ts
// Import
import type { PointerSensorDragData } from 'dragdoll/sensors/pointer';

// Type
type PointerSensorDragData = {
  readonly pointerId: number;
  readonly pointerType: 'mouse' | 'pen' | 'touch';
  readonly x: number;
  readonly y: number;
};
```

### PointerSensorSettings

```ts
// Import
import type { PointerSensorSettings } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorSettings {
  listenerOptions: { capture?: boolean; passive?: boolean };
  sourceEvents: 'pointer' | 'touch' | 'mouse' | 'auto';
  startPredicate: (e: PointerEvent | TouchEvent | MouseEvent) => boolean;
}
```

### PointerSensorStartEvent

```ts
// Import
import type { PointerSensorStartEvent } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorStartEvent {
  type: 'start';
  x: number;
  y: number;
  pointerId: number;
  pointerType: 'mouse' | 'pen' | 'touch';
  srcEvent: PointerEvent | TouchEvent | MouseEvent;
  target: EventTarget | null;
}
```

### PointerSensorMoveEvent

```ts
// Import
import type { PointerSensorMoveEvent } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorMoveEvent {
  type: 'move';
  x: number;
  y: number;
  pointerId: number;
  pointerType: 'mouse' | 'pen' | 'touch';
  srcEvent: PointerEvent | TouchEvent | MouseEvent;
  target: EventTarget | null;
}
```

### PointerSensorCancelEvent

```ts
// Import
import type { PointerSensorCancelEvent } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorCancelEvent {
  type: 'cancel';
  x: number;
  y: number;
  pointerId: number;
  pointerType: 'mouse' | 'pen' | 'touch';
  srcEvent: PointerEvent | TouchEvent | MouseEvent | null;
  target: EventTarget | null;
}
```

### PointerSensorEndEvent

```ts
// Import
import type { PointerSensorEndEvent } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorEndEvent {
  type: 'end';
  x: number;
  y: number;
  pointerId: number;
  pointerType: 'mouse' | 'pen' | 'touch';
  srcEvent: PointerEvent | TouchEvent | MouseEvent | null;
  target: EventTarget | null;
}
```

### PointerSensorDestroyEvent

```ts
// Import
import type { PointerSensorDestroyEvent } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorDestroyEvent {
  type: 'destroy';
}
```

### PointerSensorEvents

```ts
// Import
import type { PointerSensorEvents } from 'dragdoll/sensors/pointer';

// Interface
interface PointerSensorEvents {
  start: PointerSensorStartEvent;
  move: PointerSensorMoveEvent;
  cancel: PointerSensorCancelEvent;
  end: PointerSensorEndEvent;
  destroy: PointerSensorDestroyEvent;
}
```
