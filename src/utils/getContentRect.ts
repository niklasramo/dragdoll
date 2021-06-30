import { isWindow } from './isWindow';

import { getStyleAsFloat } from './getStyleAsFloat';

import { RectExtended } from '../types';

/**
 * Get window's or element's client rectangle data relative to the element's
 * content dimensions (includes inner size + padding, excludes scrollbars,
 * borders and margins).
 */
export function getContentRect(
  element: HTMLElement | Window,
  result: RectExtended = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 }
) {
  if (isWindow(element)) {
    result.width = document.documentElement.clientWidth;
    result.height = document.documentElement.clientHeight;
    result.left = 0;
    result.right = result.width;
    result.top = 0;
    result.bottom = result.height;
  } else {
    const { left, top } = element.getBoundingClientRect();
    const borderLeft = element.clientLeft || getStyleAsFloat(element, 'border-left-width');
    const borderTop = element.clientTop || getStyleAsFloat(element, 'border-top-width');
    result.width = element.clientWidth;
    result.height = element.clientHeight;
    result.left = left + borderLeft;
    result.right = result.left + result.width;
    result.top = top + borderTop;
    result.bottom = result.top + result.height;
  }

  return result;
}
