# Transform Handling

How the `Draggable` class ensures that dragged elements move in the correct direction and stay in sync with the pointer, regardless of CSS transforms on ancestor elements.

---

## The Problem

Pointer events report coordinates in **viewport space** (`clientX`/`clientY`). But a dragged element may live inside parents with `scale`, `rotate`, `skew`, or 3D transforms. In that context, a 1 px pointer movement to the right does **not** correspond to a 1 px CSS `translateX` — it depends on the entire ancestor transform chain.

The library solves this analytically using matrix math. No trial-and-error DOM probing is needed.

---

## Pipeline Overview

```
PointerSensor (clientX/Y)
  → Draggable._prepareMove()    compute diffX/Y between successive pointer positions
    → _applyModifiers()         run positionModifiers (snap, containment, etc.)
      → item.position           accumulates the final delta (viewport pixels)
        → applyPosition()       builds a composite DOMMatrix, writes CSS transform
```

Every step operates in viewport pixels until the final `applyPosition` call, which converts into the element's local coordinate system via matrix inversion.

---

## Step-by-Step Breakdown

### 1. Initialization (Pre-Work at Drag Start)

Before any movement happens, the `DraggableDragItem` constructor captures the element's transform state and computes the container matrices needed for coordinate conversion.

#### 1.1. Capturing the Element's Transforms

**File:** `draggable-drag-item.ts` — constructor

At drag start the element's current transform state is captured into three pieces:

```ts
const individualTransforms = getElementTransformString(element, true);

this.elementTransformOrigin = parseTransformOrigin(style.transformOrigin);
this.elementTransformMatrix = new DOMMatrix().setMatrixValue(
  individualTransforms + style.transform,
);
this.elementOffsetMatrix = new DOMMatrix(individualTransforms).invertSelf();
```

- **`elementTransformOrigin`**: The parsed `transform-origin` (`x`, `y`, `z` in pixels).
- **`elementTransformMatrix`**: The full combined transform — individual properties (`translate`, `rotate`, `scale`) concatenated with the `transform` property. This is the element's complete original transform.
- **`elementOffsetMatrix`**: The **inverse** of just the individual properties (`translate`, `rotate`, `scale`). This is used later to cancel them out so they don't double-apply (see step 3.7).

#### 1.2. Element Transform String

**File:** `get-element-transform-string.ts`

CSS has both individual transform properties (`translate`, `rotate`, `scale`) and the legacy `transform` property. The browser applies them in a fixed order: **translate -> rotate -> scale -> transform**. This function concatenates them in that order, producing a single transform string.

When called with `ignoreNormalTransform = true`, it returns only the individual properties. This is how `elementOffsetMatrix` captures just the individual transforms.

Percentage values in `translate` are converted to pixels using the element's intrinsic dimensions.

#### 1.3. Computing World Transform Matrices

**File:** `draggable-drag-item.ts` — `_updateContainerMatrices()`

