import { isWindow } from './is-window.js';

export function getScrollLeftMax(element: Element | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollWidth - element.clientWidth;
}
