import { isWindow } from './isWindow';

export function getScrollTopMax(element: Element | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollHeight - element.clientHeight;
}
