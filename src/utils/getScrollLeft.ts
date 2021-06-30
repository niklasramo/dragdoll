import { isWindow } from './isWindow';

export function getScrollLeft(element: HTMLElement | Window) {
  return isWindow(element) ? element.pageXOffset : element.scrollLeft;
}
