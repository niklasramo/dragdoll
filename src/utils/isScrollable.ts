import { getStyle } from './getStyle';

const SCROLLABLE_OVERFLOWS = new Set(['auto', 'scroll', 'overlay']);

/**
 * Check if element is scrollable.
 */
export function isScrollable(element: HTMLElement) {
  return !!(
    SCROLLABLE_OVERFLOWS.has(getStyle(element, 'overflow')) ||
    SCROLLABLE_OVERFLOWS.has(getStyle(element, 'overflow-x')) ||
    SCROLLABLE_OVERFLOWS.has(getStyle(element, 'overflow-y'))
  );
}
