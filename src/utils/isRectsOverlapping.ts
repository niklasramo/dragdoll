import { Rect } from '../types';

/**
 * Check if two rectangles are overlapping.
 */
export function isRectsOverlapping(a: Rect, b: Rect) {
  return !(
    a.left + a.width <= b.left ||
    b.left + b.width <= a.left ||
    a.top + a.height <= b.top ||
    b.top + b.height <= a.top
  );
}
