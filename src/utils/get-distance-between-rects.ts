import { isRectsOverlapping } from './is-rects-overlapping.js';

import { RectExtended } from '../types.js';

function distanceBetweenPoints(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Calculate shortest distance between two rectangles. Returns zero if the rects
 * are overlapping.
 */
export function getDistanceBetweenRects(a: RectExtended, b: RectExtended) {
  if (isRectsOverlapping(a, b)) return 0;

  // Check left side zones.
  if (a.right < b.left) {
    // Left-top corner.
    if (a.bottom < b.top) {
      // Distance between a right-bottom point and b left-top point.
      return distanceBetweenPoints(a.right, a.bottom, b.left, b.top);
    }
    // Left-bottom corner.
    else if (a.top > b.bottom) {
      // Distance between a right-top point and b left-bottom point.
      return distanceBetweenPoints(a.right, a.top, b.left, b.bottom);
    }
    // Left side.
    else {
      return b.left - a.right;
    }
  }
  // Check right side zones.
  else if (a.left > b.right) {
    // Right-top corner.
    if (a.bottom < b.top) {
      // Distance between a left-bottom point and b right-top point.
      return distanceBetweenPoints(a.left, a.bottom, b.right, b.top);
    }
    // Right-bottom corner.
    else if (a.top > b.bottom) {
      // Distance between a left-top point and b right-bottom point.
      return distanceBetweenPoints(a.left, a.top, b.right, b.bottom);
    }
    // Right side.
    else {
      return a.left - b.right;
    }
  }
  // Check top and bottom sides.
  else {
    // Top side.
    if (a.bottom < b.top) {
      return b.top - a.bottom;
    }
    // Bottom side.
    else {
      return a.top - b.bottom;
    }
  }
}