For each container (the element's original parent and the drag container), the library computes a world transform matrix and its inverse, then caches both:

```ts
[this.elementContainer, this.dragContainer].forEach((container) => {
  if (!this._matrixCache.isValid(container)) {
    const matrices = this._matrixCache.get(container) || [new DOMMatrix(), new DOMMatrix()];
    const [matrix, inverseMatrix] = matrices;
    getWorldTransformMatrix(container, matrix);
    inverseMatrix.setMatrixValue(matrix.toString()).invertSelf();
    this._matrixCache.set(container, matrices);
  }
});
```

The `[worldMatrix, inverseWorldMatrix]` pair for each container is stored in a shared cache on the `DraggableDrag` instance (see Caching Strategy below). If multiple drag items share the same container, the matrix is computed only once.

#### 1.4. World Transform Matrix

**File:** `get-world-transform-matrix.ts`

The world transform matrix is the accumulated product of every ancestor's transform from the element up to the document root.

```ts
while (currentElement) {
  const transformString = getElementTransformString(currentElement);
  if (transformString) {
    MATRIX.setMatrixValue(transformString);
    if (!MATRIX.isIdentity) {
      const { transformOrigin } = getStyle(currentElement);
      const { x, y, z } = parseTransformOrigin(transformOrigin);
      if (z === 0) {
        MATRIX.setMatrixValue(
          `translate(${x}px,${y}px) ${MATRIX} translate(${x * -1}px,${y * -1}px)`,
        );
      } else {
        MATRIX.setMatrixValue(
          `translate3d(${x}px,${y}px,${z}px) ${MATRIX} translate3d(${x * -1}px,${y * -1}px,${z * -1}px)`,
        );
      }
      result.preMultiplySelf(MATRIX);
    }
  }
  currentElement = currentElement.parentElement;
}
```

Key details:

- Uses `preMultiplySelf` because CSS transforms compose right-to-left (innermost child applies first visually, outermost ancestor is the leftmost matrix factor).
- Wraps each element's transform with `translate(origin) ... translate(-origin)` to account for `transform-origin`. This mirrors how the browser applies transforms internally.
- The result is a single `DOMMatrix` that maps from the element's local coordinate space to viewport space.

#### 1.5. Computing Container Offset

**File:** `draggable-drag-item.ts` — `_updateContainerOffset()`

When an element is reparented to a different drag container during drag, the library computes the positional difference between the two containers' coordinate systems so the element doesn't jump.

Two strategies depending on the transform type:

- **Warped matrices** (scale, rotate, skew, 3D): Appends a temporary invisible measure element into the offset container with the inverse transform applied, measures its `getBoundingClientRect()`, then removes it. This is the only way to get subpixel-accurate coordinates when the container has a non-trivial transform.
- **Simple 2D translations**: Subtracts `m41`/`m42` (the translation components) from the client offset, avoiding any DOM manipulation.

The `isMatrixWarped()` utility detects which case applies by checking whether any matrix component other than `m41`/`m42` differs from the identity.

### 2. Pointer Delta Calculation

**File:** `draggable.ts` — `_prepareMove()`

```ts
const diffX = moveEvent.x - prevMoveEvent.x;
const diffY = moveEvent.y - prevMoveEvent.y;
```

The delta is always in **viewport space**. After modifiers process this delta it accumulates on the item:

```ts
item.position.x += positionChange.x;
item.position.y += positionChange.y;
```

`item.position` represents the total viewport-space translation since drag start.

### 3. The `applyPosition` Function

**File:** `draggable.ts` — `DraggableDefaultSettings.applyPosition`

This is the core of the transform handling. It builds a composite `DOMMatrix` that, when applied as the element's CSS `transform`, places the element at the correct viewport position while preserving its original transforms.

The matrix is built in this exact order:

#### 3.1. Negate Transform Origin

```ts
if (needsOriginOffset) {
  if (oZ === 0) {
    ELEMENT_MATRIX.translateSelf(-oX, -oY);
  } else {
    ELEMENT_MATRIX.translateSelf(-oX, -oY, -oZ);
  }
}
```

CSS applies transforms relative to the element's `transform-origin`. The matrix math operates from `(0, 0)`, so the origin is temporarily shifted to the top-left corner. The 2D path is used when `oZ === 0` as an optimization. This will be undone in step 3.5.

#### 3.2. Invert the Container's World Matrix

```ts
if (!inverseDragContainerMatrix.isIdentity) {
  ELEMENT_MATRIX.multiplySelf(inverseDragContainerMatrix);
}
```

Multiplies by the **inverse** of the drag container's world transform matrix. This "undoes" all ancestor transforms, effectively transforming coordinates from the container's local space into **world (viewport) space**.

During the end phase (when the element returns to its original container), the original container's inverse matrix is used instead.

#### 3.3. Apply the Translation in World Space

```ts
resetMatrix(TEMP_MATRIX).translateSelf(tX, tY);
ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);
```

Where `tX = position.x + alignmentOffset.x + containerOffset.x`.

Because the previous step moved us into world space, this translation maps directly to viewport pixels. **This is why the element moves in sync with the pointer** — 1 px of pointer movement results in exactly 1 px of visual movement, regardless of ancestor transforms.

#### 3.4. Re-apply the Container's World Matrix

```ts
if (!containerMatrix.isIdentity) {
  ELEMENT_MATRIX.multiplySelf(containerMatrix);
}
```

Transforms back from world space into the **original** container's local coordinate system. This ensures the element renders correctly within its parent's transform context.

Note: this always uses the original container's matrix (not the drag container's), so the element's own transform is always composed relative to its original parent. This matters when the element is temporarily reparented to a drag container during the drag.

#### 3.5. Undo the Transform Origin Negation

