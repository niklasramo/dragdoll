[Draggable Modifiers](/draggable-modifiers) →

# Snap Modifier

Makes a draggable element snap to the given grid cell dimensions. Assumes that the dragged element is already aligned with the grid when dragging starts.

## Example

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createSnapModifier } from 'dragdoll/draggable/modifiers/snap';

const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element, {
  moveDistance: { x: CELL_WIDTH, y: CELL_HEIGHT },
});
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  positionModifiers: [createSnapModifier(CELL_WIDTH, CELL_HEIGHT)],
});
```

## Syntax

```ts
function createSnapModifier<S extends Sensor>(
  cellWidth: number,
  cellHeight: number,
): DraggableModifier<S>;
```

## Type variables

1. **S** - A union type representing the sensor types that the modifier will use.

## Parameters

1. **cellWidth**
   - The width of a grid cell.
   - Required.

2. **cellHeight**
   - The height of a grid cell.
   - Required.

## Returns

A [modifier](/draggable#draggablemodifier) function that can be provided to the [`positionModifiers`](/draggable#positionmodifiers) option of the [`Draggable`](/draggable) constructor.
