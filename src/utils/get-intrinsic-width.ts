import { getStyle } from './get-style.js';

export function getIntrinsicWidth(element: HTMLElement | SVGSVGElement) {
  const style = getStyle(element);
  let width = parseFloat(style.width) || 0;

  if (style.boxSizing === 'border-box') {
    return width;
  }

  // Add border.
  width += parseFloat(style.borderLeftWidth) || 0;
  width += parseFloat(style.borderRightWidth) || 0;

  // Add padding.
  width += parseFloat(style.paddingLeft) || 0;
  width += parseFloat(style.paddingRight) || 0;

  // Add scrollbar width.
  if (element instanceof HTMLElement) {
    width += element.offsetWidth - element.clientWidth;
  }

  return width;
}
