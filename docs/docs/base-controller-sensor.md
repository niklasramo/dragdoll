# BaseControllerSensor

BaseControllerSensor is a tailor-made _base_ sensor for scenarios where you want to smoothly move an object, e.g. a car or a character in a 2D game, based on custom inputs. It extends [BaseSensor](/docs/base-sensor) and provides functionality for controlling the drag movement on every frame via speed and direction.

## Example

```typescript
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

- 2D direction vector which indicates the drag direction. This is assumed to be a unit vector (length 1) if there should be movement, otherwise x and y components should be 0.
- You can manually modify this anytime you want.
- Type: `{ x: number, y: number }`.

### speed

- The speed of the drag as pixels-per-second.
- You can manually modify this anytime you want.
- Type: `number`.

### time

- Current frame's timestamp in milliseconds.
- Type: `number`.
- Read-only.

### tickDeltaTime

- Current frame's delta time in milliseconds.
- Type: `number`.
- Read-only.

### clientX

- Current horizontal coordinate of the drag within the application's viewport, `null` when drag is inactive.
- Type: `number | null`.
- Read-only.

### clientY

- Current vertical coordinate of the drag within the application's viewport, `null` when drag is inactive.
- Type: `number | null`.
- Read-only.

### isActive

- Is dragging active or not?
- Type: `boolean`.
- Read-only.

### isDestroyed

- Is sensor destroyed or not?
- Type: `boolean`.
- Read-only.

## Methods

### on

`baseControllerSensor.on( eventName, listener, [listenerId] )`

Adds a listener to a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "tick" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `( e?: EventData ) => void`
  - The event listener, which receives [`EventData`](#event-data) object as its argument for all events except `"tick"`.
- **listenerId** &nbsp;&mdash;&nbsp; _string | number | symbol_
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; `string | number | symbol`

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

`baseControllerSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "tick" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

### cancel

`baseControllerSensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

`baseControllerSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

## Protected Methods

These protected methods are inherited by any class that extends this class and can be used to control the drag process.

### \_start

`baseControllerSensor._start( startEventData )`

Protected method, which emits drag start event with the provided data.

**Parameters**

- **startEventData** &nbsp;&mdash;&nbsp; `object`
  - Start event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"start"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

### \_move

`baseControllerSensor._move( moveEventData )`

Protected method, which emits drag move event with the provided data.

**Parameters**

- **moveEventData** &nbsp;&mdash;&nbsp; `object`
  - Move event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"move"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

### \_end

`baseControllerSensor._end( endEventData )`

Protected method, which emits drag end event with the provided data.

**Parameters**

- **endEventData** &nbsp;&mdash;&nbsp; `object`
  - End event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"end"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

### \_cancel

`baseControllerSensor._cancel( cancelEventData )`

Protected method, which emits drag cancel event with the provided data.

**Parameters**

- **cancelEventData** &nbsp;&mdash;&nbsp; `object`
  - Cancel event data (see [`EventData`](#event-data)).
  - **type** &nbsp;&mdash;&nbsp; `"cancel"`
  - **clientX** &nbsp;&mdash;&nbsp; `number`
  - **clientY** &nbsp;&mdash;&nbsp; `number`

## Event Data

The event data is a plain object which contains `type`, `clientX` and `clientY` properties. For `"destroy"` event the event data contains _only_ the `type` property.

### type

- Type of the event.
- Type: `"start" | "move" | "end" | "cancel" | "destroy"`.

### clientX

- Current horizontal coordinate within the application's viewport at which the event occurred.
- Type: `number`.

### clientY

- Current vertical coordinate within the application's viewport at which the event occurred.
- Type: `number`.
