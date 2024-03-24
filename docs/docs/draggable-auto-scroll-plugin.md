[Draggable](/docs/draggable) →

# AutoScroll Plugin

Adds autoscrolling superpowers to a Draggable instance.

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
        // Autoscroll the window.
        element: window,
        // Vertically only.
        axis: 'y',
        // When the dragged element's edge is 100 pixels (or less) from the
        // window's edge.
        threshold: 100,
      },
    ],
  }),
);

// Update settings later if need be.
draggable.plugins.autoscroll.updateSettings({
  axis: 'x',
  threshold: 200,
});
```

## Usage

Using the AutoScroll plugin very is simple:

1. Import and invoke the plugin with the [`options`](#settings) you wish.
2. Provide the return value to Draggable instance's [`use`](/docs/draggable#use) method.
3. The plugin will get registered to Draggable instance as `"autoscroll"` (accessible via `draggable.plugins.autoscroll`).

```ts
import { autoScrollPlugin } from 'dragdoll';

draggable.use(
  autoScrollPlugin({
    /* Provide options here... */
  }),
);
```

You can read and update the plugin's settings anytime you want.

```ts
// Read current speed setting.
const currentSpeed = draggable.plugins.autoscroll.settings.speed;

// Update current speed setting.
draggable.plugins.autoscroll.updateSettings({
  speed: 1000,
});
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
  padding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
  scrollPadding?: {
    left?: number;
    right?: number;
    top?: number;
    bottom?: number;
  };
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
  - Defines the distance (in pixels) from the edge of the target element when autoscrolling should start. If this value is `0` the scrolling will start when the dragged element reaches the target element's edge. Do note that the target element's edge is adjusted dynamically for the calculations in some scenarios, so this value is not always used as an absolute measure.
  - Default: `50`.
  - Optional.
- **`padding`**
  - By default the dragged element needs to overlap the target element for autoscrolling to start/continue. However, sometimes you might want to start/continue autoscrolling even if the dragged element is outside the target element, and this option allows you to do just that. Here you can define additional **virtual** padding for the target element, which is added to the element's dimensions when considering if it overlaps the dragged element or not. One practical use case for this is when you want to scroll the window, you most likely want to have infinite (use `Infinity` as padding value) padding on all side for the window element.
  - Negative padding is not allowed.
  - Default: `{ left: 0, right: 0, top: 0, bottom: 0 }`.
  - Optional.
- **`scrollPadding`**
  - This works identically to the `padding` option, but is only used while the element is being auto-scrolled. If you don't define this then `padding` option's value will be used for both the start and scroll scenarios. You might want to use this in scenarios where you want to extend the auto-scrolled element's activation area after it has started auto-scrolling.
  - Negative padding is not allowed.
  - Default: `{ left: 0, right: 0, top: 0, bottom: 0 }`.
  - Optional.

Defaults to `[]`.

### inertAreaSize

```ts
type inertAreaSize = number;
```

Defines the size of the minimum area in the center of the target element that will be guaranteed not trigger autoscrolling regardless of autoscroll target's threshold size and the dragged item's size. This value is a percentage of the target element's size (width and/or height depending on the scroll axes), and should be something between `0` and `1`. For example, if you set this to `0.5` the inert area would be 50% of the scrollable element's width and/or height.

The main reason an inert area is needed in first place is to balance the autoscrolling UX when having different sized target elements, and especially really small ones. Without this there would be a good chance that the smaller target elements would not have a neutral zone at all and would always autoscroll to some direction. However, if you completely want to disable this feature just set the value to `0`.

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
    - The dragged element's current distance from the edge of the target element.
  - **`value`**
    - The target element's current scroll value on the scrolled axis.
  - **`maxValue`**
    - The target element's maximum scroll value on the scrolled axis.
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

This function is used to get the dragged element's [bounding client rect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) data. The data is queried constantly while dragging is in process, which is why the client rect data is cached to perform better on most use cases.

By default the cached [`clientRect`](/docs/draggable-drag-item#clientrect) data of the first Draggable item is queried. In case there are no drag items available the current "move" event's `clientX` and `clientY` properties (along with static 50px width and height) are used to create a client rect data.

Note that the DraggableDragItem has an [`updateSize`](/docs/draggable-drag-item#updatesize) method which you can use to update the cached client rect data if the dragged element's size changes during the drag.

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
