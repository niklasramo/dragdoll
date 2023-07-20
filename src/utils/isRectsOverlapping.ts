import { RectExtended } from '../types.js';

/**
 * Check if two rectangles are overlapping.
 */
export function isRectsOverlapping(a: RectExtended, b: RectExtended) {
  return !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
}
