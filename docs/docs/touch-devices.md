# Dragging on touch devices

When using the [`PointerSensor`](/docs/pointer-sensor) with the [`Draggable`](/docs/draggable) instance dragging will start immediately by default after the user touches/clicks the pointer sensor element. It doesn't matter if it's with a mouse, pen or touch. This is the default behavior and it's fine for desktop applications.

However, on touch devices, the page's native scroll behavior _will_ interfere with the dragging. And you need to deal with it one way or another. DragDoll does not deal with it automatically because it doesn't know what strategy you want to use.

Here are a few common strategies you can use:

## 1. Start drag immediately

This is the easiest way to go about code-wise. All you need to do is add `touch-action: none;` to the draggable element's CSS, which disables browser handling of all panning (includes touch scroll) and zooming gestures for this element.

The downside is that the page will not scroll at all when the user touches the draggable element. So if it's a really big element it might be very bad experience for the end user.

Most of our [examples](/docs/examples) use this strategy because it's the simplest to implement and understand. But it's not always the best strategy for the end user.

## 2. Use a drag handle

This is probably one of the most common patterns in mobile applications. Add an explicit drag handle element that can activate the drag for the actual draggable element. The drag handle can be much smaller than the draggable element itself so it doesn't interfere with the page's native scroll.

We have [example](/docs/examples#draggable-drag-handle) of this you can use to get started. Also, remember to add `touch-action: none;` to the drag handle element's CSS.

## 3. Long press to drag

This pattern is probably familiar to everyone who have rearranged icons on their phone's home screen. It's a common pattern in mobile applications. However, it still might not be always obvious to the user that they need to long press to drag an item. You can use the [`createTouchDelayPredicate`](/docs/draggable-helpers#createtouchdelaypredicate) helper to implement this.

Be warned though that this is technically challenging to get right across devices/platforms. Preventing native scroll on touch devices _after_ touchstart event is finicky. It doesn't always work reliably. And it gets especially tricky within iframes. Use with caution and test thoroughly.

## 4. Use edit mode

You can always NOT have dragging available by default and instead have an edit mode that the user can toggle on/off. Instantiate the `Draggable` instances when the edit mode is activated and destroy them when it's off. This is a simple way to manage user expectations and avoid conflicts with the page's native scroll.
