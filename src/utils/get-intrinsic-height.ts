import { getStyle } from './get-style.js';

export function getIntrinsicHeight(element: HTMLElement | SVGSVGElement) {
  const style = getStyle(element);
  let height = parseFloat(style.height) || 0;

  if (style.boxSizing === 'border-box') {
    return height;
  }

  // Add border.
  height += parseFloat(style.borderTopWidth) || 0;
  height += parseFloat(style.borderBottomWidth) || 0;

  // Add padding.
  height += parseFloat(style.paddingTop) || 0;
  height += parseFloat(style.paddingBottom) || 0;

  // Add scrollbar height.
  if (element instanceof HTMLElement) {
    height += element.offsetHeight - element.clientHeight;
  }

  return height;
}
