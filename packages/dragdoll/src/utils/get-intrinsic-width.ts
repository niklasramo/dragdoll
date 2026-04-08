import { getStyle } from './get-style.js';

export function getIntrinsicWidth(element: HTMLElement | SVGSVGElement) {
  const style = getStyle(element);
  let width = parseFloat(style.width) || 0;

  if (style.boxSizing === 'border-box') {
    return width;
  }

  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderRight = parseFloat(style.borderRightWidth) || 0;
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;

  // Add border.
  width += borderLeft;
  width += borderRight;

  // Add padding.
  width += paddingLeft;
  width += paddingRight;

  // Add scrollbar width. `offsetWidth - clientWidth` gives
  // `border + scrollbar` as an integer, so we subtract the borders
  // to isolate the scrollbar. Note that this method is not 100%
  // accurate because `offsetWidth` and `clientWidth` return integers
  // instead of subpixel values, which can introduce up to ±0.5px
  // of error. When `devicePixelRatio` is an integer (standard
  // display at 100% zoom, Retina, etc.) the scrollbar is virtually
  // always an integer CSS pixel value, so we round the border sum
  // to match the integer math in `offsetWidth` / `clientWidth` and
  // get an exact result. When `devicePixelRatio` is non-integer
  // (browser zoom or fractional display scaling) the scrollbar is
  // fractional, so we keep the float subtraction to preserve
  // subpixel precision. `Math.max` guards against slightly negative
  // results from integer rounding at the 0.5 boundary.
  if (element instanceof HTMLElement) {
    const scrollbarPlusBorder = element.offsetWidth - element.clientWidth;
    const borderSum = borderLeft + borderRight;
    const scrollbarSize = Number.isInteger(window.devicePixelRatio)
      ? scrollbarPlusBorder - Math.round(borderSum)
      : scrollbarPlusBorder - borderSum;
    width += Math.max(0, scrollbarSize);
  }

  return width;
}
