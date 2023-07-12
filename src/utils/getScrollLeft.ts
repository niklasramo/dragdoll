import { isWindow } from './isWindow';

export function getScrollLeft(element: Element | Window) {
  return isWindow(element) ? element.pageXOffset : element.scrollLeft;
}
