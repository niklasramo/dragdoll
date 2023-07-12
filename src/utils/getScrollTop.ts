import { isWindow } from './isWindow';

export function getScrollTop(element: Element | Window) {
  return isWindow(element) ? element.pageYOffset : element.scrollTop;
}
