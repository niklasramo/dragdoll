import { Rect } from '../types.js';

/**
 * Check if two rectangles intersect.
 */
export function isIntersecting(a: Rect, b: Rect) {
  return !(
    a.x + a.width <= b.x ||
    b.x + b.width <= a.x ||
    a.y + a.height <= b.y ||
    b.y + b.height <= a.y
  );
}
