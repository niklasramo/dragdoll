# Drag Patterns

The [`elements`](/draggable#elements) callback determines **what moves** during the drag. There are three patterns. On top of any pattern you can layer the [`container`](/draggable#container) option (to escape overflow/stacking boundaries) and return multiple elements (to move several items in lockstep).

## Pattern 1: Direct Drag

Return the element itself. It moves in its current parent via CSS `transform`.

```ts
new Draggable([pointerSensor], {
  elements: () => [element],
});
```

**How it works:** The [`Draggable`](/draggable) tracks sensor movement and applies a CSS `transform` to the element on each frame. No reparenting, no cloning. The element stays in its original DOM position.

**When to use:** Most drag scenarios. The simplest pattern with zero overhead.

**Examples:** [Basic](/examples#draggable-basic), [Auto Scroll](/examples#draggable-auto-scroll-transforms), [Locked Axis](/examples#draggable-locked-axis), [Snap To Grid](/examples#draggable-snap-to-grid), [Containment](/examples#draggable-containment), [Combined Modifiers](/examples#draggable-combined-modifiers), [Center To Pointer](/examples#draggable-center-to-pointer), [Drag Handle](/examples#draggable-drag-handle).

## Pattern 2: Drag Preview

Create a clone in the `elements` callback and return the clone. The original stays in the DOM untouched while the clone moves as the drag preview.

```ts
new Draggable([pointerSensor], {
  elements: () => {
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.pointerEvents = 'none';
    clone.style.contain = 'layout';

    // No alignment needed if already absolutely or fixed positioned.
    const clonePos = getComputedStyle(clone).position;
    if (clonePos === 'absolute' || clonePos === 'fixed') {
      element.parentElement!.appendChild(clone);
      return [clone];
    }

    // Position the clone at the top left of the parent element.
    clone.style.position = 'absolute';
    clone.style.left = '0px';
    clone.style.top = '0px';
    clone.style.margin = '0';
    element.parentElement!.appendChild(clone);

    // Compute and apply the offset to align the clone with the original.
    const elementRect = element.getBoundingClientRect();
    const cloneOffset = getLocalOffset(clone, elementRect.x, elementRect.y);
    clone.style.left = `${cloneOffset.x}px`;
    clone.style.top = `${cloneOffset.y}px`;

    return [clone];
  },
  onEnd: (drag) => {
    const dragItem = drag.items[0];
    // Align the original to the preview's final viewport position,
    // accumulating any existing translate from previous drags.
    const offset = getLocalOffset(element, dragItem.clientRect.x, dragItem.clientRect.y);
    const parts = (getComputedStyle(element).translate || '').split(' ');
    const x = (parseFloat(parts[0]) || 0) + offset.x;
    const y = (parseFloat(parts[1]) || 0) + offset.y;
    element.style.translate = `${x}px ${y}px`;
    // Remove the preview.
    dragItem.element.remove();
  },
});
```

**How it works:** The `elements` callback runs once at drag start. You create any element you want — a `cloneNode`, a simplified placeholder, a custom preview — position it to overlap the original within the same parent, and return it. The [`Draggable`](/draggable) moves the returned clone, not the original.

**When to use:** When you want the original to remain visible during drag (e.g. dimmed). When you need a different visual during drag (e.g. a simplified or styled preview).

**End alignment:** Use [`getLocalOffset`](/get-local-offset) to transfer the clone's final viewport position back to the original element, correctly handling ancestor transforms.

**Example:** [Drag Preview](/examples#draggable-drag-preview).

## Pattern 3: Placeholder Preview

Create a clone in the `elements` callback but return the original. The clone stays behind as a stationary placeholder while the original moves.

```ts
let placeholder: HTMLElement | null = null;

new Draggable([pointerSensor], {
  elements: () => {
    placeholder = element.cloneNode(true) as HTMLElement;
    placeholder.style.opacity = '0.3';
    placeholder.style.pointerEvents = 'none';
    placeholder.style.contain = 'layout';

    // No alignment needed if already absolutely or fixed positioned.
    const placeholderPos = getComputedStyle(placeholder).position;
    if (placeholderPos === 'absolute' || placeholderPos === 'fixed') {
      element.parentElement!.appendChild(placeholder);
      return [element];
    }

    // Position the placeholder at the top left of the parent element.
    placeholder.style.position = 'absolute';
    placeholder.style.left = '0px';
    placeholder.style.top = '0px';
    placeholder.style.margin = '0';
    element.parentElement!.appendChild(placeholder);

    // Compute and apply the offset to align the placeholder with the original.
    const elementRect = element.getBoundingClientRect();
    const placeholderOffset = getLocalOffset(placeholder, elementRect.x, elementRect.y);
    placeholder.style.left = `${placeholderOffset.x}px`;
    placeholder.style.top = `${placeholderOffset.y}px`;

    return [element];
  },
  onEnd: () => {
    placeholder?.remove();
    placeholder = null;
  },
});
```

**How it works:** In the `elements` callback, a clone is inserted into the same parent as the original — absolutely positioned to overlap it. The original is returned from `elements`, so the [`Draggable`](/draggable) moves the original. The clone just sits there, giving the user a visual reference of where the element came from.

**When to use:** When you want the actual element to move (preserving its identity, event listeners, state, etc.) but still show a ghost at its origin. Useful for sortable lists where you want to show the "gap" where the item was.

## Escaping Overflow with `container`

Any pattern can be combined with the [`container`](/draggable#container) option to break the moved element out of `overflow: hidden`, scroll containers, or stacking context boundaries. Just add `container` to your existing setup:

```ts
new Draggable([pointerSensor], {
  elements: () => [element],
  container: () => document.body,
  frozenStyles: () => ['width', 'height'],
});
```

**How it works:** At drag start, the [`Draggable`](/draggable) reparents the moved element from its current parent into the `container`. It computes world transform matrices for both containers so the element maintains its exact viewport position and visual shape — even when the original parent has complex CSS transforms (scale, rotation, skew). When the drag ends, the element is moved back to its original parent and realigned.

**`frozenStyles`:** When using `container`, the element may have CSS values relative to its parent (e.g. `width: 50%`). The [`frozenStyles`](/draggable#frozenstyles) setting captures computed values at drag start and applies them as inline styles, preventing layout shifts when the element moves to a different parent.

**Examples:** [Advanced Collision Detector](/examples#dndobserver-advanced-collision-detector), [Drag Preview](/examples#draggable-drag-preview), [Multi-Item Drag Preview](/examples#draggable-multi-item-drag-preview).

## Multiple Elements

All three patterns work with multiple elements. Return multiple elements from the `elements` callback and they all move together following the same sensor input.

```ts
new Draggable([pointerSensor], {
  elements: () => [elementA, elementB, elementC],
});
```

Each returned element gets its own [`DraggableDragItem`](/draggable-drag-item) with independent transforms, matrix caches, and position tracking. They all receive the same position delta from the sensor, so they move in lockstep. This works with any combination of `container`, clones, and placeholders — the [`Draggable`](/draggable) handles each element's coordinate space independently.

**Examples:** [Multiple Elements](/examples#draggable-multiple-elements), [Multi-Item Drag Preview](/examples#draggable-multi-item-drag-preview).

## Choosing a Pattern

| Pattern                | Original moves | Original stays visible | Needs end alignment |
| ---------------------- | :------------: | :--------------------: | :-----------------: |
| 1. Direct Drag         |      Yes       |           —            |         No          |
| 2. Drag Preview        |       No       |          Yes           |         Yes         |
| 3. Placeholder Preview |      Yes       |     Yes (as ghost)     |         No          |

Any pattern can add `container` to escape overflow (which adds end alignment for patterns 1 and 3). Any pattern can return multiple elements.

**Start with Pattern 1 (Direct Drag).** It's the simplest and has zero overhead. Only reach for the other patterns when you need a visible placeholder or a custom preview.

## End Alignment with `getLocalOffset`

Pattern 2 always needs end alignment. Patterns 1 and 3 need it when using `container`. If the element has transformed ancestors (scale, rotation, skew), a simple `getBoundingClientRect()` delta won't produce the correct CSS offset.

[`getLocalOffset`](/get-local-offset) solves this by inverting the parent's world transform matrix to convert viewport deltas into CSS offset deltas. It handles arbitrary ancestor transforms with a single forced reflow.

```ts
// After drag ends, given the target viewport position (targetX, targetY):
const delta = getLocalOffset(element, targetX, targetY);
element.style.translate = `${delta.x}px ${delta.y}px`;
```
