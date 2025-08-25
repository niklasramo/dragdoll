import { Rect } from '../types.js';

/**
 * Calculate intersection between two rectangles.
 */
export function getIntersectionRect(
  a: Rect,
  b: Rect,
  result: Rect = { width: 0, height: 0, x: 0, y: 0 },
) {
  const x1 = Math.max(a.x, b.x);
  const x2 = Math.min(a.x + a.width, b.x + b.width);
  if (x2 <= x1) return null;

  const y1 = Math.max(a.y, b.y);
  const y2 = Math.min(a.y + a.height, b.y + b.height);
  if (y2 <= y1) return null;

  result.x = x1;
  result.y = y1;
  result.width = x2 - x1;
  result.height = y2 - y1;

  return result;
}
