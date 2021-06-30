import { getStyle } from './getStyle';

/**
 * Returns the computed value of an element's style property transformed into
 * a float value.
 *
 * @param {HTMLElement} el
 * @param {string} style
 * @returns {number}
 */
export function getStyleAsFloat(el: HTMLElement, styleProp: string) {
  return parseFloat(getStyle(el, styleProp)) || 0;
}
