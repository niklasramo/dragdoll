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

## Constructor

```ts
class PointerSensor {
  constructor(element: HTMLElement | Window, options?: Partial<PointerSensorSettings>) {}
}
```

The constuctor accepts two arguments: `element` and `options`. The first argument is the element (or window) which's events will be tracked. The second argument is an optional [`settings`](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

### listenerOptions

```ts
type listenerOptions = {
  capture?: boolean;
  passive?: boolean;
};
```

This object will be propagated to the source event listeners' [`options`](https://developer.mozilla.org/en-US/Web/API/EventTarget/addEventListener). You can use it to define whether the source event listeners should be passive and/or use capture.

Defaults to `{ capture: true, passive: true }`.

### sourceEvents

```ts
type sourceEvents = 'pointer' | 'touch' | 'mouse' | 'auto';
```

Define which type of events will be listened and used as source events:

- `"pointer"` -> [`PointerEvents`](https://developer.mozilla.org/en-US/Web/API/PointerEvent)
- `"touch"` -> [`TouchEvents`](https://developer.mozilla.org/en-US/Web/API/TouchEvent)
- `"mouse"` -> [`MouseEvents`](https://developer.mozilla.org/en-US/Web/API/MouseEvent)
- `"auto"` -> Detect the best choice automatically (pointer > touch > mouse) based on what browser supports.

Defaults to `"auto"`.

### startPredicate

```ts
type startPredicate = (e: PointerEvent | TouchEvent | MouseEvent) => boolean;
```

This function is called when drag process is starting up with the initial event as the argument. You can use it to define whether the drag process should be allowed to start (return `true`) or not (return `false`).

Defaults to `(e) => ('button' in e && e.button > 0 ? false : true)`.

## Properties

### element

```ts
type element = HTMLElement | Window;
```

The observed element or window. Read-only.

### drag

```ts
type drag = {
  readonly pointerId: number;
  readonly pointerType: 'mouse' | 'pen' | 'touch' | null;
  readonly x: number;
  readonly y: number;
} | null;
```

Current drag data or `null` when drag is inactive. Read-only.

### isDestroyed

```ts
type isDestroyed = boolean;
```

Is sensor destroyed or not? Read-only.

## Methods

### on

```ts
// Type
type on = (
  type: 'start' | 'move' | 'cancel' | 'end' | 'destroy',
  listener: (
    e:
      | {
          type: 'start' | 'move' | 'end';
          x: number;
          y: number;
          pointerId: number;
          pointerType: 'mouse' | 'pen' | 'touch';
          srcEvent: PointerEvent | TouchEvent | MouseEvent;
          target: EventTarget | null;
        }
      | {
          type: 'cancel';
          x: number;
          y: number;
          pointerId: number;
          pointerType: 'mouse' | 'pen' | 'touch';
          srcEvent: PointerEvent | TouchEvent | MouseEvent | null;
          target: EventTarget | null;
        }
      | {
          type: 'destroy';
        },
  ) => void,
  listenerId?: ListenerId,
) => ListenerId;

type ListenerId = null | string | number | symbol | Function | Object;

// Usage
pointerSensor.on('start', (e) => {
  console.log('start', e);
});
```

Adds a listener to a sensor event. Returns a listener id, which can be used to remove this specific listener. By default this will always be a symbol unless manually provided.

### off

```ts
// Type
type off = (type: 'start' | 'move' | 'cancel' | 'end' | 'destroy', listenerId: ListenerId) => void;

type ListenerId = null | string | number | symbol | Function | Object;

// Usage
const id = pointerSensor.on('start', (e) => console.log('start', e));
pointerSensor.off('start', id);
```

Removes a listener (based on listener id) from a sensor event.

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<PointerSensorSettings>) => void;

// Usage
pointerSensor.updateSettings({
  startPredicate: () => Math.random() > 0.5,
});
```

Updates the the sensor's settings. Accepts [`settings`](#settings) as the first argument, only the options you provide will be updated.

### cancel

```ts
// Type
type cancel = () => void;

// Usage
pointerSensor.cancel();
```

Forcibly cancel the sensor's current drag process. The purpose of this method is to have a manual way of aborting the drag procedure at all times.

### destroy

```ts
// Type
type destroy = () => void;

// Usage
pointerSensor.destroy();
```

Destroy the sensor. Disposes all allocated memory and removes all bound event listeners.
