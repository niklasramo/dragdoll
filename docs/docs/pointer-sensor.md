# PointerSensor

PointerSensor listens to pointer events, touch events and mouse events and normalizes them into unified drag events.

## Example

```typescript
import { PointerSensor, Draggable } from 'dragdoll';

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
  getElements: () => [dragElement],
});
```

## Constructor

- **element** &nbsp;&mdash;&nbsp; `HTMLElement | Window`
  - The element (or window) which's events will be tracked.
- **options** &nbsp;&mdash;&nbsp; `object`
  - Optional.
  - **listenerOptions** &nbsp;&mdash;&nbsp; `{capture?: boolean, passive?: boolean}`
    - This object will be propagated to the source even listeners [listener options](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener). You can use it to define whether the source event listeners should be passive and/or use capture.
    - Optional. Default: `{capture: true, passive: true}`.
  - **sourceEvents** &nbsp;&mdash;&nbsp; `"pointer" | "touch" | "mouse" | "auto"`
    - Define which type of events will be listened and used as source events:
      - `"pointer"` -> [`PointerEvents`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent)
      - `"touch"` -> [`TouchEvents`](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent)
      - `"mouse"`-> [`MouseEvents`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent)
      - `"auto"` -> Detect the best choice automatically (pointer > touch > mouse) based on what browser supports.
    - Optional. Default: `"auto"`.
  - **startPredicate** &nbsp;&mdash;&nbsp; `(e: PointerEvent | TouchEvent | MouseEvent) => boolean`
    - This function is called when drag process is starting up with the initial event as the argument. You can use it to define whether the drag process should be allowed to start (return `true`) or not (return `false`).
    - Optional. Default: `(e) => ('button' in e && e.button > 0 ? false : true)`

## Properties

### element

- The observed element or window.
- Type: `HTMLElement | Window`.
- Read-only.

### pointerId

- Pointer id of the current drag process, `null` when the element is not being dragged.
- Type: `number | null`.
- Read-only.

### pointerType

- Pointer type of the current drag process, `null` when the element is not being dragged.
- Type: `"mouse" | "pen" | "touch" | null`.
- Read-only.

### clientX

- Current horizontal coordinate of the drag within the application's viewport, `null` when the element is not being dragged.
- Type: `number | null`.
- Read-only.

### clientY

- Current vertical coordinate of the drag within the application's viewport, `null` when the element is not being dragged.
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

`pointerSensor.on( eventName, listener, [listenerId] )`

Adds a listener to a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **listener** &nbsp;&mdash;&nbsp; `(eventData) => void`
  - The event listener, which receives [`EventData`](#event-data) object as its argument.
- **listenerId** &nbsp;&mdash;&nbsp; `string | number | symbol`
  - Optionally provide listener id manually.

**Returns** &nbsp;&mdash;&nbsp; `string | number | symbol`

A listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

`pointerSensor.off( eventName, target )`

Removes a listener (based on listener or listener id) from a sensor event.

**Parameters**

- **eventName** &nbsp;&mdash;&nbsp; `"start" | "move" | "end" | "cancel" | "destroy"`
  - The event name.
- **target** &nbsp;&mdash;&nbsp; `Function | string | number | symbol`
  - The event listener or listener id to remove.

### updateSettings

`pointerSensor.updateSettings( options )`

Updates the the sensor's settings.

**Parameters**

- **options** &nbsp;&mdash;&nbsp; `object`
  - You can provide the same options here as in the constructor. Only the options you provide will be updated.

### cancel

`pointerSensor.cancel()`

Forcefully cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

`pointerSensor.destroy()`

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.

## Event Data

The event data is a plain object which contains `type`, `clientX`, `clientY`, `pointerId`, `pointerType`, `srcEvent` and `target` properties. For `"destroy"` event the event data contains _only_ the `type` property.

### type

- Type of the event.
- Type: `"start" | "move" | "end" | "cancel" | "destroy"`.

### clientX

- Current horizontal coordinate within the application's viewport at which the event occurred.
- Type: `number`.

### clientY

- Current vertical coordinate within the application's viewport at which the event occurred.
- Type: `number`.

### pointerId

- Pointer id.
- Type: `number`.

### pointerType

- Pointer type.
- Type: `"mouse" | "pen" | "touch"`.

### srcEvent

- The source event which triggered the drag event. In the special case when `pointerSensor.cancel()` is called `srcEvent` will be `null`.
- Type: `PointerEvent | TouchEvent | MouseEvent | null`.

### target

- Event target.
- Type: `EventTarget | null`.
