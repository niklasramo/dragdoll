import { Point } from 'types.js';
import { getStyle } from './get-style.js';

// Computes element's (padding box) offset from the window's top-left corner.
export function getClientOffset(
  element: HTMLElement | SVGSVGElement | Window | Document,
  result: Point = { x: 0, y: 0 },
): Point {
  result.x = 0;
  result.y = 0;

  // If window, return 0, 0.
  if (element instanceof Window) {
    return result;
  }

  // If document, return the offset from Window.
  if (element instanceof Document) {
    result.x = window.scrollX * -1;
    result.y = window.scrollY * -1;
    return result;
  }

  // If element, calculate the offset from the element's padding box to the
  // window's top-left corner.
  const { x, y } = element.getBoundingClientRect();
  const style = getStyle(element);
  result.x = x + (parseFloat(style.borderLeftWidth) || 0);
  result.y = y + (parseFloat(style.borderTopWidth) || 0);
  return result;
}
