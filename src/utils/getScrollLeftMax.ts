import { isWindow } from './isWindow.js';

export function getScrollLeftMax(element: Element | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollWidth - element.clientWidth;
}
