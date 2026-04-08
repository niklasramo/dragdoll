import { getStyle } from './get-style.js';

export function getIntrinsicHeight(element: HTMLElement | SVGSVGElement) {
  const style = getStyle(element);
  let height = parseFloat(style.height) || 0;

  if (style.boxSizing === 'border-box') {
    return height;
  }

  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const borderBottom = parseFloat(style.borderBottomWidth) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;

  // Add border.
  height += borderTop;
  height += borderBottom;

  // Add padding.
  height += paddingTop;
  height += paddingBottom;

  // Add scrollbar height. `offsetHeight - clientHeight` gives
  // `border + scrollbar` as an integer, so we subtract the borders
  // to isolate the scrollbar. Note that this method is not 100%
  // accurate because `offsetHeight` and `clientHeight` return
  // integers instead of subpixel values, which can introduce up to
  // ±0.5px of error. When `devicePixelRatio` is an integer
  // (standard display at 100% zoom, Retina, etc.) the scrollbar is
  // virtually always an integer CSS pixel value, so we round the
  // border sum to match the integer math in `offsetHeight` /
  // `clientHeight` and get an exact result. When `devicePixelRatio`
  // is non-integer (browser zoom or fractional display scaling) the
  // scrollbar is fractional, so we keep the float subtraction to
  // preserve subpixel precision. `Math.max` guards against slightly
  // negative results from integer rounding at the 0.5 boundary.
  if (element instanceof HTMLElement) {
    const scrollbarPlusBorder = element.offsetHeight - element.clientHeight;
    const borderSum = borderTop + borderBottom;
    const scrollbarSize = Number.isInteger(window.devicePixelRatio)
      ? scrollbarPlusBorder - Math.round(borderSum)
      : scrollbarPlusBorder - borderSum;
    height += Math.max(0, scrollbarSize);
  }

  return height;
}
