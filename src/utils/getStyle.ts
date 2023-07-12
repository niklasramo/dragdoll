export const STYLES_CACHE: WeakMap<Element, CSSStyleDeclaration> = new WeakMap();

/**
 * Returns the computed value of an element's style property as a string.
 */
export function getStyle(element: Element, prop: string) {
  if (!prop) return '';

  let styleDeclaration: CSSStyleDeclaration | undefined = STYLES_CACHE.get(element);
  if (!styleDeclaration) {
    styleDeclaration = window.getComputedStyle(element, null);
    STYLES_CACHE.set(element, styleDeclaration);
  }

  return styleDeclaration.getPropertyValue(prop);
}
