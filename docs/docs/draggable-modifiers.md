[Draggable](/docs/draggable) →

# Draggable Modifiers

Modifiers are a powerful feature of Draggable that allow you to fully control the placement of the draggable element during every step of the drag process.

A modifier function takes the current position change data, transforms it as needed and then returns the updated position change data. You can chain multiple modifiers and split the logic into multiple reusable modifiers.

The first modifier in the chain will receive the "default" change data. For "move" event this is the diff between client x and y coordinates of [`moveEvent`](/docs/draggable-drag#moveevent) and [`prevMoveEvent`](/docs/draggable-drag#prevmoveevent). The final result, after the change data is processed through all the modifiers, is applied to the element via [`applyPosition`](/docs/draggable#applyposition) function.

The modifiers should be provided to the [`positionModifiers`](/docs/draggable#positionmodifiers) option. All the provided modifiers will be called for every draggable item on every "start", "move" and "end" event. The modifier function receives the phase of the drag operation as an argument, which can be used to apply different logic based on the current phase.

You can store temporary state data, which exists only for the duration of the drag operation, within the draggable item's [`data`](/docs/draggable-drag-item#data) object. This data is automatically discarded (along with the whole [`DraggableDragItem`](/docs/draggable-drag-item) instance) when drag ends. Just remember to store the state under a unique key so that it doesn't clash with other systems/plugins utilizing the data object also.

## Example

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
  startPredicate: createPointerSensorStartPredicate(),
  positionModifiers: [
    // First modifier, which resets the
    // x-axis change to allow only y-axis
    // change.
    (change) => {
      change.x = 0;
      return change;
    },
    // Second modifier, which inverts
    // y-axis change.
    (change) => {
      change.y *= -1;
      return change;
    },
  ],
});
```

## Syntax

```ts
type DraggableModifier = (
  change: { x: number; y: number },
  data: {
    draggable: Draggable;
    drag: DraggableDrag;
    item: DraggableDragItem;
    phase: 'start' | 'move' | 'end';
  },
) => { x: number; y: number };
```

## Parameters

1. **change**

   - The current change data object with `x` and `y` properties representing the change in x and y coordinates.

2. **data**

   - An object containing the following properties:
     - **draggable**: The [`Draggable`](/docs/draggable) instance.
     - **drag**: The [`DraggableDrag`](/docs/draggable-drag) instance.
     - **item**: The [`DraggableDragItem`](/docs/draggable-drag-item) instance.
     - **phase**: The phase of the drag operation. Can be `'start'`, `'move'` or `'end'`.

## Returns

Returns the updated change data object with `x` and `y` properties representing the updated change in x and y coordinates. By default the `change` object is a reusable object which's value is reset after the modifier chain has been processed. So it's okay to mutate the object directly, but not store it for later use.
