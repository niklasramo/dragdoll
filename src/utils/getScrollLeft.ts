import { isWindow } from './isWindow.js';

export function getScrollLeft(element: Element | Window) {
  return isWindow(element) ? element.pageXOffset : element.scrollLeft;
}
