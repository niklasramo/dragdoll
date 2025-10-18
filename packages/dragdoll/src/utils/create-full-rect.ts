import type { Rect, RectFull } from '../types.js';

export function createFullRect(
  sourceRect?: Rect,
  result: RectFull = { width: 0, height: 0, x: 0, y: 0, left: 0, top: 0, right: 0, bottom: 0 },
) {
  if (sourceRect) {
    result.width = sourceRect.width;
    result.height = sourceRect.height;
    result.x = sourceRect.x;
    result.y = sourceRect.y;
    result.left = sourceRect.x;
    result.top = sourceRect.y;
    result.right = sourceRect.x + sourceRect.width;
    result.bottom = sourceRect.y + sourceRect.height;
  }
  return result;
}
