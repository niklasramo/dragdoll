[BaseSensor](/docs/base-sensor) →

# BaseControllerSensor

BaseControllerSensor is a tailor-made base sensor for scenarios where you want to smoothly move an object, e.g. a car or a character in a 2D game, based on custom inputs. It extends [BaseSensor](/docs/base-sensor) and provides functionality for controlling the drag movement on every frame via speed and direction.

## Example

```ts
import { BaseControllerSensor, Draggable } from 'dragdoll';

// Create a custom controller sensor which starts moving the provided
// element "virtually" in random direction with random speed when you press
// space. Stop the drag pressing space again, and cancel by pressing esc.
class CustomControllerSensor extends BaseControllerSensor {
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
        if (this.isActive) {
          e.preventDefault();
          this._end({
            type: 'end',
            clientX: this.clientX!,
            clientY: this.clientY!,
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
          this.speed = Math.floor(Math.random() * (maxSpeed - minSpeed + 1) + minSpeed);

          // Compute random direction vector.
          const a = Math.random() * (2 * Math.PI);
          this.direction.x = Math.cos(a);
          this.direction.y = Math.sin(a);

          // Start the drag.
          this._start({
            type: 'start',
            clientX: left,
            clientY: top,
          });
        }
        return;
      }
      // Cancel on esc.
      case 'Escape': {
        if (this.isActive) {
          e.preventDefault();
          this._cancel({
            type: 'cancel',
            clientX: this.clientX!,
            clientY: this.clientY!,
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
const customSensor = new CustomControllerSensor(dragElement);

// Listen to events.
customSensor.on('start', (e) => console.log('drag started', e));
customSensor.on('move', (e) => console.log('drag move', e));
customSensor.on('end', (e) => console.log('drag ended', e));
customSensor.on('cancel', (e) => console.log('drag canceled', e));
customSensor.on('tick', () => console.log('tick'));

// Use the sensor to move an element.
const draggable = new Draggable([customSensor], {
  getElements: () => [customSensor.element],
});
```

## Properties

### direction

```ts
type direction = { x: number; y: number };
```

2D direction vector which indicates the drag direction. This is assumed to be a unit vector (length 1) if there should be movement, otherwise x and y components should be 0. You can manually modify this anytime you want.

### speed

```ts
type speed = number;
```

The speed of the drag as pixels-per-second. You can manually modify this anytime you want.

### time

```ts
type time = DOMHighResTimeStamp;
```

The latest [`high resolution timestamp`](https://developer.mozilla.org/en-US/docs/Web/API/DOMHighResTimeStamp) in milliseconds. Note that this is only updated while drag is active. Read-only.

### deltaTime

```ts
type time = number;
```

Current frame's delta time in milliseconds. Note that this is only updated while drag is active. Read-only.

## Methods

### on

```ts
// Type
type on = (
  eventName: 'start' | 'move' | 'cancel' | 'end' | 'destroy' | 'tick',
  listener: (
    e:
      | {
          type: 'start' | 'move' | 'end' | 'cancel';
          clientX: number;
          clientY: number;
        }
      | {
          type: 'tick';
          time: number;
          deltaTime: number;
        }
      | {
          type: 'destroy';
        }
  ) => void,
  listenerId?: string | number | symbol
) => string | number | symbol;

// Usage
baseControllerSensor.on('start', (e) => {
  console.log('start', e);
});
```

Adds a listener to a sensor event. Returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

```ts
// Type
type off = (
  eventName: 'start' | 'move' | 'cancel' | 'end' | 'destroy' | 'tick',
  target: Function | string | number | symbol
) => void;

// Usage
const id = baseControllerSensor.on('start', (e) => console.log('start', e));
baseControllerSensor.off('start', id);
```

Removes a listener (based on listener or listener id) from a sensor event.