```ts
if (needsOriginOffset) {
  resetMatrix(TEMP_MATRIX).translateSelf(oX, oY, oZ);
  ELEMENT_MATRIX.multiplySelf(TEMP_MATRIX);
}
```

Restores the transform-origin offset that was negated in step 3.1.

#### 3.6. Apply the Element's Original Transform

```ts
if (!elementTransformMatrix.isIdentity) {
  ELEMENT_MATRIX.multiplySelf(elementTransformMatrix);
}
```

Preserves whatever transforms the element originally had (e.g., `rotate(45deg) scale(1.5)`). The `elementTransformMatrix` is captured at drag start from the full computed transform string (individual properties + `transform`).

#### 3.7. Pre-multiply the Element Offset Matrix

```ts
if (!elementOffsetMatrix.isIdentity) {
  ELEMENT_MATRIX.preMultiplySelf(elementOffsetMatrix);
}
```

The `elementOffsetMatrix` is the **inverse** of the element's individual CSS transform properties (`translate`, `rotate`, `scale` — excluding the `transform` property). Pre-multiplying cancels these out so they don't double-apply, since the `elementTransformMatrix` in step 3.6 already includes them.

#### Complete Matrix Formula

In matrix notation (right-to-left evaluation):

```
Final = OffsetMatrix
      * (-Origin)
      * InverseDragContainerMatrix
      * Translate(tX, tY)
      * ContainerMatrix
      * (+Origin)
      * ElementTransformMatrix
```

### 4. Alignment Drift Correction

**File:** `draggable.ts` — `_prepareAlign()`

During scroll or ancestor layout changes, the element can visually drift from its expected position. The alignment system corrects this:

```ts
const { x, y } = item.element.getBoundingClientRect();
const alignDiffX = item.clientRect.x - item['_moveDiff'].x - x;
item.alignmentOffset.x = item.alignmentOffset.x - item['_alignDiff'].x + alignDiffX;
```

1. Measures the element's actual viewport position via `getBoundingClientRect()`.
2. Compares it against the expected position (`clientRect` minus accumulated `_moveDiff`).
3. Adjusts `alignmentOffset` to compensate for the drift.
4. Calls `applyPosition(phase: 'align')` to re-render with the corrected offset.

This runs on scroll events and ensures the element stays locked to the pointer even when the page scrolls during a drag.

---

## `getLocalOffset` — Analytical Coordinate Conversion

**File:** `get-local-offset.ts`

A standalone utility that converts a target viewport position into the CSS offset delta needed to place an element there. Used outside the main drag pipeline (e.g., for drag preview positioning).

```ts
// Extract the 2x2 linear subpart of the parent's world matrix.
// This IS the Jacobian that maps CSS offset deltas to viewport deltas.
const m11 = worldMatrix.m11;
const m12 = worldMatrix.m12;
const m21 = worldMatrix.m21;
const m22 = worldMatrix.m22;

// Measure how far the element is from the target.
const rect = element.getBoundingClientRect();
const dx = targetX - rect.left;
const dy = targetY - rect.top;

// Invert the 2x2 Jacobian to convert viewport delta to CSS offset delta.
const det = m11 * m22 - m12 * m21;
const invDet = 1 / det;
res.x = (m22 * dx - m21 * dy) * invDet;
res.y = (-m12 * dx + m11 * dy) * invDet;
```

This achieves the same coordinate conversion as the `applyPosition` sandwich (invert container -> translate -> re-apply container), but in a single step by directly inverting the 2x2 Jacobian. It handles arbitrary 2D ancestor transforms (scale, skew, rotation) with only 1 forced reflow (the `getBoundingClientRect` call).

Falls back to a simple `dx`/`dy` if the determinant is near zero (degenerate/collapsed matrix).

---

## Caching Strategy

Transform computations are expensive and the same values are often needed for multiple items in the same drag. The caching system avoids redundant work:

