import { isWindow } from './isWindow';

export function getScrollLeftMax(element: HTMLElement | Window) {
  if (isWindow(element)) {
    return document.documentElement.scrollWidth - document.documentElement.clientWidth;
  } else {
    return element.scrollWidth - element.clientWidth;
  }
}
