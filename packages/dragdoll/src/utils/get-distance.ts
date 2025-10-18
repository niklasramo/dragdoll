import { getDistance as _getDistance } from 'mezr/getDistance';
import type { Rect } from '../types.js';
import { createFullRect } from './create-full-rect.js';

const RECT_A = createFullRect();
const RECT_B = createFullRect();

/**
 * Calculate distance between two rectangles.
 */
export function getDistance(a: Rect, b: Rect) {
  return _getDistance(createFullRect(a, RECT_A), createFullRect(b, RECT_B));
}
