# Tips and Tricks

## Server-Side Rendering (SSR)

DragDoll is designed to work only in a browser environment, but it can be _imported_ in a non-browser environment without throwing an error. Just make sure that you don't try to actually use it in a non-browser environment and you're good to go.

## Handling Natively Draggable Elements

Image (`<img>`) and anchor (`<a>`) elements are natively draggable in the browser, meaning that their [`draggable`](https://developer.mozilla.org/en-US/Web/HTML/Global_attributes/draggable) attribute is set to `true` by default. This behavior _will_ interfere with any custom dragging behavior.

PointerSensor handles this automatically via the [`preventNativeDrag`](/pointer-sensor#preventnativedrag) setting, which is **enabled by default**. It prevents native drag by calling `preventDefault()` on the window's `dragstart` event when a pointer interaction starts.

**Alternative:** If you prefer to use the HTML attribute instead, set `preventNativeDrag: false` on the PointerSensor and add `draggable="false"` to the image and link elements that use it.

## Dragging clickable elements

When dragging an anchor (`<a>`) element or any other element that is clickable (e.g. has a click handler), a click event would normally fire after the drag ends, triggering unintended navigation or actions.

DragDoll handles this automatically via the [`preventClickOnEnd`](/draggable#preventclickonend) setting, which is **enabled by default**. When a drag ends, the next click event on the sensor element is blocked using both `preventDefault()` and `stopPropagation()` in the capture phase.

**Key features:**

- **Event-driven cleanup**: The click blocker removes itself immediately after blocking a click, or when a new pointer interaction starts. No arbitrary timeouts.
- **Programmatic clicks allowed**: Only native browser-generated clicks (`e.isTrusted`) are blocked. Programmatic clicks (e.g., from testing frameworks) still work.
- **Works with start thresholds**: When using a [start threshold](/examples#draggable-start-threshold), clicking without exceeding the threshold works normally, while dragging blocks the subsequent click.

**Disabling click prevention:**

If you need clicks to fire after drag (rare), you can disable this behavior:

```ts
new Draggable([pointerSensor], {
  elements: () => [element],
  preventClickOnEnd: false,
});
```

## Text selection during dragging

DragDoll prevents text selection during drag by default via the [`preventTextSelection`](/draggable#preventtextselection) setting (enabled by default). When a drag starts, it clears any existing selection and listens to `selectionchange` during drag to clear any new selection. This works with iframes by using the dragged element's owner document.

**Disabling text selection prevention:**

```ts
new Draggable([pointerSensor], {
  elements: () => [element],
  preventTextSelection: false,
});
```

**Alternatives using CSS:**

You can use the CSS property [`user-select: none`](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select) on the draggable element to prevent selection visually. Note that CSS alone does not clear existing selection when a drag starts — it only prevents new selection. Apply it to the draggable element, or to `document.body` if you want to disable selection across the whole page.

**Alternative manual approach:**

If you disable `preventTextSelection` but still want to prevent selection for specific cases (e.g. only when using PointerSensor), you can use the [`start`](/draggable#start) and [`end`](/draggable#end) events:

```ts
import { PointerSensor } from 'dragdoll';

let pointerSensorDragCounter = 0;

draggable.on('start', (drag) => {
  if (drag.sensor instanceof PointerSensor) {
    if (++pointerSensorDragCounter === 1) {
      document.body.style.userSelect = 'none';
    }
  }
});
draggable.on('end', (drag) => {
  if (drag.sensor instanceof PointerSensor) {
    if (--pointerSensorDragCounter <= 0) {
      document.body.style.userSelect = '';
    }
  }
});
```

## Dragging on Touch Devices

When using [`Draggable`](/draggable) with [`PointerSensor`](/pointer-sensor), dragging starts immediately when the pointer sensor element is pressed — whether it's by mouse, pen, or touch. This is the default behavior, and it works well with a mouse.

However, on touch devices, the page’s native scroll behavior _will_ interfere with dragging, and you’ll need to manage this yourself. DragDoll does not handle this automatically because the strategy you choose may vary depending on your needs.

Below are some common strategies you can consider:

### 1. Start Drag Immediately

The simplest solution is to add `touch-action: none;` to the draggable element's CSS. This will disable all panning (including touch scrolling) and zoom gestures for that element.

**Downside**: The draggable element will block native scrolling on touch devices. If it's a large element, this can lead to a poor user experience.

This approach is used in most of our [examples](/examples) because it's easy to implement and understand. However, it’s not always the best for user experience, so you may want to experiment with other [`touch-action`](https://developer.mozilla.org/en-US/Web/CSS/touch-action) values to find a better compromise for your use case.

### 2. Use a Drag Handle

This is one of the most common patterns in mobile apps. You can add a smaller, explicit drag handle that activates the drag for the larger draggable element. This approach allows the main element to retain native scroll behavior, while the drag handle is used for dragging.

We provide an [example](/examples#draggable-drag-handle) to help you get started. Make sure to add `touch-action: none;` to the drag handle element’s CSS.

### 3. Long Press to Drag

This pattern is familiar from mobile apps, such as when rearranging icons on a home screen. While it's widely used, keep in mind that users may not always expect to long press to drag an item.

You can implement this pattern using the [`createTouchDelayPredicate`](/draggable-helpers#createtouchdelaypredicate) helper.

**Caution**: Preventing native scroll on touch devices _after_ the `touchstart` event is tricky and often unreliable, especially inside iframes. Be sure to test thoroughly across different devices and platforms if you choose this method.

### 4. Use an Edit Mode

A more controlled approach is to disable dragging by default and offer an "edit mode" that users can toggle on or off. When edit mode is activated, instantiate your `Draggable` instances. When it's off, destroy them. This approach avoids conflicts with native scrolling while making user interactions more predictable.
