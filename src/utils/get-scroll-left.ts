import { isWindow } from './is-window.js';

export function getScrollLeft(element: Element | Window) {
  return isWindow(element) ? element.scrollX : element.scrollLeft;
}
