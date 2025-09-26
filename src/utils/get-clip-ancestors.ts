import { isDocument } from './is-document.js';
import { getStyle } from './get-style.js';

const VISIBLE_OVERFLOW = 'visible';

/**
 * Compute the element's clip ancestor elements.
 */
export function getClipAncestors(
  element: Element | Document | null,
  includeElement: boolean,
  result: (Element | Window)[] = [],
) {
  let parent = includeElement ? element : element?.parentNode;

  // Reset the result array.
  result.length = 0;

  while (parent && !isDocument(parent)) {
    if (parent instanceof Element) {
      const style = getStyle(parent);
      // TODO: Account for clip value, which is special. We will need to
      // provide offset values for the clip container in the result array.
      // At the moment this logic does not account for senario where we have
      // clip and visible overflow on the same element for different axes. And
      // also it does not account for overflow-clip-margin property, which is
      // a bit experimental atm.
      if (!(style.overflowY === VISIBLE_OVERFLOW || style.overflowX === VISIBLE_OVERFLOW)) {
        result.push(parent);
      }
      parent = parent.parentNode;
    } else if (parent instanceof ShadowRoot) {
      parent = parent.host;
    } else {
      parent = parent.parentNode;
    }
  }

  // Always push window to the results (as last clip container element).
  result.push(window);

  return result;
}
