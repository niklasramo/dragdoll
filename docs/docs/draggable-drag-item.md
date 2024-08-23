[DraggableDrag](/docs/draggable-drag) →

# DraggableDragItem

DraggableDragItem class instance holds all the information about a drag item. All the drag items are available via the [`items`](/docs/draggable-drag#items) property of the DraggableDrag instance.

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

### elementMatrix

```ts
type elementMatrix = DOMMatrix;
```

The dragged element's original computed transform matrix. Read-only.

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
type clientRect = { width: number; height: number; left: number; top: number };
```

Cached bounding client rect of the dragged element. The `width` and `height` of this object can be updated using the [`updateSize`](#updatesize) method. The `left` and `top` are automatically updated whenever [position](#position) changes. Read-only.

### position

```ts
type position = { x: number; y: number };
```

The dragged element's relative viewport position. This is always `{x: 0, y: 0}` on drag start and, by default, only updated when the sensor moves. [Modifiers](/docs/draggable-modifiers) might affect this value during start, move and end phases.

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

Keeps track of any _unintended_ drift between the dragged element's position and the sensor's position. For example, this is used to correct the element's position when the element's parent is scrolled or when [`align`](/docs/draggable#align) method is used. Read-only.

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

// Usage: Compute and update the item's size
dragItem.updateSize();

// Usage: Update the item's size to specific dimensions
dragItem.updateSize({ width: 100, height: 100 });
```

Update the item's size. This method is useful when the item's size changes during the drag process. If the dimensions argument is not provided, the method will compute the new size based on the element's bounding client rect. Otherwise, the method will update the item's size to the provided dimensions.
