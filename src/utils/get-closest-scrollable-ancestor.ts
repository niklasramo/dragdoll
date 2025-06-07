import { isScrollable } from './is-scrollable.js';
import { isDocument } from './is-document.js';

/**
 * Compute the element's scrollable ancestor elements.
 */
export function getClosestScrollableAncestor(element: Element | Document | null) {
  let parent = element?.parentNode;

  while (parent && !isDocument(parent)) {
    if (parent instanceof Element) {
      if (isScrollable(parent)) return parent;
      parent = parent.parentNode;
    } else if (parent instanceof ShadowRoot) {
      parent = parent.host;
    } else {
      parent = parent.parentNode;
    }
  }

  return window;
}
