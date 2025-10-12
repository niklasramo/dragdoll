import { isWindow } from './is-window.js';

export function getScrollTopMax(element: Element | Window) {
  if (isWindow(element)) element = document.documentElement;
  return element.scrollHeight - element.clientHeight;
}
