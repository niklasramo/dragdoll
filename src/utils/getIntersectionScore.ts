import { getIntersectionArea } from './getIntersectionArea';

import { Rect } from '../types';

/**
 * Calculate how many percent the intersection area of two rectangles is from
 * the maximum potential intersection area between the rectangles.
 * @param {Object} a
 * @param {Object} b
 * @returns {number}
 */
export function getIntersectionScore(a: Rect, b: Rect) {
  const area = getIntersectionArea(a, b);
  if (!area) return 0;
  const maxArea = Math.min(a.width, b.width) * Math.min(a.height, b.height);
  return (area / maxArea) * 100;
}
