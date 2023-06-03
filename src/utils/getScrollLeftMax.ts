import { isWindow } from './isWindow';

export function getScrollLeftMax(element: HTMLElement | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollWidth - element.clientWidth;
}
