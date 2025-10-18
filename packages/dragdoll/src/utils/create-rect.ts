import type { Rect } from '../types.js';

export function createRect(sourceRect?: Rect, result: Rect = { width: 0, height: 0, x: 0, y: 0 }) {
  if (sourceRect) {
    result.width = sourceRect.width;
    result.height = sourceRect.height;
    result.x = sourceRect.x;
    result.y = sourceRect.y;
  }
  return result;
}
