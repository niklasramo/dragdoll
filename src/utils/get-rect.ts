import { getRect as mezrGetRect } from 'mezr';

import { Rect } from '../types.js';

/**
 * A wrapper around `getRect` from `mezr` that returns a `Rect` object.
 */
export function getRect(...args: Parameters<typeof mezrGetRect>): Rect {
  const { width, height, left: x, top: y } = mezrGetRect(...args);
  return { width, height, x, y };
}
