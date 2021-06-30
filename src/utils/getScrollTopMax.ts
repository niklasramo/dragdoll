import { isWindow } from './isWindow';

export function getScrollTopMax(element: HTMLElement | Window) {
  if (isWindow(element)) {
    return document.documentElement.scrollHeight - document.documentElement.clientHeight;
  } else {
    return element.scrollHeight - element.clientHeight;
  }
}
