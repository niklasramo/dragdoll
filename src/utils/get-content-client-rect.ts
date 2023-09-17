import { isWindow } from './is-window.js';

import { isDocument } from './is-document.js';

import { getStyle } from './get-style.js';

import { RectExtended } from '../types.js';

/**
 * Get window's or element's client rectangle data relative to the element's
 * content dimensions (includes inner size + padding, excludes scrollbars,
 * borders and margins).
 */
export function getContentClientRect(
  element: Element | Window | Document,
  result: RectExtended = { width: 0, height: 0, left: 0, right: 0, top: 0, bottom: 0 },
) {
  if (isWindow(element)) {
    result.width = document.documentElement.clientWidth;
    result.height = document.documentElement.clientHeight;
    result.left = 0;
    result.right = result.width;
    result.top = 0;
    result.bottom = result.height;
  } else if (isDocument(element)) {
    result.width = Math.max(
      document.documentElement.scrollWidth,
      document.body.scrollWidth,
      document.documentElement.clientWidth,
    );
    result.height = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      document.documentElement.clientHeight,
    );
    result.left = -window.scrollX;
    result.top = -window.scrollY;
    result.right = result.left + result.width;
    result.bottom = result.top + result.height;
  } else {
    const style = getStyle(element);
    let { width, height, left, top } = element.getBoundingClientRect();

    // Compute border sizes.
    const borderLeft = parseFloat(style.borderLeftWidth) || 0;
    const borderRight = parseFloat(style.borderRightWidth) || 0;
    const borderTop = parseFloat(style.borderTopWidth) || 0;
    const borderBottom = parseFloat(style.borderBottomWidth) || 0;

    // Add borders to offsets.
    left += borderLeft;
    top += borderTop;

    // Remove borders from dimensions.
    width -= borderLeft;
    width -= borderRight;
    height -= borderTop;
    height -= borderBottom;

    // Remove scrollbar size from dimesions.
    if (element instanceof HTMLHtmlElement) {
      const doc = element.ownerDocument;
      const win = doc.defaultView;
      if (win) {
        width -= win.innerWidth - doc.documentElement.clientWidth;
        height -= win.innerHeight - doc.documentElement.clientHeight;
      }
    } else {
      width -= Math.max(0, Math.round(width) - element.clientWidth);
      height -= Math.max(0, Math.round(height) - element.clientHeight);
    }

    result.width = width;
    result.height = height;
    result.left = left;
    result.top = top;
    result.right = left + width;
    result.bottom = top + height;
  }

  return result;
}
