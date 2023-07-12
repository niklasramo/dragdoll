import { isWindow } from './isWindow';

export function getScrollElement(element: Element | Window) {
  if (isWindow(element) || element === document.documentElement || element === document.body) {
    return window;
  } else {
    return element;
  }
}
