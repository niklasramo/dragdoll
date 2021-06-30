/**
 * Transform x and y coordinates into CSS transform style property's value.
 *
 * @param {number} x
 * @param {number} y
 * @param {boolean} [translate3d=false]
 * @returns {string}
 */
export function createTranslate(x: number, y: number, translate3d = false) {
  return translate3d
    ? 'translate3d(' + x + 'px, ' + y + 'px, 0px)'
    : 'translateX(' + x + 'px) translateY(' + y + 'px)';
}
