import { isWindow } from './isWindow.js';

import { getStyle } from './getStyle.js';

import { RectExtended } from '../types.js';

/**
 * Get window's or element's client rectangle data relative to the element's
 * content dimensions (includes inner size + padding, excludes scrollbars,
 * borders and margins).
 */
export function getContentRect(
  element: Element | Window,
  result: RectExtended = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 },
) {
  if (isWindow(element)) {
    result.width = document.documentElement.clientWidth;
    result.height = document.documentElement.clientHeight;
    result.left = 0;
    result.right = result.width;
    result.top = 0;
    result.bottom = result.height;
  } else {
    const rect = element.getBoundingClientRect();
    const style = getStyle(element);
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;
    result.width = element.clientWidth;
    result.height = element.clientHeight;
    result.left = rect.left + borderLeft;
    result.right = result.left + result.width;
    result.top = rect.top + borderTop;
    result.bottom = result.top + result.height;
  }

  return result;
}
