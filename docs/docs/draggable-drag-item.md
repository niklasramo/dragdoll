[DraggableDrag](/docs/draggable-drag) →

# DraggableDragItem

DraggableDragItem class instance holds all the information about a drag item. All the drag items are available via the [`items`](/docs/draggable-drag#items) property of the DraggableDrag instance.

## Properties

All the properties are read-only.

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

### dragInnerContainer

```ts
type dragInnerContainer = HTMLElement | null;
```

If [`elementContainer`](#elementcontainer) is not the same element as [`dragContainer`](#dragcontainer) we need to create a wrapper element dynamically for the dragged element. This is that wrapper element and it is appended to the [`dragContainer`](#dragcontainer). Read-only.

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

### frozenProps

```ts
type frozenProps = CSSProperties | null;
```

A key value object of the frozen CSS properties and their frozen values. These are the values that are forced on the dragged element for the duration of the drag. Read-only.

### unfrozenProps

```ts
type unfrozenProps = CSSProperties | null;
```

A key value object of the frozen CSS properties and their unfrozen (original) values. These are the values that are restored to the dragged element after the drag ends. Read-only.

### clientRect

```ts
type clientRect = { width: number; height: number; left: number; top: number };
```

Cached bounding client rect of the dragged element. The `width` and `height` of this object can be updated using the [`updateSize`](#updatesize) method. The `left` and `top` are automatically updated by the Draggable instance, but you can also forcefully update them using the [`draggable.updatePosition`](/docs/draggable#updateposition) method. Read-only.

### position

```ts
type position = { x: number; y: number };
```

The dragged element's internal position during the drag. By default this reflects the element's translate position. Read-only.

### containerOffset

```ts
type containerOffset = { x: number; y: number };
```

The offset between [`elementOffsetContainer`](#elementoffsetcontainer) and [`dragOffsetContainer`](#dragoffsetcontainer). The offset value is computed so that transforms are fully ignored. Read-only.

### moveDiff

```ts
type moveDiff = { x: number; y: number };
```

Used internally to keep track of the difference between the current and the previous move event when updating the [`position`](#position) property asynchronously. Read-only.

### alignDiff

```ts
type alignDiff = { x: number; y: number };
```

Used internally to keep track of the computed align offset when aligning the dragged element asynchronously to the correct client position. Read-only.

## Methods

### getContainerMatrix

```ts
type getContainerMatrix = () => [DOMMatrix, DOMMatrix];
```

Returns the computed world transform matrix of the [`elementContainer`](#elementoffsetcontainer). The first matrix in the returned array is the world transform matrix and the second matrix is the inverse of the world transform matrix. Note that the returned matrices are cached, please use the [`updateContainerMatrices`](#updatecontainermatrices) method to update the matrices if you need to.

### getDragContainerMatrix

```ts
type getDragContainerMatrix = () => [DOMMatrix, DOMMatrix];
```

Returns the computed world transform matrix of the [`dragContainer`](#dragcontainer). The first matrix in the returned array is the world transform matrix and the second matrix is the inverse of the world transform matrix. Note that the returned matrices are cached, please use the [`updateContainerMatrices`](#updatecontainermatrices) method to update the matrices if you need to.

### updateContainerMatrices

```ts
type updateContainerMatrices = (force?: boolean) => void;
```

Computes and caches the world transform matrices of the [`elementContainer`](#elementcontainer) and the [`dragContainer`](#dragcontainer). By default this method will not update the matrices if the matrices are considered valid. However, you can set the `force` argument to true to forcefully update the matrices.

### updateContainerOffset

```ts
type updateContainerOffset = (force?: boolean) => void;
```

Computes the offset between [`elementOffsetContainer`](#elementoffsetcontainer) and [`dragOffsetContainer`](#dragoffsetcontainer). By default this method will use the cached client offset values for both elements. However, you can set the `force` argument to true to forcefully recalculate the offset.

### applyContainerOffset

```ts
type applyContainerOffset = () => void;
```

Applies the computed container offset and container world matrices to [`dragInnerContainer`](#draginnercontainer). You should not need to call this method manually, as it is called automatically by the Draggable instance.

### updateSize

```ts
type updateSize = (dimensions?: { width: number; height: number }) => void;

// Usage: Compute and update the item's size
dragItem.updateSize();

// Usage: Update the item's size to specific dimensions
dragItem.updateSize({ width: 100, height: 100 });
```

Update the item's size. This method is useful when the item's size changes during the drag process. If the dimensions argument is not provided, the method will compute the new size based on the element's bounding client rect. Otherwise, the method will update the item's size to the provided dimensions.
