import { Rect } from '../types.js';
import { getIntersectionRect } from './get-intersection-rect.js';

const TEMP_RECT: Rect = { width: 0, height: 0, x: 0, y: 0 };

/**
 * Calculate how many percent the intersection area of two rectangles is from
 * the maximum potential intersection area between the rectangles.
 */
export function getIntersectionScore(a: Rect, b: Rect, intersectionRect?: Rect | undefined | null) {
  if (!intersectionRect) intersectionRect = getIntersectionRect(a, b, TEMP_RECT);
  if (!intersectionRect) return 0;

  const area = intersectionRect.width * intersectionRect.height;
  if (!area) return 0;

  const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
  return (area / maxArea) * 100;
}
