# getWorldTransformMatrix

A utility function that computes the cumulative CSS transform matrix from an element all the way up to the root of the DOM tree. This "world transform" matrix represents how CSS coordinates on the element map to viewport coordinates after all ancestor transforms have been applied.

## Usage

```ts
import { getWorldTransformMatrix } from 'dragdoll';

const element = document.querySelector('.my-element') as HTMLElement;

// Compute the world transform matrix.
const matrix = getWorldTransformMatrix(element);
console.log(matrix.toString()); // e.g. "matrix(0.5, 0, 0, 0.5, 100, 200)"

// Reuse an existing DOMMatrix to avoid allocations.
const reusableMatrix = new DOMMatrix();
getWorldTransformMatrix(element, reusableMatrix);
```

## Signature

```ts
function getWorldTransformMatrix(el: HTMLElement | SVGSVGElement, result?: DOMMatrix): DOMMatrix;
```

## Parameters

### el

The element whose world transform matrix to compute.

### result

An optional `DOMMatrix` instance to write the result into. If provided, the matrix is reset to identity before computation and returned. This avoids allocating a new `DOMMatrix` on every call.

- Optional.
- Default is `new DOMMatrix()`.

## Return Value

A `DOMMatrix` representing the cumulative world transform. This is the product of all ancestor transforms (including `translate`, `rotate`, `scale`, and `transform` properties) applied in the correct CSS order, with transform-origin offsets accounted for.

## How It Works

The function walks from the given element up to the document root, and for each element that has a non-identity CSS transform:

1. Reads the coalesced transform string via [`getElementTransformString`](/get-element-transform-string).
2. Reads the element's `transform-origin` from computed styles.
3. Constructs the effective local transform as `translate(originX, originY) * transform * translate(-originX, -originY)`.
4. Pre-multiplies the result matrix by this local transform.

The final matrix maps element-local CSS coordinates to the viewport coordinate system, accounting for all ancestor scales, rotations, skews, and translations.

## Common Use Cases

### Computing viewport position from CSS offset

Given an element's CSS offset delta, multiply by the world transform matrix to get the corresponding viewport delta.

### Inverting for CSS offset computation

[`getLocalOffset`](/get-local-offset) uses the inverse of the parent's world transform matrix Jacobian to convert viewport deltas into CSS offset deltas.

## Exports

```ts
// Main entry
import { getWorldTransformMatrix } from 'dragdoll';

// Sub-path entry
import { getWorldTransformMatrix } from 'dragdoll/utils/get-world-transform-matrix';
```
