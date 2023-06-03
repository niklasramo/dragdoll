import { isWindow } from './isWindow';

export function getScrollTopMax(element: HTMLElement | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollHeight - element.clientHeight;
}
