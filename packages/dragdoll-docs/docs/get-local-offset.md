# getLocalOffset

A utility function that computes the CSS offset delta needed to position an element at specific viewport coordinates, accounting for arbitrary ancestor transforms (scale, rotation, skew).

## Usage

```ts
import { getLocalOffset } from 'dragdoll';

const element = document.querySelector('.draggable') as HTMLElement;

// Where the element should end up (viewport coordinates).
const targetX = 200;
const targetY = 300;

// Compute how much to adjust the element's CSS offset.
const delta = getLocalOffset(element, targetX, targetY);

// Apply the delta (e.g. to the translate CSS property).
element.style.translate = `${delta.x}px ${delta.y}px`;
```

## Signature

```ts
function getLocalOffset(
  element: HTMLElement,
  targetX: number,
  targetY: number,
  result?: { x: number; y: number },
): { x: number; y: number };
```

## Parameters

### element

The element to position. The function measures the element's current viewport position and computes the delta relative to its parent's coordinate system.

### targetX

The desired viewport x coordinate (`getBoundingClientRect().left`) for the element.

### targetY

The desired viewport y coordinate (`getBoundingClientRect().top`) for the element.

### result

An optional object to write the result into. If provided, the object's `x` and `y` properties are updated in place and the same object is returned. This avoids allocating a new object on every call, which is useful in performance-sensitive code paths.

- Optional.
- Default is `{ x: 0, y: 0 }` (a new object).

## Return Value

An object `{ x, y }` representing the delta to add to the element's current CSS offset (`left`/`top`, `translate`, or `transform: translate()`). After applying this delta, the element's `getBoundingClientRect().left` will equal `targetX` and `.top` will equal `targetY`.

## How It Works

When an element has ancestor transforms (e.g. a parent with `scale(0.5) rotate(45deg)`), a 1px change in the element's CSS `left` or `translate` does **not** produce a 1px change in viewport position. The relationship between CSS offsets and viewport position is defined by the parent's world transform matrix.

`getLocalOffset` extracts the 2x2 linear subpart of the parent's world transform matrix (the Jacobian), inverts it, and multiplies the viewport delta to produce the correct CSS offset delta. This analytical approach requires only 1 forced reflow (for `getBoundingClientRect`) compared to the 3 reflows a probing approach would need.

If the parent's transform matrix is degenerate (e.g. `scale(0)`), the function falls back to a simple viewport delta.

## Common Use Cases

### Drag preview element alignment

After dragging a drag preview element (clone), transfer its final viewport position back to the original element. The original may have transformed ancestors, so a simple viewport delta would be incorrect.

```ts
// In onEnd callback:
const offset = getLocalOffset(originalElement, previewRect.x, previewRect.y);
const parts = (getComputedStyle(originalElement).translate || '').split(' ');
const x = (parseFloat(parts[0]) || 0) + offset.x;
const y = (parseFloat(parts[1]) || 0) + offset.y;
originalElement.style.translate = `${x}px ${y}px`;
```

See the [Drag Preview example](/examples#draggable-drag-preview) for a complete implementation.

### Container reparenting with animation

After reparenting an element to a new container on drag end, compute the offset to hold the element at its drag-end viewport position, then animate it to its natural position.

```ts
// Record viewport position, clear drag transform, reparent.
const rect = element.getBoundingClientRect();
element.style.transform = '';
targetContainer.appendChild(element);

// Compute offset to maintain viewport position.
const delta = getLocalOffset(element, rect.x, rect.y);

// Animate from drag-end position to natural position.
element.style.transform = `translate(${delta.x}px, ${delta.y}px)`;
element.clientHeight; // Force reflow to commit starting transform.
element.classList.add('animate');
element.style.transform = 'matrix(1, 0, 0, 1, 0, 0)';
```

See the [Advanced Collision Detector example](/examples#dndobserver-advanced-collision-detector) for a complete implementation.

### React drag preview end positioning

After a drag preview ends, transfer the final position back to the original elements using `getLocalOffset`.

```ts
onEnd: (drag) => {
  const el = elementRef.current;
  const item = drag.items[0];
  if (!el || !item) return;
  const offset = getLocalOffset(el, item.clientRect.x, item.clientRect.y);
  const parts = (getComputedStyle(el).translate || '').split(' ');
  const x = (parseFloat(parts[0]) || 0) + offset.x;
  const y = (parseFloat(parts[1]) || 0) + offset.y;
  el.style.translate = `${x}px ${y}px`;
},
```

See the [React Drag Preview examples](/react/examples#dragpreview-scrollable-transforms) for complete implementations.

## Exports

```ts
import { getLocalOffset } from 'dragdoll';
```
