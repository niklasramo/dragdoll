import { isScrollable } from './isScrollable';

/**
 * Compute the element's scrollable ancestor elements.
 */
export function getScrollableAncestors(
  element: Element | Document | null,
  result: (Element | Window)[] = [],
) {
  let parent: Element | Document | ShadowRoot | null = null;

  // Find scrollable ancestors.
  while (element) {
    // Get the parent node of the current element. In case the element is in
    // the shadow DOM the parent might also be a ShadowRoot object.
    parent = element.parentNode as Element | Document | ShadowRoot | null;

    // Make sure parent exists and it's not document.
    if (!parent || parent instanceof Document) {
      break;
    }

    // If element's parent is ShadowRoot let's get the host element as the
    // next element. Otherwise let's get the element's parent node normally.
    element = 'host' in parent ? parent.host : parent;

    // If element is scrollable let's add it to the scrollable list.
    if (isScrollable(element)) {
      result.push(element);
    }
  }

  // Always push window to the results (as last scrollable element).
  result.push(window);

  return result;
}
