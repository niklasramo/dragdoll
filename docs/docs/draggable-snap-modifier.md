[Draggable Modifiers](/docs/draggable-modifiers) →

# Snap Modifier

Makes a draggable element snap to the given grid cell dimensions. Assumes that the dragged element is already aligned with the grid when dragging starts.

## Example

```ts
import {
  Draggable,
  PointerSensor,
  KeyboardSensor,
  createPointerSensorStartPredicate,
  createSnapModifier,
} from 'draggable';

const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element, {
  moveDistance: { x: CELL_WIDTH, y: CELL_HEIGHT },
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  startPredicate: createPointerSensorStartPredicate(),
  positionModifiers: createSnapModifier(CELL_WIDTH, CELL_HEIGHT),
});
```

## Syntax

<!-- prettier-ignore -->
```ts
type createSnapModifier = (
  cellWidth: number,
  cellHeight: number
) => DraggableModifier;
```

## Parameters

1. **cellWidth**

   - The width of a grid cell.
   - Required.

2. **cellHeight**

   - The height of a grid cell.
   - Required.
