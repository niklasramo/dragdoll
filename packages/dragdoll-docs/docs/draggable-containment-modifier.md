[Draggable Modifiers](/draggable-modifiers) →

# Containment Modifier

Contains a draggable element's movement within a rectangle. Optionally snaps to a grid while ensuring the element never lands on a partial (clipped) grid cell at the container edges.

## Example

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { KeyboardSensor } from 'dragdoll/sensors/keyboard';
import { createContainmentModifier } from 'dragdoll/draggable/modifiers/containment';

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const keyboardSensor = new KeyboardSensor(element);
const draggable = new Draggable([pointerSensor, keyboardSensor], {
  elements: () => [element],
  positionModifiers: [
    createContainmentModifier(() => {
      // Contain within window's bounds.
      return {
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }),
  ],
});
```

### Grid-aware containment

When `snapX` and/or `snapY` are provided, the modifier combines snapping and containment into a single operation. The element will snap to the grid and be contained within the container, but will never snap to a grid cell that is partially outside the container. Instead, it clips to the nearest fully visible grid cell.

This is the recommended way to combine snapping with containment. You do **not** need to chain a separate [`createSnapModifier`](/draggable-snap-modifier) before the containment modifier — just provide the snap values directly.

```ts
import { Draggable } from 'dragdoll/draggable';
import { PointerSensor } from 'dragdoll/sensors/pointer';
import { createContainmentModifier } from 'dragdoll/draggable/modifiers/containment';

const GRID = 40;

const element = document.querySelector('.draggable') as HTMLElement;
const pointerSensor = new PointerSensor(element);
const draggable = new Draggable([pointerSensor], {
  elements: () => [element],
  positionModifiers: [
    createContainmentModifier(
      () => ({
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
      { snapX: GRID, snapY: GRID },
    ),
  ],
});
```

## Syntax

```ts
function createContainmentModifier<S extends Sensor>(
  getContainerRect: (data: DraggableModifierData<S>) => {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  options?: {
    trackSensorDrift?: boolean | ((data: DraggableModifierData<S>) => boolean);
    snapX?: number;
    snapY?: number;
  },
): DraggableModifier<S>;
```

## Type variables

1. **S** - A union type representing the sensor types that the modifier will use.

## Parameters

1. **getContainerRect**
   - A callback that is used to query the container's current bounding client rectangle. Receives `DraggableModifierData` object as its only argument.
   - Required.

2. **options**
   - An optional configuration object.

   - **options.trackSensorDrift**
     - A boolean or a callback that returns a boolean, which determines if the modifier should track and offset the drift between the sensor position and dragged element's position when the element collides with a container edge. You probably want to have this be `true` for any pointer-like sensors where the user can visually see the grab point and `false` for others, e.g. [`KeyboardSensor`](/keyboard-sensor). Only applies when `snapX`/`snapY` are not set for the respective axis, since snapping inherently handles sensor drift via its threshold mechanism.
     - Default: A function that will return `true` if the current sensor is an instance of the [`PointerSensor`](/pointer-sensor) and `false` otherwise.

   - **options.snapX**
     - The grid cell width to snap to on the X axis. When provided, the element will only move in increments of this value and will be clamped to grid-aligned positions that keep the element fully within the container.
     - Optional.

   - **options.snapY**
     - The grid cell height to snap to on the Y axis. When provided, the element will only move in increments of this value and will be clamped to grid-aligned positions that keep the element fully within the container.
     - Optional.

## Returns

A [modifier](/draggable#draggablemodifier) function that can be provided to the [`positionModifiers`](/draggable#positionmodifiers) option of the [`Draggable`](/draggable) constructor.