- **Matrix cache** (`_matrixCache` on `DraggableDrag`): Stores `[worldMatrix, inverseWorldMatrix]` pairs keyed by container element. Shared across all `DraggableDragItem` instances in a drag. Uses `ObjectCache` with validation tracking — matrices can be invalidated without clearing the cached `DOMMatrix` objects (avoids GC churn from re-allocating matrices).
- **Client offset cache** (`_clientOffsetCache`): Same pattern for offset container positions.
- **Module-level singletons** (`ELEMENT_MATRIX`, `TEMP_MATRIX`, `MATRIX`): Reused across all `applyPosition` calls. Zero allocations in the hot path. See [Performance Patterns #4](performance-patterns.md) for details.

---

## Limitations: 3D Transforms and Perspective

The transform handling is designed for **2D transforms**. While the code uses `DOMMatrix` (4x4) and can represent 3D values, 3D-related CSS features are not fully supported. This is a deliberate design choice — not an oversight.

### Why We Don't Handle 3D/Perspective

The core issue is that there is no clear "correct" behavior for dragging an element inside a 3D/perspective context. The pointer moves in 2D (screen plane), but the element exists in a 3D scene. These two facts create a fundamental conflict:

- **If the element tracks the pointer 1:1 on screen**, it must move along a curved path in 3D space to compensate for perspective foreshortening. The further it moves from the vanishing point, the more the 3D translation diverges from the screen-space translation. This requires per-frame non-linear solving — the current linear matrix sandwich is no longer sufficient.
- **If the element moves linearly in 3D space**, the on-screen movement won't be 1:1 with the pointer. The element will appear to accelerate or decelerate as perspective foreshortening varies across the screen.

Neither behavior is universally "right." The first option is what users intuitively expect (pointer tracking), but the element warps in unexpected ways as it drags through the perspective projection. The second option is mathematically clean but the element visually drifts from the pointer.

On top of the ambiguous UX, these scenarios are rare in practice. Drag-and-drop in real applications — kanban boards, sortable lists, dashboards, file managers — operates in 2D. The few 3D use cases (card flips, carousels) typically involve rotating a container as a gesture, not dragging individual children through a perspective-projected space.

For the rare case where perspective-aware dragging is truly needed, a custom `applyPosition` function can be provided to handle the specific 3D setup without burdening the core library.

### What Is and Isn't Supported

| Transform type | Supported |
|---|---|
| 2D `translate`, `translateX`, `translateY` | Yes |
| 2D `rotate` | Yes |
| 2D `scale`, `scaleX`, `scaleY` | Yes |
| 2D `skew`, `skewX`, `skewY` | Yes |
| Any nesting depth of 2D transforms | Yes |
| `transform-origin` (2D and 3D) | Yes |
| Element's own 3D transforms (preserved, not used for pointer tracking) | Yes |
| `perspective` CSS property on ancestors | No |
| `perspective()` function in `transform` | No |
| 3D rotations on ancestors with `transform-style: flat` | No |
| 3D rotations on ancestors with `transform-style: preserve-3d` (no perspective) | Partial |

#### `perspective` CSS Property

The `perspective` CSS property (set on a parent, e.g., `perspective: 500px`) is **not read** from computed styles. The library reads `translate`, `rotate`, `scale`, and `transform` via `getElementTransformString`, but never reads the `perspective` property. Since `perspective` is separate from `transform` in the CSS spec (it is not reflected in `getComputedStyle().transform`), it is invisible to the world matrix computation. The dragged element will drift from the pointer.

#### `perspective()` Transform Function

The `perspective()` function inside the `transform` property (e.g., `transform: perspective(500px) rotateY(45deg)`) IS captured by `getComputedStyle().transform` and included in the `DOMMatrix`. However, perspective projection is **non-linear** — the browser divides by the W component after matrix multiplication. The "invert, translate, re-apply" sandwich assumes a linear mapping, so the element will drift from the pointer, especially at larger Z depths.

#### 3D Transforms with `transform-style: flat` (Default)

The library does not read `transform-style`. When computing world matrices, it multiplies all ancestor matrices together as if `transform-style: preserve-3d` were set everywhere. The browser default is `transform-style: flat`, which flattens 3D to 2D at each parent-child boundary. The library's simple matrix product does not account for this per-level flattening, producing an incorrect world matrix when ancestors have 3D rotations.

#### 3D Transforms with `transform-style: preserve-3d` (No Perspective)

When all ancestors use `preserve-3d` and no perspective is involved, the matrix accumulation is correct. However, the drag translation is always 2D (`translateSelf(tX, tY)`), so the element only moves in the XY plane of the un-transformed coordinate system.

---

## Key Insight

The fundamental technique is: **invert into world space, translate there, transform back**. By sandwiching the translation between `InverseContainerMatrix` and `ContainerMatrix`, the library guarantees that 1 px of pointer movement equals 1 px of visual element movement, regardless of how deeply nested or how wildly transformed the ancestors are — as long as the transforms are 2D.
