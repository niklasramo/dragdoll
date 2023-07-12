import { isWindow } from './isWindow';

export function getScrollLeftMax(element: Element | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollWidth - element.clientWidth;
}
