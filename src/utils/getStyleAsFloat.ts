import { getStyle } from './getStyle';

/**
 * Returns the computed value of an element's style property transformed into
 * a float value.
 */
export function getStyleAsFloat(el: Element, styleProp: string) {
  return parseFloat(getStyle(el, styleProp)) || 0;
}
