[Draggable Modifiers](/draggable-modifiers) →

# Containment Modifier

Contains a draggable element's movement within a rectangle.

## Example

```ts
import { Draggable, PointerSensor, KeyboardSensor, createContainmentModifier } from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  positionModifiers: createContainmentModifier(() => {
    // Contain within window's bounds.
    return {
      x: 0,
      y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }),
});
```

## Syntax

```ts
type createContainmentModifier = (
  getContainerRect: (data: DraggableModifierData) => {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  trackSensorDrift?: boolean | ((data: DraggableModifierData) => boolean),
) => DraggableModifier;
```

## Parameters

1. **getContainerRect**
   - A callback that is used to query the container's current bounding client rectangle. Receives `DraggableModifierData` object as it's only argument.
   - Required.

2. **trackSensorDrift**
   - A boolean or a callback that returns a boolean, which determines if the modifier should track and offset the drift between the sensor position and dragged element's position when the element collides to a container edge. You probably want to have this be `true` for any pointer-like sensors where the user can visually see the grab point and `false` for others, e.g. [`KeyboardSensor`](/keyboard-sensor).
   - By default this is a function which will return `true` if the current sensor is an instance of the [`PointerSensor`](/pointer-sensor) and `false` otherwise.
   - Optional.

## Returns

A modifier function that can be provided to the [`positionModifiers`](/draggable#positionmodifiers) option of the [`Draggable`](/draggable) constructor.
