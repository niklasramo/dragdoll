import { isScrollable } from './is-scrollable.js';
import { isDocument } from './is-document.js';

/**
 * Compute the element's scrollable ancestor elements.
 */
export function getScrollableAncestors(
  element: Element | Document | null,
  result: (Element | Window)[] = [],
) {
  let parent = element?.parentNode;

  // Reset the result array.
  result.length = 0;

  while (parent && !isDocument(parent)) {
    if (parent instanceof Element) {
      if (isScrollable(parent)) result.push(parent);
      parent = parent.parentNode;
    } else if (parent instanceof ShadowRoot) {
      parent = parent.host;
    } else {
      parent = parent.parentNode;
    }
  }

  // Always push window to the results (as last scrollable element).
  result.push(window);

  return result;
}
