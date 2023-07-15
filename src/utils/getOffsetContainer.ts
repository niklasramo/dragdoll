import { getStyle } from './getStyle.js';
import { isContainingBlockForFixedElement } from './isContainingBlockForFixedElement.js';
import { isContainingBlockForAbsoluteElement } from './isContainingBlockForAbsoluteElement.js';
import { isDocument } from './isDocument.js';

/**
 * Returns the element's offset container (not to be mistaken with the native
 * element.offsetParent), which in this specific case means the closest ancestor
 * element/document/window, that the target element's left/right/top/bottom CSS
 * properties are relative to.
 */
export function getOffsetContainer(element: Element, parentElement?: Element) {
  const style = getStyle(element);

  // If the element's display is "none" or "contents" the element's "left",
  // "top", "right" and "bottom" properties do not have any effect.
  const { display } = style;
  if (display === 'none' || display === 'contents') {
    return null;
  }

  switch (style.position) {
    // Relative element's offset container is always the element itself.
    case 'relative': {
      return element;
    }

    // Fixed element's offset container is always it's containing block.
    case 'fixed': {
      let container = parentElement || element.parentNode;
      while (container && !isDocument(container)) {
        if (container instanceof Element) {
          const isContainingBlock = isContainingBlockForFixedElement(container);
          if (isContainingBlock === true) return container;
          if (isContainingBlock === undefined) return null;
          container = container.parentNode;
        } else if (container instanceof ShadowRoot) {
          container = container.host;
        } else {
          container = container.parentNode;
        }
      }
      return element.ownerDocument.defaultView;
    }

    // Absolute element's offset container is always it's containing block,
    // except that it's root containing block is not window (as with fixed), but
    // document instead.
    case 'absolute': {
      let container = parentElement || element.parentNode;
      while (container && !isDocument(container)) {
        if (container instanceof Element) {
          const isContainingBlock = isContainingBlockForAbsoluteElement(container);
          if (isContainingBlock === true) return container;
          if (isContainingBlock === undefined) return null;
          container = container.parentNode;
        } else if (container instanceof ShadowRoot) {
          container = container.host;
        } else {
          container = container.parentNode;
        }
      }
      return element.ownerDocument;
    }

    // For any other values we return null.
    default: {
      return null;
    }
  }
}
