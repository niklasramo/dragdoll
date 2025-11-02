[BaseSensor](/base-sensor) →

# BaseMotionSensor

BaseMotionSensor is an extendable base class tailor-made for scenarios where you want to smoothly move an object, e.g. a car or a character in a 2D game, based on custom inputs. It extends [`BaseSensor`](/base-sensor) and provides functionality for controlling the drag movement on every frame via protected [`_speed`](#speed) and [`_direction`](#direction) properties.

## Example

```ts
import { BaseMotionSensor } from 'dragdoll/sensors/base-motion';
import { Draggable } from 'dragdoll/draggable';

// Create a custom controller sensor which starts moving the provided
// element "virtually" in random direction with random speed when you press
// space. Stop the drag pressing space again, and cancel by pressing esc.
class CustomMotionSensor extends BaseMotionSensor {
  element: HTMLElement;

  constructor(element: HTMLElement) {
    super();
    this.element = element;
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener('keydown', this.onKeyDown);
  }

  onKeyDown(e: KeyboardEvent) {
    switch (e.key) {
      // Start/stop drag with space.
      case ' ': {
        // Stop.
        if (this.drag) {
          e.preventDefault();
          this._end({
            type: 'end',
            x: this.drag.x,
            y: this.drag.y,
          });
        }
        // Start.
        else {
          e.preventDefault();
          // Get start coordinates from the element.
          const { left, top } = this.element.getBoundingClientRect();

          // Compute random speed.
          const maxSpeed = 1000;
          const minSpeed = 100;
          this._speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed);

          // Compute random direction vector.
          const a = Math.random() * (2 * Math.PI);
          this._direction.x = Math.cos(a);
          this._direction.y = Math.sin(a);

          // Start the drag.
          this._start({
            type: 'start',
            x: left,
            y: top,
          });
        }
        return;
      }
      // Cancel on esc.
      case 'Escape': {
        if (this.drag) {
          e.preventDefault();
          this._cancel({
            type: 'cancel',
            x: this.drag.x,
            y: this.drag.y,
          });
        }
        return;
      }
    }
  }

  destroy() {
    if (this.isDestroyed) return;
    document.removeEventListener('keydown', this.onKeyDown);
    super.destroy();
  }
}

// Create a custom controller sensor instance.
const dragElement = document.querySelector('.dragElement');
const customSensor = new CustomMotionSensor(dragElement);

// Listen to events.
customSensor.on('start', (e) => console.log('drag started', e));
customSensor.on('move', (e) => console.log('drag move', e));
customSensor.on('end', (e) => console.log('drag ended', e));
customSensor.on('cancel', (e) => console.log('drag canceled', e));
customSensor.on('tick', () => console.log('tick'));

// Use the sensor to move an element.
const draggable = new Draggable([customSensor], {
  elements: () => [customSensor.element],
});
```

## Class

```ts
class BaseMotionSensor<E extends BaseMotionSensorEvents = BaseMotionSensorEvents>
  extends BaseSensor<E>
  implements Sensor<E>
{
  constructor() {}
}
```

The BaseMotionSensor class is a generic that extends the [`BaseSensor`](/base-sensor) class and implements the [`Sensor`](/sensor) interface.

### Type Variables

1. **E**
   - The type of the events that the sensor will emit.
   - Default: [`BaseMotionSensorEvents`](#basesensormotionevents).

## Properties

### drag

```ts
type drag = BaseMotionSensorDragData | null;
```

Current drag data or `null` when drag is inactive. The drag data follows the [`BaseMotionSensorDragData`](#basesensormotiondragdata) interface. Read-only.

## Protected Properties

These properties are not meant to be exposed publicly, but they are available for any class that extends this class. They should be used to control the drag speed and direction.

### \_direction

```ts
type _direction = { x: number; y: number };
```

2D direction vector which indicates the drag direction. This is assumed to be a unit vector (length 1) if there should be movement, otherwise x and y components should be 0. You can manually modify this anytime you want.

### \_speed

```ts
type _speed = number;
```

The speed of the drag as pixels-per-second. You can manually modify this anytime you want.

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
baseMotionSensor.on('start', (e) => {
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
const id = baseMotionSensor.on('start', (e) => console.log('start', e));
baseMotionSensor.off('start', id);
```

## Events

### start

Emitted when the sensor starts dragging.

Payload follows the [`SensorStartEvent`](/sensor#sensorstartevent) interface.

### move

Emitted when the sensor is moved during the drag.

Payload follows the [`SensorMoveEvent`](/sensor#sensormoveevent) interface.

### cancel

Emitted when the drag is canceled.

Payload follows the [`SensorCancelEvent`](/sensor#sensorcancelevent) interface.

### end

Emitted when the drag ends without being canceled.

Payload follows the [`SensorEndEvent`](/sensor#sensorendevent) interface.

### destroy

Emitted when the sensor is destroyed.

Payload follows the [`SensorDestroyEvent`](/sensor#sensordestroyevent) interface.

### tick

Emitted every frame when the sensor is dragging.

Payload follows the [`BaseMotionSensorTickEvent`](#basesensortickevent) interface.

## Types

### BaseMotionSensorTickEvent

```ts
// Import
import type { BaseMotionSensorTickEvent } from 'dragdoll/sensors/base-motion';

// Interface
interface BaseMotionSensorTickEvent {
  type: 'tick';
  time: number;
  deltaTime: number;
}
```

### BaseMotionSensorEvents

```ts
// Import
import type { BaseMotionSensorEvents } from 'dragdoll/sensors/base-motion';

// Interface
interface BaseMotionSensorEvents extends SensorEvents {
  tick: BaseMotionSensorTickEvent;
}
```

### BaseMotionSensorDragData

```ts
// Import
import type { BaseMotionSensorDragData } from 'dragdoll/sensors/base-motion';

// Interface
interface BaseMotionSensorDragData {
  readonly x: number;
  readonly y: number;
  readonly time: number;
  readonly deltaTime: number;
}
```
