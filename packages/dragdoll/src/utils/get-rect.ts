import type { Rect } from '../types.js';
import { getStyle } from './get-style.js';
import { isWindow } from './is-window.js';

const SCROLLABLE_OVERFLOWS = new Set(['auto', 'scroll']);

// Returns the padding-box rect of an element (or window) in
// client coordinates (i.e. relative to the viewport, same as
// getBoundingClientRect).
//
// This is a zero-allocation fast-path that replaces
// mezr.getRect([element, 'padding'], window) -- the only
// call pattern used in this codebase. If result is provided
// it is mutated in-place and returned; otherwise a new object
// is allocated.
export function getClientPaddingRect(element: Element | Window, result?: Rect): Rect {
  const r = result || ({ x: 0, y: 0, width: 0, height: 0 } as Rect);

  if (isWindow(element)) {
    r.x = 0;
    r.y = 0;
    r.width = element.innerWidth;
    r.height = element.innerHeight;
    return r;
  }

  const bcr = element.getBoundingClientRect();
  const style = getStyle(element);
  const borderLeft = parseFloat(style.borderLeftWidth) || 0;
  const borderRight = parseFloat(style.borderRightWidth) || 0;
  const borderTop = parseFloat(style.borderTopWidth) || 0;
  const borderBottom = parseFloat(style.borderBottomWidth) || 0;

  // Padding-box offset = border-box offset + border widths.
  r.x = bcr.left + borderLeft;
  r.y = bcr.top + borderTop;

  // Padding-box size = border-box size - borders.
  let w = bcr.width - borderLeft - borderRight;
  let h = bcr.height - borderTop - borderBottom;

  // Subtract scrollbar sizes (only for non-document-element with scrollable
  // overflow).
  const el = element;
  if (el !== el.ownerDocument.documentElement) {
    if (SCROLLABLE_OVERFLOWS.has(style.overflowY)) {
      w -= Math.max(0, Math.round(w) - el.clientWidth);
    }
    if (SCROLLABLE_OVERFLOWS.has(style.overflowX)) {
      h -= Math.max(0, Math.round(h) - el.clientHeight);
    }
  }

  r.width = w;
  r.height = h;

  return r;
}
