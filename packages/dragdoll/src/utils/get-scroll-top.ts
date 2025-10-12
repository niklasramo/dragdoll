import { isWindow } from './is-window.js';

export function getScrollTop(element: Element | Window) {
  return isWindow(element) ? element.scrollY : element.scrollTop;
}
