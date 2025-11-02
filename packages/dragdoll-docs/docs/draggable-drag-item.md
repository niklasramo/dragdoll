[DraggableDrag](/draggable-drag) →

# DraggableDragItem

DraggableDragItem class instance holds all the information about a drag item. All the drag items are available via the [`items`](/draggable-drag#items) property of the DraggableDrag instance.

## Class

```ts
export class DraggableDragItem<S extends Sensor[] = Sensor[]> {
  constructor(element: HTMLElement | SVGSVGElement, draggable: Draggable<S>) {}
}
```

The DraggableDragItem class is a generic that accepts the following type variables:

1. **S** - The types of the sensors that the DraggableDragItem will use as inputs for moving the provided elements around.

The constructor accepts the following arguments:

1. **element**
   - The element that is being dragged.
2. **draggable**
   - The Draggable instance that is tracking this drag item.

## Properties

### data

```ts
type data = { [key: string]: any };
```

A key value object of custom data, which can be used to store any additional information needed to perform custom logic during the drag. You can utilize this store in your custom plugins and modifiers for example.

When drag ends this data (and the whole `DraggableDragItem` instance) is discarded, so you don't have to worry about cleaning up the data.

### element

```ts
type element = HTMLElement | SVGSVGElement;
```

The dragged element. Read-only.

### elementContainer

```ts
type elementContainer = HTMLElement;
```

The dragged element's original parent node before the drag starts. Read-only.

### elementOffsetContainer

```ts
type elementOffsetContainer = HTMLElement | SVGSVGElement | Window | Document;
```

The dragged element's original offset container. Read-only.

### dragContainer

```ts
type dragContainer = HTMLElement;
```

The dragged element's parent node during the drag. Read-only.

### dragOffsetContainer

```ts
type dragOffsetContainer = HTMLElement | SVGSVGElement | Window | Document;
```

The dragged element's offset container during the drag. Read-only.

### elementTransformMatrix

```ts
type elementMatrix = DOMMatrix;
```

The dragged element's original computed transform and all the [individual transforms](https://drafts.csswg.org/css-transforms-2/#individual-transforms) (translate, rotate and scale) combined into one matrix. Read-only.

### elementOffsetMatrix

```ts
type elementOffsetMatrix = DOMMatrix;
```

The dragged element's original computed [individual transforms](https://drafts.csswg.org/css-transforms-2/#individual-transforms) (translate, rotate and scale) combined into one matrix and inversed. This is needed for offsetting the individual transforms when computing the element's transform during drag. Read-only.

### elementTransformOrigin

```ts
type elementTransformOrigin = { x: number; y: number; z: number };
```

The dragged element's original computed [transform origin](https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin). Read-only.

### frozenStyles

```ts
type frozenStyles = CSSProperties | null;
```

A key value object of the frozen CSS properties and their frozen values. These are the values that are forced on the dragged element for the duration of the drag. Read-only.

### unfrozenStyles

```ts
type unfrozenStyles = CSSProperties | null;
```

A key value object of the frozen CSS properties and their unfrozen (original) values. These are the values that are restored to the dragged element after the drag ends. Read-only.

### clientRect

```ts
type clientRect = { x: number; y: number; width: number; height: number };
```

Cached bounding client rect of the dragged element. The `width` and `height` of this object can be updated using the [`updateSize`](#updatesize) method. The `x` and `y` are automatically updated whenever [position](#position) changes. Read-only.

### position

```ts
type position = { x: number; y: number };
```

The dragged element's relative viewport position. This is always `{x: 0, y: 0}` on drag start and, by default, only updated when the sensor moves. [Modifiers](/draggable-modifiers) might affect this value during start, move and end phases.

In practice this value will tell you how many (untransformed) pixels the element has moved in the viewport's scope and to which directions. E.g. `{x: -100, y: 50}` would mean that the element has moved 100 pixels to the left and 50 pixels down from the original position.

Read-only.

### containerOffset

```ts
type containerOffset = { x: number; y: number };
```

The offset between [`elementOffsetContainer`](#elementoffsetcontainer) and [`dragOffsetContainer`](#dragoffsetcontainer). The offset value is computed so that transforms are fully ignored. This offset is used to correct the element's position when/if it is reparented to the [`dragContainer`](#dragcontainer). Read-only.

### alignmentOffset

```ts
type alignmentOffset = { x: number; y: number };
```

Keeps track of any _unintended_ drift between the dragged element's position and the sensor's position. For example, this is used to correct the element's position when the element's parent is scrolled or when [`align`](/draggable#align) method is used. Read-only.

## Methods

### getContainerMatrix

```ts
type getContainerMatrix = () => [DOMMatrix, DOMMatrix];
```

Returns the world transform matrix of the [`elementContainer`](#elementcontainer), which is computed and cached at the start of the drag. The first matrix in the returned array is the world transform matrix and the second matrix is the inverse of the world transform matrix.

### getDragContainerMatrix

```ts
type getDragContainerMatrix = () => [DOMMatrix, DOMMatrix];
```

Returns the world transform matrix of the [`dragContainer`](#dragcontainer), which is computed and cached at the start of the drag. The first matrix in the returned array is the world transform matrix and the second matrix is the inverse of the world transform matrix.

### updateSize

```ts
type updateSize = (dimensions?: { width: number; height: number }) => void;
```

Update the item's size. This method is useful when the item's size changes during the drag process. If the dimensions argument is not provided, the method will compute the new size based on the element's bounding client rect. Otherwise, the method will update the item's size to the provided dimensions.

**Example**

```ts
// Compute and update the item's size.
dragItem.updateSize();

// Update the item's size to specific dimensions.
dragItem.updateSize({ width: 100, height: 100 });
```
