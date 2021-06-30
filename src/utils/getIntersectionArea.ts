import { isRectsOverlapping } from './isRectsOverlapping';

import { Rect } from '../types';

/**
 * Calculate intersection area between two rectangle.
 *
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
export function getIntersectionArea(a: Rect, b: Rect) {
  if (!isRectsOverlapping(a, b)) return 0;
  const width = Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left);
  const height = Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top);
  return width * height;
}
