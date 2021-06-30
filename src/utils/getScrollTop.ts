import { isWindow } from './isWindow';

export function getScrollTop(element: HTMLElement | Window) {
  return isWindow(element) ? element.pageYOffset : element.scrollTop;
}
