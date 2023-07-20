import { getStyle } from './getStyle.js';

const SCROLLABLE_OVERFLOWS = new Set(['auto', 'scroll', 'overlay']);

/**
 * Check if element is scrollable.
 */
export function isScrollable(element: Element) {
  const style = getStyle(element);
  return !!(SCROLLABLE_OVERFLOWS.has(style.overflowY) || SCROLLABLE_OVERFLOWS.has(style.overflowX));
}
