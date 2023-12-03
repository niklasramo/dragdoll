import { getIntersection } from 'mezr';

import { RectExtended } from '../types.js';

/**
 * Calculate intersection area between two rectangle.
 */
export function getIntersectionArea(a: RectExtended, b: RectExtended) {
  const intersection = getIntersection(a, b);
  return intersection ? intersection.width * intersection.height : 0;
}
