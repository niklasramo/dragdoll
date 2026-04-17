import { getStyle } from './get-style.js';

export function getIntrinsicHeight(element: HTMLElement | SVGSVGElement) {
  const style = getStyle(element);

  if (style.boxSizing === 'border-box') {
    return parseFloat(style.height) || 0;
  }

  // Content-box: intrinsic = border-box + scrollbar gutter. All values
  // from `getComputedStyle()` are subpixel-accurate.
  const height = parseFloat(style.height) || 0;
  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const borderBottom = parseFloat(style.borderBottomWidth) || 0;
  const paddingTop = parseFloat(style.paddingTop) || 0;
  const paddingBottom = parseFloat(style.paddingBottom) || 0;
  const borderSum = borderTop + borderBottom;
  const paddingSum = paddingTop + paddingBottom;
  const declaredBorderBox = height + paddingSum + borderSum;

  // SVG has no scrollbar concerns and no reliable `offsetHeight` to
  // cross-check against, so trust the computed style values directly.
  if (!(element instanceof HTMLElement)) {
    return declaredBorderBox;
  }

  // Cache layout-triggering reads locally to avoid repeated DOM access.
  const offsetHeight = element.offsetHeight;
  const clientHeight = element.clientHeight;

  // Scrollbar gutter from integer-precision sources. `offsetHeight -
  // clientHeight` gives `border + scrollbar`; subtract the borders to
  // isolate the scrollbar. On integer DPR we round the border sum to
  // match the integer math in `offsetHeight`/`clientHeight`; on
  // fractional DPR the scrollbar itself is fractional so we keep the
  // float form. `Math.max` guards against ±0.5 rounding at the boundary.
  const scrollbarPlusBorder = offsetHeight - clientHeight;
  const scrollbarSize = Math.max(
    0,
    Number.isInteger(window.devicePixelRatio)
      ? scrollbarPlusBorder - Math.round(borderSum)
      : scrollbarPlusBorder - borderSum,
  );

  // Chrome quirk: when a classic (gutter-consuming) scrollbar is
  // rendered, `getComputedStyle().height` returns the visible content
  // area (declared content height minus one scrollbar gutter) rather
  // than the declared content height itself — confirmed on Chrome
  // Linux, Windows, and macOS with classic scrollbars. Firefox and
  // Safari return the declared content height. Each behaviour predicts
  // a different `offsetHeight`: the quirk predicts `declaredBorderBox +
  // scrollbar`, otherwise `declaredBorderBox`. We pick whichever story
  // matches reality more closely — no fixed threshold, so it stays
  // accurate at fractional DPR / browser zoom where rounding error on
  // `offsetHeight`/`clientHeight` can approach ±1.5 CSS px. The two
  // stories differ by roughly the scrollbar gutter (12–17 px
  // typically), so the correct one wins by a wide margin.
  const offsetMinusDeclared = offsetHeight - declaredBorderBox;
  const errorNoQuirk = Math.abs(offsetMinusDeclared);
  const errorQuirk = Math.abs(offsetMinusDeclared - scrollbarSize);
  if (scrollbarSize > 0 && errorQuirk < errorNoQuirk) {
    // Recover the true subpixel scrollbar gutter from `offsetHeight -
    // declaredBorderBox` (integer minus subpixel retains the fractional
    // part of the subpixel term — more precise than the integer-only
    // `offsetHeight - clientHeight - border` math above). Add it once
    // to restore the declared content height that Chrome omitted from
    // `style.height`, and once more for the intrinsic = border-box +
    // scrollbar rule.
    return declaredBorderBox + 2 * offsetMinusDeclared;
  }

  return declaredBorderBox + scrollbarSize;
}
