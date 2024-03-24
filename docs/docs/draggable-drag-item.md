[DraggableDrag](/docs/draggable-drag) →

# DraggableDragItem

DraggableDragItem class instance holds all the information about a drag item. All the drag items are available via the [`items`](/docs/draggable-drag#items) property of the DraggableDrag instance.

## Properties

All the properties are read-only.

### element

```ts
type element = HTMLElement | SVGSVGElement;
```

The drag element. Read-only.

### elementContainer

```ts
type elementContainer = HTMLElement;
```

Element's original parent node before the drag starts. Read-only.

### elementOffsetContainer

```ts
type elementOffsetContainer = HTMLElement | SVGSVGElement | Window | Document;
```

Element's offset container. Read-only.

### dragContainer

```ts
type dragContainer = HTMLElement;
```

Element's parent node during the drag. Read-only.

### dragOffsetContainer

```ts
type dragOffsetContainer = HTMLElement | SVGSVGElement | Window | Document;
```

Element's offset container. Read-only.

### initialTransform

```ts
type initialTransform = string;
```

Element's original computed transform value. Read-only.

### frozenProps

```ts
type frozenProps = CSSProperties | null;
```

A key value object of the frozen CSS properties and their frozen values. These are the values that are forced on the element for the duration of the drag. Read-only.

### unfrozenProps

```ts
type unfrozenProps = CSSProperties | null;
```

A key value object of the frozen CSS properties and their unfrozen (original) values. These are the values that are restored to the element after the drag ends. Read-only.

### clientRect

```ts
type clientRect = { width: number; height: number; left: number; top: number };
```

Cached bounding client rect of the element. The `width` and `height` of this object can be updated using the [`updateSize`](#updatesize) method. The `left` and `top` are automatically updated by the Draggable instance, but you can also forcefully update them using the [`draggable.updatePosition`](/docs/draggable#updateposition) method. Read-only.

### position

```ts
type position = { x: number; y: number };
```

Element's internal position during the drag. By default this reflects the element's translate position. Read-only.

## Methods

### updateSize

```ts
// Type
type updateSize = (dimensions?: { width: number; height: number }) => void;

// Usage: Compute and update the item's size
draggable.drag.items[0].updateSize();

// Usage: Update the item's size to specific dimensions
draggable.drag.items[0].updateSize({ width: 100, height: 100 });
```

Update the item's size. This method is useful when the item's size changes during the drag process. If the dimensions argument is not provided, the method will compute the new size based on the element's bounding client rect. Otherwise, the method will update the item's size to the provided dimensions.
