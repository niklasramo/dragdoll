import { isRectsOverlapping } from './isRectsOverlapping.js';

import { RectExtended } from '../types.js';

/**
 * Calculate intersection area between two rectangle.
 */
export function getIntersectionArea(a: RectExtended, b: RectExtended) {
  if (!isRectsOverlapping(a, b)) return 0;
  const width = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const height = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return width * height;
}
