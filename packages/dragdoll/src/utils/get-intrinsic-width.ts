import { getStyle } from './get-style.js';

export function getIntrinsicWidth(element: HTMLElement | SVGSVGElement) {
  const style = getStyle(element);

  if (style.boxSizing === 'border-box') {
    return parseFloat(style.width) || 0;
  }

  // Content-box: intrinsic = border-box + scrollbar gutter. All values
  // from `getComputedStyle()` are subpixel-accurate.
  const width = parseFloat(style.width) || 0;
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderRight = parseFloat(style.borderRightWidth) || 0;
  const paddingLeft = parseFloat(style.paddingLeft) || 0;
  const paddingRight = parseFloat(style.paddingRight) || 0;
  const borderSum = borderLeft + borderRight;
  const paddingSum = paddingLeft + paddingRight;
  const declaredBorderBox = width + paddingSum + borderSum;

  // SVG has no scrollbar concerns and no reliable `offsetWidth` to
  // cross-check against, so trust the computed style values directly.
  if (!(element instanceof HTMLElement)) {
    return declaredBorderBox;
  }

  // Cache layout-triggering reads locally to avoid repeated DOM access.
  const offsetWidth = element.offsetWidth;
  const clientWidth = element.clientWidth;

  // Scrollbar gutter from integer-precision sources. `offsetWidth -
  // clientWidth` gives `border + scrollbar`; subtract the borders to
  // isolate the scrollbar. On integer DPR we round the border sum to
  // match the integer math in `offsetWidth`/`clientWidth`; on
  // fractional DPR the scrollbar itself is fractional so we keep the
  // float form. `Math.max` guards against ±0.5 rounding at the boundary.
  const scrollbarPlusBorder = offsetWidth - clientWidth;
  const scrollbarSize = Math.max(
    0,
    Number.isInteger(window.devicePixelRatio)
      ? scrollbarPlusBorder - Math.round(borderSum)
      : scrollbarPlusBorder - borderSum,
  );

  // Chrome quirk: when a classic (gutter-consuming) scrollbar is
  // rendered, `getComputedStyle().width` returns the visible content
  // area (declared content width minus one scrollbar gutter) rather
  // than the declared content width itself — confirmed on Chrome
  // Linux, Windows, and macOS with classic scrollbars. Firefox and
  // Safari return the declared content width. Each behaviour predicts
  // a different `offsetWidth`: the quirk predicts `declaredBorderBox +
  // scrollbar`, otherwise `declaredBorderBox`. We pick whichever story
  // matches reality more closely — no fixed threshold, so it stays
  // accurate at fractional DPR / browser zoom where rounding error on
  // `offsetWidth`/`clientWidth` can approach ±1.5 CSS px. The two
  // stories differ by roughly the scrollbar gutter (12–17 px
  // typically), so the correct one wins by a wide margin.
  const offsetMinusDeclared = offsetWidth - declaredBorderBox;
  const errorNoQuirk = Math.abs(offsetMinusDeclared);
  const errorQuirk = Math.abs(offsetMinusDeclared - scrollbarSize);
  if (scrollbarSize > 0 && errorQuirk < errorNoQuirk) {
    // Recover the true subpixel scrollbar gutter from `offsetWidth -
    // declaredBorderBox` (integer minus subpixel retains the fractional
    // part of the subpixel term — more precise than the integer-only
    // `offsetWidth - clientWidth - border` math above). Add it once to
    // restore the declared content width that Chrome omitted from
    // `style.width`, and once more for the intrinsic = border-box +
    // scrollbar rule.
    return declaredBorderBox + 2 * offsetMinusDeclared;
  }

  return declaredBorderBox + scrollbarSize;
}
