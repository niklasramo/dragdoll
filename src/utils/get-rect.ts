import { getRect as _getRect } from 'mezr';

import { Rect } from '../types.js';

/**
 * A wrapper around `getRect` from `mezr` that returns a `Rect` object.
 */
export function getRect(...args: Parameters<typeof _getRect>): Rect {
  const { width, height, left: x, top: y } = _getRect(...args);
  return { width, height, x, y };
}
