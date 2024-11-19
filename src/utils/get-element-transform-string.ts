import { getIntrinsicHeight } from './get-intrinsic-height.js';
import { getIntrinsicWidth } from './get-intrinsic-width.js';
import { getStyle } from './get-style.js';

export function getElementTransformString(
  el: HTMLElement | SVGSVGElement,
  ignoreNormalTransform = false,
) {
  const { translate, rotate, scale, transform } = getStyle(el);
  let transformString = '';

  // Parse translate shorthand.
  if (translate && translate !== 'none') {
    let [x = '0px', y = '0px', z] = translate.split(' ');

    // Transform x to pixels if it's a percentage.
    if (x.includes('%')) {
      x = `${(parseFloat(x) / 100) * getIntrinsicWidth(el)}px`;
    }

    // Transform y to pixels if it's a percentage.
    if (y.includes('%')) {
      y = `${(parseFloat(y) / 100) * getIntrinsicHeight(el)}px`;
    }

    // z can never be a percentage, but if it is defined we need to use
    // translate3d instead of translate.
    if (z) {
      transformString += `translate3d(${x},${y},${z})`;
    } else {
      transformString += `translate(${x},${y})`;
    }
  }

  // Parse rotate shorthand.
  if (rotate && rotate !== 'none') {
    const rotateValues = rotate.split(' ');
    if (rotateValues.length > 1) {
      transformString += `rotate3d(${rotateValues.join(',')})`;
    } else {
      transformString += `rotate(${rotateValues.join(',')})`;
    }
  }

  // Parse scale shorthand.
  if (scale && scale !== 'none') {
    const scaleValues = scale.split(' ');
    if (scaleValues.length === 3) {
      transformString += `scale3d(${scaleValues.join(',')})`;
    } else {
      transformString += `scale(${scaleValues.join(',')})`;
    }
  }

  // Parse transform.
  if (!ignoreNormalTransform && transform && transform !== 'none') {
    transformString += transform;
  }

  return transformString;
}
