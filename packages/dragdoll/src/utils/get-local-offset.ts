import { getWorldTransformMatrix } from './get-world-transform-matrix.js';

// Computes the CSS offset delta that, when added to the
// element's current offset, positions it at (targetX,
// targetY) in viewport coordinates.
//
// Uses the parent's world transform matrix to analytically
// invert the mapping from CSS offsets to viewport position.
// This handles arbitrary ancestor transforms (scale, skew,
// rotation) with only 1 forced reflow (for
// getBoundingClientRect) instead of the 3 reflows a probing
// approach needs.
//
// Works for both left/top positioning (absolutely positioned
// elements) and translate(x, y) offsets when translate is the
// outermost (leftmost) transform function.
export function getLocalOffset(
  element: HTMLElement,
  targetX: number,
  targetY: number,
  result?: { x: number; y: number },
): { x: number; y: number } {
  const parent = element.parentElement;
  const res = result || { x: 0, y: 0 };

  // If no parent, fall back to simple viewport delta.
  if (!parent) {
    const rect = element.getBoundingClientRect();
    res.x = targetX - rect.left;
    res.y = targetY - rect.top;
    return res;
  }

  // Get the parent's world transform matrix. This traverses ancestor
  // getComputedStyle values (no reflows) and computes the accumulated
  // transform analytically.
  const worldMatrix = getWorldTransformMatrix(parent);

  // Extract the 2x2 linear subpart — this IS the Jacobian that maps
  // CSS offset deltas to viewport position deltas.
  const m11 = worldMatrix.m11;
  const m12 = worldMatrix.m12;
  const m21 = worldMatrix.m21;
  const m22 = worldMatrix.m22;

  // Measure the element's current viewport position (at most 1 reflow).
  const rect = element.getBoundingClientRect();
  const dx = targetX - rect.left;
  const dy = targetY - rect.top;

  // Invert the 2x2 Jacobian to convert viewport delta to CSS offset delta.
  const det = m11 * m22 - m12 * m21;

  if (Math.abs(det) < 1e-10) {
    // Degenerate matrix (collapsed container). Fall back to simple delta.
    res.x = dx;
    res.y = dy;
    return res;
  }

  const invDet = 1 / det;
  res.x = (m22 * dx - m21 * dy) * invDet;
  res.y = (-m12 * dx + m11 * dy) * invDet;
  return res;
}
