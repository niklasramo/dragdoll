[BaseSensor](/docs/base-sensor) →

# KeyboardSensor

KeyboardSensor listens to `document`'s `keydown` events and normalizes them into unified drag events. You can configure start/end/move/cancel predicate functions, which determine the drag's movement and the keys that control the drag. This sensor is designed to be as simple and as customizable as possible with minimal API interface.

## Example

```ts
import { KeyboardSensor, Draggable } from 'dragdoll';

// Create a keyboard sensor instance that listens to keydown events and starts
// emitting drag events when the provided element is focused and a start key
// (enter or space) is pressed. You can stop the drag by pressing the end key
// (enter or space) or cancel it by pressing the cancel key (escape).
const element = document.querySelector('.draggable');
const keyboardSensor = new KeyboardSensor(element);

// Listen to drag events.
keyboardSensor.on('start', (e) => console.log('drag started', e));
keyboardSensor.on('move', (e) => console.log('drag move', e));
keyboardSensor.on('end', (e) => console.log('drag ended', e));
keyboardSensor.on('cancel', (e) => console.log('drag canceled', e));

// Use the sensor to move an element.
const draggable = new Draggable([keyboardSensor], {
  getElements: () => [element],
});
```

## Constructor

```ts
class KeyboardSensor {
  constructor(element: Element | null, options?: KeyboardSensorSettings) {}
}
```

The constuctor accepts two arguments: the element which should be focused to start the drag and an optional [Settings](#settings) object, which you can also change later via [`updateSettings`](#updatesettings) method.

## Settings

### moveDistance

```ts
type moveDistance = number | { x: number; y: number };
```

The number of pixels the `x` and/or `y` values are shifted per `"move"` event. You can define a single number to shift both `x` and `y` values by the same amount or an object to shift them by different amounts.

Defaults to `25`.

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

The number of pixels the `x` and `y` values are be shifted per `"move"` event by default. Read-only.

## Methods

### updateSettings

```ts
// Type
type updateSettings = (options?: Partial<KeyboardSensorSettings>) => void;

// Usage
keyboardSensor.updateSettings({
  startPredicate: () => {
    if (Math.random() > 0.5) {
      return { x: 0, y: 0 };
    }
  },
});
```

Updates the the sensor's settings. Accepts [Settings](#settings) object as the first argument, only the options you provide will be updated.
