[Draggable](/docs/draggable) →

# Draggable Helpers

A collection of official helper functions for creating custom draggable logic.

## `createPointerSensorStartPredicate`

A smart start predicate creator for [`Draggable`](/docs/draggable) when using [`PointerSensor`](/docs/pointer-sensor).

For `mouse` and `pen` events the predicate is resolved immediately. For `touch` events the predicate has special logic to start the drag after a long press, which's duration can be adjusted with `touchDelay` parameter. If scrolling is detected before the long press finishes, the drag will not start.

### Example

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
} from 'draggable';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  startPredicate: createPointerSensorStartPredicate({
    // The amount of time in milliseconds to wait before trying to start
    // dragging after the user has touched the pointer sensor element.
    touchDelay: 200,
    fallback: (data) => {
      // Here you can decide what to do with the other sensors' events.
      // For example, if you are using the keyboard sensor and pointer sensor
      // together and user uses both the keyboard and the pointer at the same
      // time, you can decide the logic for keyboard events here (when should
      // the dragging start).
      console.log(data);
      return true;
    },
  }),
});
```

### Syntax

```ts
type DraggableStartPredicate = (data: {
  draggable: Draggable;
  sensor: Sensor;
  event: SensorStartEvent | SensorMoveEvent;
}) => boolean | undefined;

type createPointerSensorStartPredicate = (
  touchDelay?: number,
  fallback?: DraggableStartPredicate,
) => DraggableStartPredicate;
```

### Parameters

1. **touchDelay**

   - The amount of time in milliseconds to wait before trying to start dragging after the user has touched the pointer sensor element (applies for touch events only). The point of this delay is to allow users to scroll normally if they don't intend to drag and start dragging only after long press, which is a common pattern in mobile applications.
   - Default: `250`.
   - Optional.

2. **fallback**

   - Fallback start predicate function that will be called for other sensors' events (e.g. keyboard sensor) if there are any.
   - Default: `() => true`.
   - Optional.

### Returns

A start predicate function that can be provided to the [`startPredicate`](/docs/draggable#startpredicate) option of the [`Draggable`](/docs/draggable) constructor.
