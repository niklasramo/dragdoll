import { getStyle } from './getStyle';

const transformNone = 'none';
const rxMat3d = /^matrix3d/;
const rxMatTx = /([^,]*,){4}/;
const rxMat3dTx = /([^,]*,){12}/;
const rxNextItem = /[^,]*,/;

/**
 * Returns the element's computed translateX and translateY values as a floats.
 */
export function getTranslate(
  element: HTMLElement,
  result: { x: number; y: number } = { x: 0, y: 0 }
) {
  const transform = getStyle(element, 'transform');

  if (!transform || transform === transformNone) {
    result.x = 0;
    result.y = 0;
    return result;
  }

  // Transform style can be in either matrix3d(...) or matrix(...).
  const isMat3d = rxMat3d.test(transform);
  const tX = transform.replace(isMat3d ? rxMat3dTx : rxMatTx, '');
  const tY = tX.replace(rxNextItem, '');

  result.x = parseFloat(tX) || 0;
  result.y = parseFloat(tY) || 0;
  return result;
}
