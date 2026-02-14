[Draggable Modifiers](/draggable-modifiers) →

# Start Offset Modifier

Offsets the dragged element's position on drag start to compensate for any cursor/pointer movement that occurred before the drag was initiated. This is useful when using a deferred [`startPredicate`](/draggable#startpredicate) (e.g. a distance threshold or touch delay), where the sensor moves before the drag begins.

## Example

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { startOffsetModifier } from 'dragdoll';

const THRESHOLD = 5;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const draggable = new Draggable([pointerSensor], {
  elements: () => [element],
  startPredicate: ({ event }) => {
    const dx = event.x - event.startX;
    const dy = event.y - event.startY;
    return Math.sqrt(dx * dx + dy * dy) >= THRESHOLD ? true : undefined;
  },
  positionModifiers: [startOffsetModifier],
});
```

## Syntax

```ts
const startOffsetModifier: DraggableModifier<BaseSensor>;
```

## Returns

A [modifier](/draggable#draggablemodifier) function that can be provided to the [`positionModifiers`](/draggable#positionmodifiers) option of the [`Draggable`](/draggable) constructor. Compatible with all sensor types that extend [`BaseSensor`](/base-sensor).
