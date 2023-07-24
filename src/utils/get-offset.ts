import { getStyle } from './get-style.js';

import { isWindow } from './is-window.js';

import { isDocument } from './is-document.js';

/**
 * Returns the element's document offset, which in practice means the vertical
 * and horizontal distance between the element's northwest corner and the
 * document's northwest corner.
 */
export function getOffset(
  element: Element | Document | Window,
  result: { left: number; top: number } = { left: 0, top: 0 },
) {
  // Set up return data.
  result.left = 0;
  result.top = 0;

  // Document's offsets are always 0.
  if (isDocument(element)) {
    return result;
  }

  // Window's offsets are the viewport scroll left/top values.
  if (isWindow(element)) {
    result.left = element.scrollX;
    result.top = element.scrollY;
    return result;
  }

  // Add viewport scroll left/top to the respective offsets.
  const win = element.ownerDocument.defaultView;
  if (win) {
    result.left += win.scrollX;
    result.top += win.scrollY;
  }

  // Add element's client rects to the offsets.
  const { left, top } = element.getBoundingClientRect();
  result.left += left;
  result.top += top;

  // Include element's borders into the offset since we care about the offset
  // from the document to the element's content area (including padding).
  const style = getStyle(element);
  result.left += parseFloat(style.borderLeftWidth) || 0;
  result.top += parseFloat(style.borderTopWidth) || 0;

  return result;
}
