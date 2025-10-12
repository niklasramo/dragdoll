# Tips and Tricks

## Server-Side Rendering (SSR)

DragDoll is designed to work only in a browser environment, but it can be _imported_ in a non-browser environment without throwing an error. Just make sure that you don't try to actually use it in a non-browser environment and you're good to go.

## Handling Natively Draggable Elements

Some elements, such as images and links, are natively draggable in the browser. This behavior might interfere with the custom dragging functionality you want to implement with DragDoll. To prevent this, you can use the [`draggable`](https://developer.mozilla.org/en-US/Web/HTML/Global_attributes/draggable) attribute and set `draggable="false"` on the elements where you want to disable native dragging.

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
