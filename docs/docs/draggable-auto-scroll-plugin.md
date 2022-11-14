[Draggable](/docs/draggable) →

# AutoScroll Plugin

Adds auto scrolling superpowers to a Draggable instance.

## Example

```ts
import {
  PointerSensor,
  KeyboardSensor,
  Draggable,
  autoScrollPlugin,
  createPointerSensorStartPredicate,
} from 'dragdoll';

const element = document.querySelector('.draggable');
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor();
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  getElements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
}).use(
  autoScrollPlugin({
    targets: [
      {
        // Auto scroll the window.
        element: window,
        // Vertically only.
        axis: 'y',
        // When the dragged element's edge is 100 pixels (or less) from the
        // window's edge.
        threshold: 100,
      },
    ],
  })
);
```

## Usage

Using the AutoScroll plugin very is simple:

1. Import and invoke the plugin with the [options](#settings) you wish.
2. Provide the return value to Draggable instance's [use](/docs/draggable#use) method.
3. The plugin will get registered to Draggable instance as `"autoscroll"`.

```ts
import { autoScrollPlugin } from 'dragdoll';

draggable.use(
  autoScrollPlugin({
    /* Provide options here... */
  })
);
```

After you have registered the plugin you can access it via [plugins](/docs/draggable#plugins) map and update the initial settings anytime you wish.

```ts
draggable.plugins.get('autoscroll').updateSettings({
  speed: 1000,
});
```

You can also read the current settings anytime you want.

```ts
const currentSettings = draggable.plugins.get('autoscroll').settings;
```

## Settings

### targets

```ts
type targets = AutoScrollTarget[] | ((draggable: Draggable) => AutoScrollItemTarget[]);

type AutoScrollTarget = {
  element: Window | HTMLElement;
  axis?: 'x' | 'y' | 'xy';
  priority?: number;
  threshold?: number;
};
```

Define the autoscroll targets that should be scrolled during drag. This can either be an array of autoscroll targets or a getter function that returns an array of autoscroll targets. If there are no targets defined there will be no autoscrolling happening.

**Autoscroll target:**

- **`element`**:
  - The DOM element (or window) to autoscroll.
  - Default: `[]`.
  - Required.
- **`axis`**
  - The axis or axes to autoscroll. Use `"x"` to autoscroll horizontally, `"y"` to autoscroll vertically or `"xy"` to autoscroll both horizontally and vertically.
  - Default: `"xy"`.
  - Optional.
- **`priority`**
  - A dragged item can only scroll one element horizontally and one element vertically simultaneously. This is an artificial limit to fend off unnecesary complexity, and to avoid awkward situations. In the case where the dragged item overlaps multiple scrollable elements simultaneously and exceeds their scroll thresholds we pick the one that the dragged item overlaps most. However, that's not always the best choice. This is where priority comes in. Here you can manually control which element to prefer over another in these scenarios. The element with highest priority always wins the fight, in matches with equal priority we determine the winner by the amount of overlap.
  - Default: `0`.
  - Optional.
- **`threshold`**
  - Defines the distance (in pixels) from the edge of the autoscroll element when autoscrolling should start. If this value is `0` the scrolling will start when the dragged element reaches the autoscroll element's edge. Do note that the autoscroll element's edge is adjusted dynamically for the calculations in some scenarios, so this value is not always used as an absolute measure.
  - Default: `50`.
  - Optional.

Defaults to `[]`.

### inertAreaSize

```ts
type inertAreaSize = number;
```

Defines the size of the minimum area in the center of the autoscroll element that will be guaranteed not trigger autoscrolling regardless of autoscroll target's threshold size and the dragged item's size. This value is a percentage of the autoscroll element's size (width and/or height depending on the scroll axes), and should be something between `0` and `1`. So in practice, if you set this to e.g `0.5` the inert area would be 50% of the scrollable element's width and/or height.

The main reason an inert area is needed in first place is to balance the autoscrolling UX when having different sized autoscroll elements, and especially really small ones. Without this there would be a good chance that the smaller autoscroll elements would not have a neutral zone at all and would always autoscroll to some direction. However, if you completely want to disable this feature just the value to `0`.

Defaults to `0.2`.

### speed

```ts
type speed = number | SpeedCallback;

type SpeedCallback = (scrollElement: Window | HTMLElement, scrollData: ScrollData) => number;

type ScrollData = {
  direction: 'none' | 'left' | 'right' | 'up' | 'down';
  threshold: number;
  distance: number;
  value: number;
  maxValue: number;
  duration: number;
  speed: number;
  deltaTime: number;
  isEnding: boolean;
};
```

Defines the scrolling speed in pixels per second. You can provide either static speed with a number or dynamic speed with a function. The function is called before every autoscroll operation and should return the speed (as pixels per second) for the next autoscroll operation. The function receives the following arguments:

- **`scrollElement`**
  - The scrolled element or window.
- **`scrollData`**
  - Additional data about the current state of the autoscroll process.
  - **`direction`**
    - The direction of the scroll.
  - **`threshold`**
    - The current threshold in pixels.
  - **`distance`**
    - The dragged element's current distance from the edge of the autoscroll element.
  - **`value`**
    - The autoscroll element's current scroll value on the scrolled axis.
  - **`maxValue`**
    - The autoscroll element's maximum scroll value on the scrolled axis.
  - **`duration`**
    - How long (in ms) this specific autoscroll operation has lasted so far.
  - **`speed`**
    - The current speed as pixels per second.
  - **`deltaTime`**
    - Current frame's delta time (in ms).
  - **`isEnding`**
    - Is the autoscroll process ending? When this is `true` it means that the associated drag element does not satisfy the threshold anymore. You should now start decreasing the speed towards `0` to allow the item to come to rest smoothly.

### smoothStop

```ts
type smoothStop = boolean;
```

When a dragged element is moved out of the threshold area the autoscroll process is set to ending state. However, it's up to you to decide if the actual scrolling motion is stopped gradually or instantly. By default, when this is `false`, scrolling will stop immediately. If you set this to `true` scrolling will continue until speed drops to `0`. When this option is enabled you must handle decelerating the speed to `0` manually within speed function, so do not enable this option if you use a static speed value. The default speed function handles the deceleration automatically.

Defaults to `false`.

### getPosition

```ts
type getPosition = (draggable: Draggable) => { x: number; y: number };
```

This function is used to get the relative position of the dragged element. Relative here means that the position does not have to be any actual position of the dragged element, just a position that reflects the element's movement during the drag. The returned coordinates are used only for detecting the element's current movement direction and nothing else.

By default the values of `x` and `y` properties of the first Draggable item (`draggable.drag.items[0]`) are used. In case there are no drag items available the next "move" event's `clientX` and `clientY` properties are used.

### getClientRect

```ts
type getClientRect = (draggable: Draggable) => {
  left: number;
  top: number;
  width: number;
  height: number;
};
```

This function is used to get the dragged element's (bounding client rect)[https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect] data. The data is queried constantly while dragging is in process so it might be wise to cache the dragged element's client rect data and return it here. By default, however, the client rect data is not cached and is always queried from the DOM in order to function correctly in most cases rather than perform faster.

By default the bounding client rect data of the first Draggable item (`draggable.drag.items[0]`) is queried from the DOM and returned. In case there are no drag items available the next "move" event's `clientX` and `clientY` properties (along with static 50px width and height) are used to create a client rect data.

### onStart

```ts
type onStart = null | (
  scrollElement: HTMLElement | Window,
  scrollDirection: 'none' | 'left' | 'right' | 'up' | 'down';
) => void;
```

A callback that will be called when an [autoscroll target](#targets) starts autoscrolling.

Defaults to `null`.

### onStop

```ts
type onStop = null | (
  scrollElement: HTMLElement | Window,
  scrollDirection: 'left' | 'right' | 'up' | 'down';
) => void;
```

A callback that will be called when an [autoscroll target](#targets) stops autoscrolling.

Defaults to `null`.
