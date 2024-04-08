import { getIntersection } from './get-intersection.js';

import { Rect } from '../types.js';

/**
 * Calculate intersection area between two rectangle.
 */
export function getIntersectionArea(a: Rect, b: Rect) {
  const intersection = getIntersection(a, b);
  return intersection ? intersection.width * intersection.height : 0;
}
